"""Native OS smoke test of the public kit against a deterministic local inference fixture.

Exercises the real installed gateway, SDK and Codex binary. No model quality, GPU,
search-provider or cluster validation is claimed. Uses only fixture content.
"""
import http.server
import json
import os
import pty
from pathlib import Path
import shutil
import signal
import socket
import subprocess
import sys
import threading
import time
import urllib.request

KIT = Path(sys.argv[1]).resolve()
RESULT = Path('macos-check-results').resolve()
RESULT.mkdir(exist_ok=True)
seen = []

# Verify attendee model selection, relative roots and POSIX terminal recording on the native OS.
prepared = RESULT / 'relative-take'
subprocess.run([sys.executable, str(KIT/'full_trace/prepare_codex.py'), '--root', str(prepared.relative_to(Path.cwd())), '--model', 'workshop-test', '--base-url', 'http://127.0.0.1:9000/v1', '--editable'], check=True)
assert str(prepared) in (prepared/'codex-home/config.toml').read_text()
assert (prepared/'workspace/penalty.py').read_bytes() == (KIT/'penalty/before/penalty.py').read_bytes()
assert set(subprocess.check_output(['git', 'diff', '--cached', '--name-only'], cwd=prepared/'workspace', text=True).splitlines()) == {'penalty.py', 'test_penalty.py'}
fixture_cli = RESULT / 'terminal-fixture'
fixture_cli.write_text('#!'+sys.executable+'\nimport os\nfrom pathlib import Path\nassert (Path(os.environ["CODEX_HOME"])/"config.toml").is_file()\nassert os.environ.get("OPENAI_API_KEY")=="fixture-gateway-key"\nassert "DECOY_API_KEY" not in os.environ\nprint("PTY_FIXTURE_OK")\n')
fixture_cli.chmod(0o755)
master, slave = pty.openpty()
terminal_env = {**os.environ, 'AGENTIC_GATEWAY_API_KEY': 'fixture-gateway-key', 'DECOY_API_KEY': 'not-forwarded'}
terminal = subprocess.Popen([sys.executable, str(KIT/'full_trace/record_tui.py'), '--root', str(prepared.relative_to(Path.cwd())), '--codex', str(fixture_cli)], stdin=slave, stdout=slave, stderr=slave, env=terminal_env)
os.close(slave)
terminal_output = b''
try:
    while True:
        try:
            data = os.read(master, 65536)
        except OSError:
            break
        if not data:
            break
        terminal_output += data
finally:
    os.close(master)
assert terminal.wait(timeout=20) == 0, terminal_output
assert 'PTY_FIXTURE_OK' in (prepared/'terminal.cast').read_text()
print('PASS: native POSIX PTY recording, attendee model, absolute CODEX_HOME, selective credential forwarding')


def run(args, **kwargs):
    p = subprocess.run(args, text=True, capture_output=True, timeout=120, **kwargs)
    print('COMMAND:', ' '.join(map(str, args)), '\n', p.stdout, p.stderr, flush=True)
    if p.returncode:
        raise RuntimeError(f'Command failed with {p.returncode}')
    return p


class Handler(http.server.BaseHTTPRequestHandler):
    def log_message(self, *_):
        pass

    def reply(self, payload):
        data = json.dumps(payload).encode()
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        if self.path.startswith('/v1/models'):
            self.reply({'object': 'list', 'data': [{'id': 'workshop-test', 'object': 'model', 'owned_by': 'deterministic-fixture', 'max_model_len': 32768}]})
        elif self.path == '/health':
            self.reply({'status': 'ok'})
        else:
            self.send_error(404)

    def do_POST(self):
        request = json.loads(self.rfile.read(int(self.headers['Content-Length'])))
        seen.append(request)
        if self.path != '/v1/responses':
            self.send_error(404)
            return
        content = json.dumps(request.get('input', ''))
        number = len(seen)
        has_result = 'function_call_output' in content
        tool = request.get('tool_choice')
        function = isinstance(tool, dict) and tool.get('name') == 'elastic_net_penalty' and not has_result
        message = '0.6475' if has_result else ('DEMO-742; no new dependencies; do not edit tests; standard library only; cap 12 seconds; zero is valid; next action: fix retry_delay.' if 'DEMO-742' in content else 'pong')
        item = ({'type': 'function_call', 'id': f'fc_{number}', 'call_id': 'call_penalty', 'name': 'elastic_net_penalty', 'arguments': json.dumps({'coefficients': [1, -2, .5], 'alpha': .7, 'lambda_value': .2}), 'status': 'completed'} if function else {'type': 'message', 'id': f'msg_{number}', 'role': 'assistant', 'status': 'completed', 'content': [{'type': 'output_text', 'text': message, 'annotations': []}]})
        response = {'id': f'resp_fixture_{number}', 'object': 'response', 'created_at': int(time.time()), 'status': 'completed', 'model': request.get('model', 'workshop-test'), 'output': [item], 'usage': {'input_tokens': 20, 'output_tokens': 10, 'total_tokens': 30}, 'error': None, 'incomplete_details': None}
        if not request.get('stream'):
            self.reply(response)
            return
        events = []
        def event(kind, **fields):
            events.append({'type': kind, 'sequence_number': len(events), **fields})
        empty = {**response, 'status': 'in_progress', 'output': []}
        event('response.created', response=empty)
        event('response.in_progress', response=empty)
        if function:
            event('response.output_item.added', output_index=0, item={**item, 'status': 'in_progress', 'arguments': ''})
            event('response.function_call_arguments.delta', output_index=0, item_id=item['id'], delta=item['arguments'])
            event('response.function_call_arguments.done', output_index=0, item_id=item['id'], arguments=item['arguments'])
        else:
            event('response.output_item.added', output_index=0, item={**item, 'status': 'in_progress', 'content': []})
            part = {'type': 'output_text', 'text': '', 'annotations': []}
            event('response.content_part.added', output_index=0, item_id=item['id'], content_index=0, part=part)
            event('response.output_text.delta', output_index=0, item_id=item['id'], content_index=0, delta=message)
            event('response.output_text.done', output_index=0, item_id=item['id'], content_index=0, text=message)
            event('response.content_part.done', output_index=0, item_id=item['id'], content_index=0, part=item['content'][0])
        event('response.output_item.done', output_index=0, item=item)
        event('response.completed', response=response)
        data = ''.join('event: '+e['type']+'\ndata: '+json.dumps(e)+'\n\n' for e in events).encode()+b'data: [DONE]\n\n'
        self.send_response(200)
        self.send_header('Content-Type', 'text/event-stream')
        self.send_header('Content-Length', str(len(data)))
        self.end_headers()
        self.wfile.write(data)


