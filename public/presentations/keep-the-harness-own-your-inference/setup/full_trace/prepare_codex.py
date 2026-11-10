#!/usr/bin/env python3
"""Prepare an isolated Codex catalog and an editable workshop fixture."""
import argparse
import json
import os
from pathlib import Path
import shutil
import subprocess


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, required=True)
    parser.add_argument('--base-url', default='http://127.0.0.1:9004/v1')
    parser.add_argument('--model', default=os.environ.get('AIE_MODEL'))
    parser.add_argument('--editable', action='store_true', help='Copy the captured buggy implementation and unchanged tests')
    args = parser.parse_args()
    if not args.model:
        parser.error('Pass --model or set AIE_MODEL to an exact served model ID')
    root = args.root.expanduser().resolve()
    if root.exists() and any(root.iterdir()):
        parser.error('Use a fresh --root directory; existing recordings are not overwritten')
    home, workspace = root / 'codex-home', root / 'workspace'
    home.mkdir(parents=True)
    workspace.mkdir()
    catalog = json.loads(Path(__file__).with_name('codex-model.json').read_text())
    entry = catalog['models'][0]
    entry.update(slug=args.model, display_name=args.model, context_window=32768, max_context_window=32768,
                 base_instructions='You are a concise coding assistant. Inspect the Python files, reproduce the bug, make the requested edit and run the unchanged tests. Report only results you observed. Do not use the network.')
    entry['truncation_policy'] = {'limit': 24000, 'mode': 'tokens'}
    (home / 'models.json').write_text(json.dumps(catalog))
    q = json.dumps
    key = 'true' if os.environ.get('AGENTIC_GATEWAY_API_KEY') else 'false'
    (home / 'config.toml').write_text(f'''model = {q(args.model)}
model_provider = "agentic-api"
model_catalog_json = {q(str(home / 'models.json'))}
model_reasoning_effort = "low"
web_search = "disabled"
sandbox_mode = {q('workspace-write' if args.editable else 'read-only')}
[model_providers.agentic-api]
name = "Agentic API"
base_url = {q(args.base_url)}
wire_api = "responses"
requires_openai_auth = {key}
supports_websockets = false
''')
    # Resolve fixtures in either the downloadable kit or the workshop source tree.
    script = Path(__file__).resolve()
    kit_fixture = script.parents[1] / 'penalty'
    fixture = kit_fixture if kit_fixture.exists() else script.parents[2] / 'penalty-demo'
    shutil.copy2(fixture / ('before' if args.editable else 'after') / 'penalty.py', workspace / 'penalty.py')
    tests = fixture / 'before/test_penalty.py' if kit_fixture.exists() else fixture / 'test_penalty.py'
    shutil.copy2(tests, workspace / 'test_penalty.py')
    subprocess.run(['git', 'init', '--quiet'], cwd=workspace, check=True)
    subprocess.run(['git', 'add', 'penalty.py', 'test_penalty.py'], cwd=workspace, check=True)
    (root / 'gateway').mkdir()
    print('Prepared:', root)
    print('Model:', args.model)
    print('Workspace:', workspace)


if __name__ == '__main__':
    main()
