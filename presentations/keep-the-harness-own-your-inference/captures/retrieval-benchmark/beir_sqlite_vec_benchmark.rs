use std::{
    collections::{BTreeMap, HashMap},
    fs::File,
    io::{BufReader, BufWriter},
    path::PathBuf,
    sync::Arc,
    time::Instant,
};

use agentic_core::{
    storage::create_pool_with_schema,
    tool::file_search::{FileSearchRepository, PreparedAttachment, SqliteVecRepository, StoredChunk},
    types::file_search::{
        ChunkingStrategy, FileCounts, FileObject, SearchMode, SearchQuery, SearchRequest, StaticChunking,
        VectorStoreFileObject, VectorStoreObject,
    },
};
use serde::Deserialize;
use tokio_util::sync::CancellationToken;

#[derive(Deserialize)]
struct Input {
    documents: Vec<Document>,
    queries: Vec<Query>,
}

#[derive(Deserialize)]
struct Document {
    id: String,
    chunks: Vec<Chunk>,
}

#[derive(Deserialize)]
struct Chunk {
    text: String,
    embedding: Vec<f64>,
}

#[derive(Deserialize)]
struct Query {
    id: String,
    text: String,
    embedding: Vec<f64>,
}

#[tokio::test]
#[ignore = "run manually with BEIR_BENCHMARK_INPUT and SQLITE_VEC_EXTENSION_PATH"]
#[expect(
    clippy::too_many_lines,
    reason = "one benchmark scenario loads a corpus, indexes it, and evaluates all queries"
)]
async fn beir_sqlite_vec() {
    let started = Instant::now();
    let input_path = PathBuf::from(std::env::var_os("BEIR_BENCHMARK_INPUT").expect("set BEIR_BENCHMARK_INPUT"));
    let output_path = PathBuf::from(std::env::var_os("BEIR_BENCHMARK_OUTPUT").expect("set BEIR_BENCHMARK_OUTPUT"));
    let extension_path =
        PathBuf::from(std::env::var_os("SQLITE_VEC_EXTENSION_PATH").expect("set SQLITE_VEC_EXTENSION_PATH"));
    let input: Input = serde_json::from_reader(BufReader::new(File::open(input_path).unwrap())).unwrap();
    let directory = tempfile::tempdir().unwrap();
    let url = format!("sqlite://{}?mode=rwc", directory.path().join("beir.db").display());
    let pool = create_pool_with_schema(Some(&url)).await.unwrap();
    let repository = SqliteVecRepository::open(Arc::clone(&pool), &extension_path)
        .await
        .unwrap();
    let store = VectorStoreObject {
        id: format!("vs_{}", uuid::Uuid::now_v7()),
        object: "vector_store".into(),
        created_at: 1,
        name: "BEIR".into(),
        usage_bytes: 0,
        file_counts: FileCounts::default(),
        status: "completed".into(),
        metadata: BTreeMap::new(),
    };
    let mut attachments = Vec::with_capacity(input.documents.len());
    let mut original_ids = HashMap::with_capacity(input.documents.len());
    let cancelled = CancellationToken::new();
    for (index, doc) in input.documents.into_iter().enumerate() {
        let file_id = format!("file_{}", uuid::Uuid::now_v7());
        let filename = format!("{}.txt", doc.id);
        let usage_bytes: i64 = doc
            .chunks
            .iter()
            .map(|chunk| i64::try_from(chunk.text.len()).unwrap())
            .sum();
        let file = FileObject {
            id: file_id.clone(),
            object: "file".into(),
            bytes: usage_bytes,
            created_at: 1,
            filename: filename.clone(),
            purpose: "assistants".into(),
            status: "processed".into(),
        };
        repository
            .stage_blob_cleanup(&file_id, "benchmark", i64::MAX)
            .await
            .unwrap();
        repository
            .upload_file_metadata(&file, "text/plain", "benchmark", &cancelled)
            .await
            .unwrap();
        let chunks = doc
            .chunks
            .into_iter()
            .enumerate()
            .map(|(chunk_index, chunk)| StoredChunk {
                file_id: file_id.clone(),
                filename: filename.clone(),
                chunk_index,
                text: chunk.text,
                embedding: Some(chunk.embedding),
                attributes: BTreeMap::new(),
            })
            .collect();
        attachments.push(PreparedAttachment {
            object: VectorStoreFileObject {
                id: file_id.clone(),
                object: "vector_store.file".into(),
                created_at: 1,
                vector_store_id: store.id.clone(),
                status: "completed".into(),
                usage_bytes,
                attributes: BTreeMap::new(),
                chunking_strategy: ChunkingStrategy::Static {
                    config: StaticChunking {
                        max_chunk_size_tokens: 512,
                        chunk_overlap_tokens: 128,
                    },
                },
                last_error: None,
            },
            chunks,
            dimensions: 768,
        });
        original_ids.insert(file_id, doc.id);
        if (index + 1) % 500 == 0 {
            eprintln!(
                "uploaded {} files in {:.1}s",
                index + 1,
                started.elapsed().as_secs_f64()
            );
        }
    }
    eprintln!("indexing {} files", attachments.len());
    repository
        .create_store(&store, "nomic-ai/nomic-embed-text-v1.5", &attachments)
        .await
        .unwrap();
    drop(attachments);
    eprintln!("index ready in {:.1}s", started.elapsed().as_secs_f64());
    let mut results: BTreeMap<String, BTreeMap<String, f64>> = BTreeMap::new();
    for (index, query) in input.queries.into_iter().enumerate() {
        let request = SearchRequest {
            query: SearchQuery::Text(query.text.clone()),
            max_num_results: Some(10),
            search_mode: Some(SearchMode::Semantic),
            ..SearchRequest::default()
        };
        let hits = repository
            .search(
                std::slice::from_ref(&store.id),
                &[query.text],
                &[query.embedding],
                Some(768),
                SearchMode::Semantic,
                &request,
            )
            .await
            .unwrap();
        let mut scores: BTreeMap<String, f64> = BTreeMap::new();
        for hit in hits {
            let doc_id = original_ids.get(&hit.file_id).unwrap();
            scores
                .entry(doc_id.clone())
                .and_modify(|old| *old = old.max(hit.score))
                .or_insert(hit.score);
        }
        results.insert(query.id, scores);
        if (index + 1) % 25 == 0 {
            eprintln!(
                "searched {} queries in {:.1}s",
                index + 1,
                started.elapsed().as_secs_f64()
            );
        }
    }
    serde_json::to_writer(BufWriter::new(File::create(output_path).unwrap()), &results).unwrap();
    eprintln!("finished in {:.1}s", started.elapsed().as_secs_f64());
}