def port():
    with socket.socket() as s:
        s.bind(('127.0.0.1', 0))
        return s.getsockname()[1]


server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), Handler)
threading.Thread(target=server.serve_forever, daemon=True).start()
gateway_port = port()
gateway_url = f'http://127.0.0.1:{gateway_port}'
upstream = f'http://127.0.0.1:{server.server_port}'
env = os.environ.copy()
env.update(AIE_MODEL='workshop-test', AIE_GATEWAY_URL=gateway_url, AGENTIC_API_HOME=str(RESULT/'runtime'), AIE_CAPTURE_DIR=str(RESULT/'captures'))
agentic = os.environ.get('AGENTIC_BIN') or shutil.which('agentic')
log = (RESULT/'gateway.log').open('w')
process = subprocess.Popen([agentic, 'serve', '--upstream', upstream, '--gateway-port', str(gateway_port), '--database-url', 'sqlite://'+str(RESULT/'gateway.db')], env=env, stdout=log, stderr=subprocess.STDOUT, start_new_session=True)
try:
    for _ in range(120):
        if process.poll() is not None:
            raise RuntimeError('Gateway exited: '+(RESULT/'gateway.log').read_text())
        try:
            urllib.request.urlopen(gateway_url+'/ready', timeout=1).read()
            break
        except OSError:
            time.sleep(.25)
    else:
        raise RuntimeError('Gateway did not become ready')
    run([sys.executable, 'check_setup.py'], cwd=KIT, env=env)
    run([sys.executable, 'demo.py', 'state'], cwd=KIT, env=env)
    run([sys.executable, 'full_trace/record.py', '--phase', 'function', '--base-url', gateway_url+'/v1', '--model', 'workshop-test', '--corpus', 'corpus', '--capture', str(RESULT/'function')], cwd=KIT, env=env)
    assert any('function_call_output' in json.dumps(r.get('input', '')) and '0.6475' in json.dumps(r.get('input', '')) for r in seen)
    assert all('previous_response_id' not in r for r in seen)
    run([sys.executable, 'compact.py'], cwd=KIT, env=env)
    # Real native Codex is launched via the installed Agentic API provider configuration.
    run([agentic, 'harness', 'codex', '--gateway-url', gateway_url, '--model', 'workshop-test', '--', 'exec', '--skip-git-repo-check', 'Reply with exactly the word pong.'], cwd=KIT/'penalty/after', env=env)
    (RESULT/'upstream-fixture-requests.json').write_text(json.dumps(seen, indent=2)+'\n')
    (RESULT/'summary.json').write_text(json.dumps({'platform': sys.platform, 'machine': os.uname().machine, 'native_gateway': True, 'native_codex': True, 'sdk_function_round_trip': True, 'state_hydration': True, 'compaction': True, 'inference': 'deterministic local fixture; no live GPU model'}, indent=2)+'\n')
    print('PASS: native gateway, SDK function loop, hydration, compaction and native Codex transport against deterministic fixture')
finally:
    try:
        os.killpg(process.pid, signal.SIGTERM)
    except ProcessLookupError:
        pass
    process.wait(timeout=15)
    log.close()
    server.shutdown()
