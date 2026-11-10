#!/usr/bin/env python3
"""Run a real local Responses/function/file-search walkthrough using the OpenAI SDK."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import time
from openai import OpenAI


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--base-url', default='http://127.0.0.1:9001/v1')
    parser.add_argument('--model', required=True)
    parser.add_argument('--continuation-base-url')
    parser.add_argument('--corpus', type=Path, required=True)
    parser.add_argument('--capture', type=Path, required=True)
    parser.add_argument('--phase', choices=['function', 'files', 'all'], default='all')
    args = parser.parse_args()
    args.capture.mkdir(parents=True, exist_ok=True)
    client = OpenAI(base_url=args.base_url, api_key=os.environ.get('AGENTIC_GATEWAY_API_KEY', 'local-demo'), timeout=240)
    timeline = args.capture / 'client.jsonl'

    def emit(kind, title, data=None):
        row = {'time': time.time(), 'kind': kind, 'title': title, 'data': data}
        with timeline.open('a') as out:
            out.write(json.dumps(row, ensure_ascii=False) + '\n')
        print(title, flush=True)

    def respond(name, request_client=None, **fields):
        request = {'model': args.model, 'max_output_tokens': 1600, 'store': True, 'stream': True,
                   'extra_body': {'chat_template_kwargs': {'enable_thinking': False}}, **fields}
        target = request_client or client
        emit('routing', 'Responses endpoint', {'base_url': str(target.base_url)})
        emit('request', f'client.responses.create — {name}', request)
        events = []
        final = None
        for event in target.responses.create(**request):
            raw = event.model_dump(mode='json', exclude_none=True)
            events.append(raw)
            emit('event', raw['type'], raw)
            if raw['type'] == 'response.completed':
                final = raw['response']
            if raw['type'] in ('error', 'response.failed'):
                raise RuntimeError(json.dumps(raw))
        if final is None or final.get('status') != 'completed':
            raise RuntimeError(f'{name} did not complete')
        (args.capture / f'{name}.json').write_text(json.dumps({'request': request, 'events': events, 'response': final}, indent=2, ensure_ascii=False) + '\n')
        return final

    if args.phase in ('function', 'all'):
        emit('chapter', '01 / CLIENT-EXECUTED FUNCTION TOOL')
        tool = {'type': 'function', 'name': 'elastic_net_penalty',
                'description': 'Compute the elastic-net penalty for coefficients. Execute this function for numeric questions.',
                'parameters': {'type': 'object', 'properties': {
                    'coefficients': {'type': 'array', 'items': {'type': 'number'}},
                    'alpha': {'type': 'number'}, 'lambda_value': {'type': 'number'}},
                    'required': ['coefficients', 'alpha', 'lambda_value'], 'additionalProperties': False}, 'strict': True}
        first = respond('function-call', input='Call elastic_net_penalty for coefficients [1, -2, 0.5], alpha=0.7 and lambda_value=0.2. Do not calculate it yourself.',
                        tools=[tool], tool_choice={'type': 'function', 'name': 'elastic_net_penalty'})
        calls = [item for item in first['output'] if item['type'] == 'function_call']
        assert len(calls) == 1 and calls[0]['name'] == 'elastic_net_penalty', first
        call = calls[0]
        values = json.loads(call['arguments'])
        assert values == {'coefficients': [1, -2, 0.5], 'alpha': 0.7, 'lambda_value': 0.2}, values
        beta, alpha, lam = values['coefficients'], values['alpha'], values['lambda_value']
        penalty = lam * (alpha * sum(abs(b) for b in beta) + (1-alpha) * sum(b*b for b in beta) / 2)
        emit('execution', 'CLIENT executes elastic_net_penalty', {'call_id': call['call_id'], 'arguments': values, 'penalty': penalty})
        continuation_client = OpenAI(base_url=args.continuation_base_url, api_key=os.environ.get('AGENTIC_GATEWAY_API_KEY', 'local-demo'), timeout=240) if args.continuation_base_url else client
        second = respond('function-answer', request_client=continuation_client, previous_response_id=first['id'],
                         input=[{'type': 'function_call_output', 'call_id': call['call_id'], 'output': json.dumps({'penalty': penalty})}],
                         instructions='Report the returned penalty in one sentence.', tool_choice='none')
        answer = ''.join(part.get('text', '') for item in second['output'] for part in item.get('content', []))
        assert '0.6475' in answer, answer
        emit('verified', 'Tool output incorporated after state rehydration', {'first_response_id': first['id'], 'second_response_id': second['id'], 'answer': answer})

    if args.phase in ('files', 'all'):
        emit('chapter', '02 / UPLOAD PDFS → INDEX → BUILT-IN FILE SEARCH')
        files = []
        for path in sorted(args.corpus.glob('*.pdf')):
            emit('upload', f'client.files.create — {path.name}', {'bytes': path.stat().st_size, 'sha256': hashlib.sha256(path.read_bytes()).hexdigest()})
            with path.open('rb') as stream:
                file = client.files.create(file=stream, purpose='assistants')
            files.append(file)
            emit('uploaded', 'Files API stored PDF', file.model_dump(mode='json'))
        assert len(files) >= 3
        emit('request', 'client.vector_stores.create', {'name': 'Hastie + Tibshirani workshop papers'})
        store = client.vector_stores.create(name='Hastie + Tibshirani workshop papers')
        emit('store', 'Vector store created', store.model_dump(mode='json'))
        for file in files:
            emit('indexing', 'client.vector_stores.files.create_and_poll', {'vector_store_id': store.id, 'file_id': file.id})
            indexed = client.vector_stores.files.create_and_poll(vector_store_id=store.id, file_id=file.id)
            assert indexed.status == 'completed', indexed
            emit('indexed', 'PDF parsed, chunked and indexed', indexed.model_dump(mode='json'))
        direct = client.vector_stores.search(vector_store_id=store.id, query='elastic net grouping effect correlated predictors', max_num_results=3)
        emit('retrieval', 'Inspect actual retrieved passages', direct.model_dump(mode='json'))
        result = respond('file-search',
                         input='Search the uploaded papers. In at most 140 words explain why elastic net can select correlated predictors together, how glmnet fits its regularization path, and why strong rules require a KKT check. Use file_search and cite each source with the exact 【file_id】 marker from the retrieved passages.',
                         tools=[{'type': 'file_search', 'vector_store_ids': [store.id], 'max_num_results': 5}],
                         tool_choice={'type': 'file_search'}, include=['file_search_call.results'])
        searches = [item for item in result['output'] if item['type'] == 'file_search_call']
        assert searches and any(item.get('results') for item in searches), result
        known = {file.id for file in files}
        citations = [annotation for item in result['output'] for part in item.get('content', []) for annotation in part.get('annotations', []) if annotation['type'] == 'file_citation']
        assert citations and all(c['file_id'] in known for c in citations), result
        emit('verified', 'Native file_search_call + file_citation annotations verified', {'vector_store_id': store.id, 'citations': citations, 'file_search_calls': len(searches)})
        emit('request', 'client.responses.retrieve', {'response_id': result['id']})
        stored = client.responses.retrieve(result['id'])
        assert stored.id == result['id']
        emit('persisted', 'Stored response retrieved', {'id': stored.id, 'status': stored.status})
    emit('done', 'Recording capture complete — all assertions passed')


if __name__ == '__main__':
    main()
