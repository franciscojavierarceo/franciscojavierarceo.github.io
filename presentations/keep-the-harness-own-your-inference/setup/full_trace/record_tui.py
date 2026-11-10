#!/usr/bin/env python3
"""Capture the actual interactive Codex TUI as timed terminal bytes (asciicast v2)."""
import argparse
import codecs
import fcntl
import json
import os
from pathlib import Path
import pty
import select
import signal
import struct
import sys
import termios
import time
import tty


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--root', type=Path, required=True)
    p.add_argument('--cols', type=int, default=76)
    p.add_argument('--rows', type=int, default=36)
    p.add_argument('--codex', default='/usr/lib/chatgpt/resources/codex')
    a = p.parse_args()
    env = {k: v for k, v in os.environ.items() if not any(s in k.upper() for s in ('API_KEY', 'TOKEN', 'SECRET', 'PASSWORD'))}
    env.update(CODEX_HOME=str(a.root/'codex-home'), TERM='xterm-256color', COLORTERM='truecolor')
    start = time.time()
    pid, master = pty.fork()
    if pid == 0:
        os.chdir(a.root/'workspace')
        os.execve(a.codex, [a.codex, '--no-daemon', '--no-alt-screen'], env)
    fcntl.ioctl(master, termios.TIOCSWINSZ, struct.pack('HHHH', a.rows, a.cols, 0, 0))
    decoder = codecs.getincrementaldecoder('utf-8')('replace')
    previous = termios.tcgetattr(sys.stdin)
    tty.setraw(sys.stdin)
    try:
        with (a.root/'terminal.cast').open('w') as cast:
            cast.write(json.dumps({'version': 2, 'width': a.cols, 'height': a.rows, 'timestamp': start, 'title': 'Interactive Codex → Agentic API → vLLM', 'env': {'TERM': env['TERM']}})+'\n')
            cast.flush()
            while True:
                ready, _, _ = select.select([master, sys.stdin], [], [], 1)
                if master in ready:
                    try:
                        data = os.read(master, 65536)
                    except OSError:
                        break
                    if not data:
                        break
                    output = decoder.decode(data)
                    cast.write(json.dumps([round(time.time()-start, 6), 'o', output], ensure_ascii=False)+'\n')
                    cast.flush()
                    os.write(sys.stdout.fileno(), data)
                    # Respond to terminal capability queries, like a real terminal.
                    if b'\x1b[6n' in data:
                        os.write(master, b'\x1b[1;1R')
                    if b'\x1b]11;?' in data:
                        os.write(master, b'\x1b]11;rgb:0e0e/0f0f/1111\x1b\\')
                if sys.stdin in ready:
                    data = os.read(sys.stdin.fileno(), 4096)
                    if not data:
                        break
                    cast.write(json.dumps([round(time.time()-start, 6), 'i', data.decode('utf-8', errors='replace')], ensure_ascii=False)+'\n')
                    cast.flush()
                    os.write(master, data)
    finally:
        termios.tcsetattr(sys.stdin, termios.TCSADRAIN, previous)
        os.close(master)
        try:
            os.kill(pid, signal.SIGTERM)
        except ProcessLookupError:
            pass
        os.waitpid(pid, 0)


if __name__ == '__main__':
    main()
