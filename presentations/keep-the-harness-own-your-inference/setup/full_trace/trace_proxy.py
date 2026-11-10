#!/usr/bin/env python3
"""Local recording tap. Copies real HTTP bodies; never records request credentials."""
import argparse
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import http.client
import io
import json
from pathlib import Path
import threading
import time
import urllib.parse
import uuid

LOCK = threading.Lock()


def append(path, data):
    with LOCK:
        with path.open('a') as stream:
            stream.write(json.dumps(data, ensure_ascii=False) + '\n')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type=int, default=8011)
    parser.add_argument('--host', default='127.0.0.1')
    parser.add_argument('--upstream', default='http://127.0.0.1:8000')
    parser.add_argument('--capture', type=Path, required=True)
    parser.add_argument('--omit-tool-output-ids', action='store_true', help='Compatibility: preserve call_id, omit optional tool-output item IDs')
    parser.add_argument('--token-logprobs', action='store_true', help='Request actual vLLM token pieces for recording')
    args = parser.parse_args()
    args.capture.mkdir(parents=True, exist_ok=True)
    upstream = urllib.parse.urlsplit(args.upstream)
    if upstream.scheme != 'http' or not upstream.hostname or upstream.username or upstream.password:
        parser.error('--upstream must be an HTTP URL without embedded credentials; use an SSH tunnel for a remote server')

    class Handler(BaseHTTPRequestHandler):
        protocol_version = 'HTTP/1.1'

        def log_message(self, *_):
            pass

        def handle_request(self):
            trace_id = uuid.uuid4().hex[:12]
            body = self.rfile.read(int(self.headers.get('Content-Length', 0)))
            record = {'time': time.time(), 'id': trace_id, 'method': self.command, 'path': self.path}
            if body and args.token_logprobs and self.path.endswith('/responses'):
                payload = json.loads(body)
                payload['include'] = list(dict.fromkeys(payload.get('include', []) + ['message.output_text.logprobs']))
                payload['top_logprobs'] = 1
                payload['chat_template_kwargs'] = {'enable_thinking': False}
                body = json.dumps(payload).encode()
                record['recording_options'] = {'include': ['message.output_text.logprobs'], 'top_logprobs': 1, 'enable_thinking': False}
            if body:
                (args.capture / f'{trace_id}-request.json').write_bytes(body)
                record['request'] = json.loads(body)
            if body and args.omit_tool_output_ids and self.path.endswith('/responses'):
                payload = json.loads(body)
                omitted = []
                if isinstance(payload.get('input'), list):
                    for item in payload['input']:
                        if item.get('type') == 'function_call_output' and 'id' in item:
                            omitted.append(item.pop('id'))
                if omitted:
                    (args.capture / f'{trace_id}-original-request.json').write_bytes(body)
                    record['original_request'] = json.loads(body)
                    record['omitted_optional_output_ids'] = omitted
                    body = json.dumps(payload).encode()
                    record['request'] = payload
                    (args.capture / f'{trace_id}-request.json').write_bytes(body)
            capture_request = self.command == 'POST'
            if capture_request:
                append(args.capture / 'inference.jsonl', record)
            conn = http.client.HTTPConnection(upstream.hostname, upstream.port or 80, timeout=240)
            headers = {k: v for k, v in self.headers.items() if k.lower() not in ('host', 'connection', 'content-length')}
            conn.request(self.command, upstream.path.rstrip('/') + self.path, body=body or None, headers=headers)
            response = conn.getresponse()
            self.send_response(response.status)
            content_type = response.getheader('Content-Type', 'application/json')
            self.send_header('Content-Type', content_type)
            self.send_header('Connection', 'close')
            self.end_headers()
            streaming = 'text/event-stream' in content_type
            output = (args.capture / (f'{trace_id}-response.' + ('sse' if streaming else 'json'))).open('wb') if capture_request else io.BytesIO()
            with output as out:
                while True:
                    chunk = response.readline() if streaming else response.read(65536)
                    if not chunk:
                        break
                    out.write(chunk)
                    out.flush()
                    self.wfile.write(chunk)
                    self.wfile.flush()
                    if capture_request and streaming and chunk.startswith(b'data: ') and chunk.strip() != b'data: [DONE]':
                        try:
                            append(args.capture / 'inference.jsonl', {'time': time.time(), 'id': trace_id, 'event': json.loads(chunk[6:])})
                        except json.JSONDecodeError:
                            pass
            if capture_request:
                append(args.capture / 'inference.jsonl', {'time': time.time(), 'id': trace_id, 'status': response.status, 'complete': True})
            conn.close()
            self.close_connection = True

        do_GET = handle_request
        do_POST = handle_request

    print(f'Recording vLLM HTTP bodies at {args.host}:{args.port}', flush=True)
    ThreadingHTTPServer((args.host, args.port), Handler).serve_forever()


if __name__ == '__main__':
    main()
