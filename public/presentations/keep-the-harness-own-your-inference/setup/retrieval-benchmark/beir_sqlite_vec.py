"""Prepare and score OGX-compatible BEIR retrieval fixtures for sqlite-vec.

Dependencies: sentence-transformers==3.0.1, transformers==4.44.2, einops,
tiktoken, numpy, and pytrec-eval-terrier. Download BEIR's dataset ZIP first.
The Rust runner is ``cargo test -p agentic-server-core --test
beir_sqlite_vec_benchmark -- --ignored --nocapture`` with
BEIR_BENCHMARK_INPUT, BEIR_BENCHMARK_OUTPUT, and SQLITE_VEC_EXTENSION_PATH set.
"""

import argparse
import json
import zipfile
from pathlib import Path

# FiQA exceeds the repository's 10,000-chunk exact-search bound.
DATASETS = ("nfcorpus", "scifact", "arguana")
MODEL = "nomic-ai/nomic-embed-text-v1.5"


def prepare(dataset: str, archive_path: Path, output_dir: Path, batch_size: int) -> None:
    import numpy as np
    import tiktoken
    from sentence_transformers import SentenceTransformer

    output_dir.mkdir(parents=True, exist_ok=True)
    encoding = tiktoken.get_encoding("cl100k_base")
    with zipfile.ZipFile(archive_path) as archive:
        qrels = {}
        for line in archive.read(f"{dataset}/qrels/test.tsv").decode().splitlines()[1:]:
            query_id, document_id, relevance = line.split("\t")
            qrels.setdefault(query_id, {})[document_id] = int(relevance)
        queries = {}
        for line in archive.open(f"{dataset}/queries.jsonl"):
            row = json.loads(line)
            if row["_id"] in qrels:
                queries[row["_id"]] = row["text"][:4096]
        documents = []
        chunk_texts = []
        chunk_ids = []
        for line in archive.open(f"{dataset}/corpus.jsonl"):
            row = json.loads(line)
            title, body = row.get("title", ""), row.get("text", "")
            content = f"{title}\n\n{body}" if title else body
            if not content.strip():
                continue
            tokens = encoding.encode(content)
            pieces = [encoding.decode(tokens[start : start + 512]) for start in range(0, len(tokens), 384)]
            documents.append({"id": row["_id"], "chunks": [{"text": piece} for piece in pieces]})
            chunk_texts.extend(pieces)
            chunk_ids.extend([row["_id"]] * len(pieces))
    print(f"{dataset}: {len(documents)} documents, {len(chunk_texts)} chunks, {len(queries)} queries", flush=True)
    model = SentenceTransformer(MODEL, trust_remote_code=True, device="cpu")
    chunk_vectors = model.encode(chunk_texts, batch_size=batch_size, show_progress_bar=True, normalize_embeddings=True)
    query_ids = list(queries)
    query_vectors = model.encode(
        [queries[query_id] for query_id in query_ids],
        batch_size=batch_size,
        show_progress_bar=True,
        normalize_embeddings=True,
    )
    index = 0
    for document in documents:
        for chunk in document["chunks"]:
            chunk["embedding"] = chunk_vectors[index].tolist()
            index += 1
    with (output_dir / "input.json").open("w") as output:
        json.dump(
            {
                "documents": documents,
                "queries": [
                    {"id": query_id, "text": queries[query_id], "embedding": vector.tolist()}
                    for query_id, vector in zip(query_ids, query_vectors, strict=True)
                ],
            },
            output,
        )
    (output_dir / "qrels.json").write_text(json.dumps(qrels))
    (output_dir / "chunk_ids.json").write_text(json.dumps(chunk_ids))
    np.save(output_dir / "chunk_vectors.npy", chunk_vectors)
    np.save(output_dir / "query_vectors.npy", query_vectors)


def score(dataset: str, output_dir: Path) -> None:
    import numpy as np
    import pytrec_eval

    input_data = json.loads((output_dir / "input.json").read_text())
    qrels = json.loads((output_dir / "qrels.json").read_text())
    observed = json.loads((output_dir / "results.json").read_text())
    chunks = np.load(output_dir / "chunk_vectors.npy")
    queries = np.load(output_dir / "query_vectors.npy")
    chunk_ids = json.loads((output_dir / "chunk_ids.json").read_text())
    exact = {}
    identical_order = 0
    for query, vector in zip(input_data["queries"], queries, strict=True):
        similarities = np.clip(chunks @ vector, 0, 1)
        positions = np.argpartition(-similarities, min(10, len(similarities) - 1))[:10]
        positions = positions[np.argsort(-similarities[positions], kind="stable")]
        scores = {}
        for position in positions:
            document_id = chunk_ids[position]
            scores[document_id] = max(scores.get(document_id, 0), float(similarities[position]))
        exact[query["id"]] = scores
        observed_order = sorted(observed[query["id"]], key=observed[query["id"]].get, reverse=True)
        exact_order = sorted(scores, key=scores.get, reverse=True)
        identical_order += observed_order == exact_order

    metrics = {"ndcg_cut_10", "recall_10", "map_cut_10"}
    evaluator = pytrec_eval.RelevanceEvaluator(qrels, metrics)

    def aggregate(results):
        per_query = evaluator.evaluate(results)
        return {
            metric: round(sum(row[metric] for row in per_query.values()) / len(per_query), 6)
            for metric in sorted(metrics)
        }

    report = {
        "dataset": dataset,
        "documents": len(input_data["documents"]),
        "chunks": len(chunks),
        "judged_queries": len(input_data["queries"]),
        "sqlite_vec": aggregate(observed),
        "exact_cosine": aggregate(exact),
        "identical_top10_document_order": identical_order,
        "search_failures": len(input_data["queries"]) - len(observed),
    }
    print(json.dumps(report, indent=2))
    (output_dir / "report.json").write_text(json.dumps(report, indent=2) + "\n")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=("prepare", "score"))
    parser.add_argument("dataset", choices=DATASETS)
    parser.add_argument("--archive", type=Path, help="BEIR dataset ZIP (required for prepare)")
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--batch-size", type=int, default=16)
    args = parser.parse_args()
    if args.action == "prepare":
        if args.archive is None:
            parser.error("--archive is required for prepare")
        prepare(args.dataset, args.archive, args.output_dir, args.batch_size)
    else:
        score(args.dataset, args.output_dir)


if __name__ == "__main__":
    main()
