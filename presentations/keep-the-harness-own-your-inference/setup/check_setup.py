#!/usr/bin/env python3
"""Check a workshop gateway and make one real Responses request; standard library only."""
import json
import os
import urllib.request


def request(path, payload=None):
    base = os.environ.get('AIE_GATEWAY_URL', 'http://127.0.0.1:9000').rstrip('/')
    if not base.startswith(('http://', 'https://')) or base.endswith('/v1'):
        raise ValueError('Use a gateway origin such as http://127.0.0.1:9000, without /v1')
    headers = {'Content-Type': 'application/json'}
    if key := os.environ.get('AGENTIC_GATEWAY_API_KEY'):
        headers['Authorization'] = 'Bearer ' + key
    body = None if payload is None else json.dumps(payload).encode()
    with urllib.request.urlopen(urllib.request.Request(base + path, body, headers), timeout=240) as response:
        return json.load(response)


def text(response):
    return '\n'.join(part.get('text', '') for item in response.get('output', [])
                     for part in item.get('content', []) if part.get('type') == 'output_text')


def model():
    value = os.environ.get('AIE_MODEL')
    if not value:
        raise ValueError('Set AIE_MODEL to an ID advertised by /v1/models')
    return value


if __name__ == '__main__':
    available = [item['id'] for item in request('/v1/models')['data']]
    selected = model()
    if selected not in available:
        raise RuntimeError(f'Model {selected!r} not served; available: {available}')
    response = request('/v1/responses', {'model': selected, 'input': 'Reply with the word pong.',
                                       'max_output_tokens': 128, 'store': False})
    if response.get('status') != 'completed':
        raise RuntimeError(response)
    print('PASS: model advertised; Responses request completed')
    print(text(response))
