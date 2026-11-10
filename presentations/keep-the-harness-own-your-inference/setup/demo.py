#!/usr/bin/env python3
"""Presenter API demos. Uses only stdlib; no API requests occur without an explicit subcommand.

These are teaching scripts, not captured replay cassettes or production gateway code.
Captures are genuine requests/responses from the endpoint selected by the presenter.
"""

import argparse
import json
import os
from pathlib import Path
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

ROOT = Path(__file__).resolve().parent
POLICY = (ROOT / "policy.txt").read_text()
CONSTRAINTS = (
    "Fictional Jira ticket DEMO-742: repair retry_delay. Preserve the public function signature; "
    "use only the standard library; do not edit tests; tests must not sleep or use the network. "
    "Acknowledge these constraints in one sentence."
)


def request(path, payload=None):
    base = os.environ.get("AIE_GATEWAY_URL", "").rstrip("/")
    if not base:
        raise ValueError("Set AIE_GATEWAY_URL to the prepared gateway root, without /v1.")
    parsed = urllib.parse.urlparse(base)
    if parsed.scheme not in ("http", "https") or not parsed.hostname or parsed.path not in ("", "/"):
        raise ValueError("AIE_GATEWAY_URL must be an http(s) origin without a path.")
    headers = {"Content-Type": "application/json"}
    if key := os.environ.get("AGENTIC_GATEWAY_API_KEY"):
        headers["Authorization"] = "Bearer " + key
    body = None if payload is None else json.dumps(payload).encode()
    req = urllib.request.Request(base + path, data=body, headers=headers)
    with urllib.request.urlopen(req, timeout=60) as response:
        return json.load(response)


def model():
    value = os.environ.get("AIE_MODEL")
    if not value:
        raise ValueError("Set AIE_MODEL to an exact ID returned by /v1/models.")
    return value


def capture(name, payload, response):
    root = Path(os.environ.get("AIE_CAPTURE_DIR", str(ROOT.parent / "captures")))
    root.mkdir(parents=True, exist_ok=True)
    path = root / (str(time.time_ns()) + "-" + name + ".json")
    path.write_text(json.dumps({"request": payload, "response": response}, indent=2) + "\n")
    print("capture:", path)


def show(response):
    print("id:", response.get("id"), "status:", response.get("status"))
    print("output item types:", [item.get("type") for item in response.get("output", [])])
    for item in response.get("output", []):
        if item.get("type") == "message":
            for part in item.get("content", []):
                if part.get("text"):
                    print(part["text"])
        elif item.get("type") in ("function_call", "mcp_call"):
            print(json.dumps(item, indent=2))


def respond(name, **fields):
    payload = {"model": model(), "max_output_tokens": 1200, **fields}
    response = request("/v1/responses", payload)
    capture(name, payload, response)
    show(response)
    if response.get("status") != "completed":
        raise RuntimeError("Response did not complete; inspect capture before continuing.")
    return response


def state():
    first = respond("state-initial", input=CONSTRAINTS, store=True)
    print("\nNEW REQUEST: only a response ID and a question\n")
    respond("state-continued", input="Give the work item ID and all constraints I asked you to preserve.",
            previous_response_id=first["id"], store=True)
    print("\nCONTROL: a fresh request without the earlier state\n")
    respond("state-control", input="What work item ID did I give you? If absent, say you do not know.", store=False)
    print("Check the actual answer; a stored ID alone does not prove successful recall.")


def retrieve():
    tool = {"type": "function", "name": "search_policy",
            "description": "Retrieve the authoritative workshop retry policy before answering policy questions.",
            "parameters": {"type": "object", "properties": {"query": {"type": "string"}},
                           "required": ["query"], "additionalProperties": False}}
    first = respond("retrieval-call", store=True,
                    input="Use search_policy to find the retry cap and rules for zero and invalid Retry-After values. Cite the document ID.",
                    tools=[tool], tool_choice={"type": "function", "name": "search_policy"})
    calls = [x for x in first.get("output", []) if x.get("type") == "function_call"]
    if not calls:
        raise RuntimeError("No function call was returned; this is not a successful retrieval demo.")
    outputs = []
    for call in calls:
        if call.get("name") != "search_policy":
            raise RuntimeError("Unexpected tool; refusing to execute it.")
        args = json.loads(call["arguments"])
        if not isinstance(args.get("query"), str):
            raise RuntimeError("search_policy requires a string query.")
        print("CLIENT executes read-only search_policy:", args["query"])
        outputs.append({"type": "function_call_output", "call_id": call["call_id"],
                        "output": json.dumps({"document_id": "retry-policy-v3", "text": POLICY})})
    respond("retrieval-answer", previous_response_id=first["id"], input=outputs, store=True)
    print("This is a client-executed function tool over a fixed teaching corpus, not built-in file_search.")


def mcp():
    url = os.environ.get("AIE_MCP_URL", "http://127.0.0.1:8766/mcp")
    respond("retrieval-mcp", store=True,
            input="Use the search_policy tool to find the retry cap and rules for zero and invalid Retry-After values. Cite the document ID.",
            tools=[{"type": "mcp", "server_label": "workshop_policy", "server_url": url,
                    "allowed_tools": ["search_policy"], "require_approval": "never"}])
    print("Inspect mcp_call output and the MCP server log to verify execution, not only the final prose.")


def compaction_input():
    noise = "\n".join(f"diagnostic {i}: fixture module loaded; repeated test listing; no policy change" for i in range(65))
    return [
        {"role": "user", "content": CONSTRAINTS},
        {"role": "assistant", "content": "I will keep the signature, dependencies and tests unchanged."},
        {"role": "user", "content": "Here is the retrieved workshop policy:\n" + POLICY},
        {"role": "assistant", "content": "Findings: the header is currently ignored. Preserve zero; cap at 12 seconds.\n" + noise},
        {"role": "user", "content": "Save the task state. We have not changed code yet."},
    ]


def compact():
    history = compaction_input()
    print("Using an explicitly seeded teaching transcript, not a claimed harness capture.")
    payload = {"model": model(), "input": history}
    result = request("/v1/responses/compact", payload)
    capture("compaction", payload, result)
    window = result.get("output", [])
    if result.get("object") != "response.compaction" or not any(x.get("type") == "compaction" for x in window):
        raise RuntimeError("Expected a canonical response.compaction window.")
    print("JSON bytes before/after (not token counts):", len(json.dumps(history).encode()), len(json.dumps(window).encode()))
    print("window item types:", [x.get("type") for x in window])
    print("compaction inference usage:", result.get("usage"))
    respond("compaction-continued", store=False,
            input=window + [{"role": "user", "content": "What is the work item ID, retry cap, zero rule, dependency restriction and next action?"}])
    print("Grade the answer: DEMO-742, 12 seconds, zero is valid, standard library only, fix code then run tests.")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("demo", choices=["health", "state", "retrieve", "mcp", "compact", "seed"])
    args = parser.parse_args()
    if args.demo == "health":
        print(json.dumps(request("/v1/models"), indent=2))
    elif args.demo == "seed":
        print(json.dumps(compaction_input(), indent=2))
    else:
        {"state": state, "retrieve": retrieve, "mcp": mcp, "compact": compact}[args.demo]()


if __name__ == "__main__":
    try:
        main()
    except (ValueError, RuntimeError, OSError, urllib.error.URLError) as error:
        print("Demo stopped:", error, file=sys.stderr)
        sys.exit(1)
