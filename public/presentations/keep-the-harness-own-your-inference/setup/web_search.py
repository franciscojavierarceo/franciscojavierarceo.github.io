#!/usr/bin/env python3
"""Verify that a configured gateway actually executes web search."""
import json
from pathlib import Path
from check_setup import model, request, text

if __name__ == '__main__':
    response = request('/v1/responses', {
        'model': model(), 'store': True, 'max_output_tokens': 1200,
        'input': 'Search the web for the vllm-project/agentic-api documentation. Summarize its purpose and include the source URL.',
        'tools': [{'type': 'web_search'}], 'tool_choice': {'type': 'web_search'}})
    root = Path('runs')
    root.mkdir(exist_ok=True)
    (root / 'web-search.json').write_text(json.dumps(response, indent=2) + '\n')
    searches = [item for item in response.get('output', []) if item.get('type') == 'web_search_call']
    if response.get('status') != 'completed' or not searches or any(item.get('status') != 'completed' for item in searches):
        raise RuntimeError('No completed web_search_call; inspect runs/web-search.json and gateway provider configuration')
    print('PASS: gateway returned completed web_search_call items')
    print(text(response))
