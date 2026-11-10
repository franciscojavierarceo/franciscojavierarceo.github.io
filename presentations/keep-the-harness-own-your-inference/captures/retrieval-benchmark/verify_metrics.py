#!/usr/bin/env python3
"""Recompute Agentic API retrieval metrics from the saved rankings and BEIR qrels.

Install pytrec-eval-terrier. This does not rerun embedding generation or inference.
"""
import json
from pathlib import Path
import pytrec_eval

root = Path(__file__).resolve().parent
for dataset in ['nfcorpus', 'scifact', 'arguana']:
    path = root / dataset
    qrels = json.loads((path / 'qrels.json').read_text())
    results = json.loads((path / 'results.json').read_text())
    report = json.loads((path / 'report.json').read_text())
    per_query = pytrec_eval.RelevanceEvaluator(qrels, {'ndcg_cut_10', 'recall_10', 'map_cut_10'}).evaluate(results)
    assert len(per_query) == len(results) == report['judged_queries']
    for metric, expected in report['sqlite_vec'].items():
        actual = round(sum(row[metric] for row in per_query.values()) / len(per_query), 6)
        assert actual == expected, (dataset, metric, actual, expected)
    print(dataset, report['judged_queries'], 'queries; all 3 metrics match saved report')
