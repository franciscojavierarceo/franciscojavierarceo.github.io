#!/usr/bin/env python3
"""Create a fresh stored response, compact by ID, and reuse the complete output window."""
import json
from pathlib import Path
from check_setup import model, request, text

if __name__ == '__main__':
    root = Path('runs')
    root.mkdir(exist_ok=True)
    first = request('/v1/responses', {
        'model': model(), 'store': True, 'max_output_tokens': 256,
        'input': 'Jira ticket DEMO-742: fix retry_delay. No new dependencies. Do not edit tests. Acknowledge these constraints.'})
    if first.get('status') != 'completed':
        raise RuntimeError(first)
    checkpoint = request('/v1/responses/compact', {'model': model(), 'previous_response_id': first['id']})
    (root / 'compact.json').write_text(json.dumps(checkpoint, indent=2) + '\n')
    if checkpoint.get('object') != 'response.compaction' or not any(
            item.get('type') == 'compaction' for item in checkpoint.get('output', [])):
        raise RuntimeError('Expected a response.compaction window; inspect runs/compact.json')
    continued = request('/v1/responses', {
        'model': model(), 'store': False, 'max_output_tokens': 512,
        'input': checkpoint['output'] + [{'role': 'user', 'content': 'Continue the fix. Repeat the constraints first.'}]})
    (root / 'compact-continued.json').write_text(json.dumps(continued, indent=2) + '\n')
    if continued.get('status') != 'completed':
        raise RuntimeError(continued)
    print('PASS: compaction item returned; complete window reused; continuation completed')
    print(text(continued))
    print('Check: DEMO-742, no new dependencies, no test edits. This call does not execute a code fix.')
