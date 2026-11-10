# Keep the Harness, Own Your Inference

## Workshop setup & reproduction guide

Francisco Javier Arceo · AI Engineer Code Summit 2026 · November 10, 2026

Keep Codex or Claude Code. Run the gateway on your laptop. Connect it to an open model, then inspect the work between the harness and inference.

[Slides](../#1) · [Download this README](README.md) · [Download all demo sources](workshop-kit.zip) · [Python source viewer](../penalty-demo/) · [Agentic API repository](https://github.com/vllm-project/agentic-api)

**Start here:** run the Python fixture without a GPU, then connect a model endpoint. The workshop is presenter-led; you do not need to provision infrastructure to follow along. Each section below says what a successful result looks like.

[Laptop setup](#1-download-the-workshop-kit) · [Codex demo](#4-let-native-codex-fix-the-bug) · [PDF search](#6-tool-calls-hydration-pdf-upload-file-search-citations) · [Inference wire](#7-inspect-the-actual-inference-wire) · [Compaction](#8-compaction-save-a-checkpoint-then-continue) · [Web search](#9-server-side-web-search-codex-and-claude-code) · [Kubernetes](#10-kubernetes-llm-d-same-api-different-workers)

## What runs where?

| On your laptop | On a GPU host, DGX Spark, or cluster |
| --- | --- |
| Python 3.10+, Git, curl; Node/npm for Codex | An OpenAI-compatible inference server, with a tool-capable model and its required parser/template settings |
| Agentic API gateway and SQLite; no GPU dependency in the base install | Model weights and the GPU memory needed to serve them |
| Codex/Claude Code, fixture tests, SDK clients, optional recording taps | Optional llm-d routing and distributed GPU workers |

Mac/Linux instructions below use a POSIX shell. Windows users can use WSL2. A laptop can run the gateway against a remote inference endpoint; installing Agentic API does not make a large model fit into laptop memory. No OpenAI account credential is needed for the unauthenticated local gateway examples. A protected gateway or upstream needs its own credentials; web search also needs a search-provider key.

## 1. Download the workshop kit

```bash
mkdir agentic-workshop
cd agentic-workshop
curl -fL https://franciscojavierarceo.dev/presentations/keep-the-harness-own-your-inference/setup/workshop-kit.zip -o workshop-kit.zip
unzip workshop-kit.zip
cd workshop-kit
python3 -m venv .venv
. .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install agentic-api openai
agentic-api doctor --mode remote
agentic --version
```

The base Python package bundles the Rust gateway and CLI; it does not install vLLM. This installs the available package release. For the exact development build behind the PDF recording, use section 5 instead. Record your installed versions with `python -m pip freeze` and `agentic --version` when comparing results.

[Python installation guide](https://github.com/vllm-project/agentic-api/blob/main/docs/guides/python-installation.md) · [Package on PyPI](https://pypi.org/project/agentic-api/)

## 2. Run the exact coding fixture — no model needed

```bash
cd penalty/before
python3 -m unittest -v
# Expected: 3 failures. This is the bug Codex fixes.
cd ../after
python3 -m unittest -v
python3 penalty.py
# Expected: 3 tests pass; penalty = 0.6475.
cd ../..
```

The implementation swaps the L1/L2 mixing weights. `before` and `after` contain the exact captured Python files, and their tests are identical. The baseline deliberately exits with a failing test status. [Read the files side by side](../penalty-demo/).

## 3. Connect inference and test the gateway

Use an existing tool-capable vLLM endpoint, or tunnel to a GPU host you control:

```bash
# Separate terminal; leave this running if using a remote GPU host.
ssh -N -L 8000:127.0.0.1:8000 YOUR_GPU_HOST
```

If starting vLLM yourself, use the model's documented tool/reasoning parser and chat template. There is no universal parser flag for all models. The recording used `nvidia/Qwen3.8-Flash-Next-FP4-Local` on a DGX Spark; that is a served model ID from the presenter's deployment, not a promise that every installation can download or serve that alias. Pick a model supported by your hardware and confirm its exact served name:

```bash
export UPSTREAM_URL=http://127.0.0.1:8000
curl --fail "$UPSTREAM_URL/v1/models" | python -m json.tool
export AIE_MODEL='REPLACE_WITH_AN_ID_FROM_THE_MODELS_RESPONSE'
export AIE_GATEWAY_URL=http://127.0.0.1:9000
# Terminal A: explicit port avoids differences between launcher defaults.
agentic serve --upstream "$UPSTREAM_URL" --gateway-port 9000
```

In terminal B, activate the same virtual environment and export the same `AIE_MODEL` and `AIE_GATEWAY_URL`. These two variables are workshop-client settings. The gateway origin has **no `/v1` suffix**; the SDK script adds it.

```bash
curl --fail "$AIE_GATEWAY_URL/ready"
python check_setup.py
python demo.py state
```

Success: `/ready` returns HTTP 200, `check_setup.py` reports a completed response, and the state demo recalls **DEMO-742** and its constraints through `previous_response_id`. The fresh control request has not received those facts. Judge the returned answer, not just the presence of a response ID. The gateway's SQLite database must remain in place between requests.

For an authenticated gateway, set `AGENTIC_GATEWAY_API_KEY` privately. `check_setup.py`, `demo.py`, `compact.py`, and `web_search.py` read it. The original `full_trace/record.py` uses the fixture key `local-demo` and targets an unauthenticated local gateway; adapt its two `OpenAI` constructors before using a protected endpoint.

## 4. Let native Codex fix the bug

Install the official CLI separately ([Codex CLI installation](https://developers.openai.com/codex/cli)). The captured terminal used Codex **0.160.0**; pin that version when comparing the recording, or use a current CLI with a compatible current gateway.

```bash
npm install -g @openai/codex@0.160.0
codex --version
cp -R penalty/before my-codex-task
cd my-codex-task
git init
agentic harness codex --gateway-url "$AIE_GATEWAY_URL" --model "$AIE_MODEL"
```

Enter this prompt in the **actual Codex terminal**:

> Run python3 -m unittest -v to reproduce the bug. Read penalty.py and test_penalty.py. Fix elastic_net_penalty without changing the tests or its signature. Use only the Python standard library. Run the tests again, run python3 penalty.py, and show the diff. Report only results you observed.

Approve the requested local file/command actions. Afterwards, independently run:

```bash
python3 -m unittest -v
python3 penalty.py
cmp test_penalty.py ../penalty/before/test_penalty.py
cd ..
```

Success: all 3 tests pass; the script prints **0.6475**; `cmp` exits 0. Model output can differ from the recording and still be correct. For Claude Code, install its CLI from [Anthropic's setup instructions](https://code.claude.com/docs/en/setup), make a separate clean copy of `penalty/before`, and use `agentic harness claude --gateway-url "$AIE_GATEWAY_URL" --model "$AIE_MODEL"`. The launcher handles model overrides and isolates harness settings. [Harness troubleshooting](https://github.com/vllm-project/agentic-api/blob/main/docs/guides/harness-cli-testing.md).

## 5. Build the exact PDF-demo gateway

The November 8 PDF recording used development commit **45c729f5fe351c55edbb686a750bde1fe3eacf5e**, a startup-registration patch, and the **file-search-pdf** feature. Do not assume the PyPI wheel contains that exact implementation. This path requires Rust and the repository's native build prerequisites. Build in a separate checkout:

```bash
# From workshop-kit, save its absolute location before entering the checkout.
export KIT_DIR="$PWD"
git clone https://github.com/vllm-project/agentic-api.git recorded-gateway
cd recorded-gateway
git checkout 45c729f5fe351c55edbb686a750bde1fe3eacf5e
git apply --check "$KIT_DIR/full_trace/startup-file-search.patch"
git apply "$KIT_DIR/full_trace/startup-file-search.patch"
cargo build -p agentic-server --bins --features file-search-pdf
cargo test -p agentic-server-core --features file-search-pdf --test file_search_tool_test
export RECORDED_GATEWAY_DIR="$PWD"
cd "$KIT_DIR"
```

Stop the gateway from section 3 before binding port 9000 again. Use an isolated home and explicit file storage; these paths hold the uploaded documents and state:

```bash
export AGENTIC_API_HOME="$PWD/runtime"
mkdir -p "$AGENTIC_API_HOME/files"
python - <<'PY'
import json, os
from pathlib import Path
root = Path(os.environ['AGENTIC_API_HOME'])
(root / 'config.toml').write_text('[files]\nstorage_dir = ' + json.dumps(str(root / 'files')) + '\n')
PY
LLM_API_BASE="$UPSTREAM_URL" \
  "$RECORDED_GATEWAY_DIR/target/debug/agentic-server" \
  --gateway-host 127.0.0.1 --gateway-port 9000
```

This pinned build is the reproducibility path for the recording; it does not include later fixes. A newer checkout may not need the patch. Do not apply the patch blindly to another commit.

## 6. Tool calls, hydration, PDF upload, file search, citations

In a second terminal, activate the kit environment, set the gateway/model variables, and install the SDK version used in the recording:

```bash
python -m pip install openai==3.46.0
python fetch_corpus.py
python full_trace/record.py \
  --base-url "$AIE_GATEWAY_URL/v1" --model "$AIE_MODEL" \
  --corpus corpus --capture runs/first-take
```

Use a fresh capture directory for each run. To run only one section, add `--phase function` or `--phase files`.

The corpus downloader fetches the authors' PDFs, checks the PDF header, and verifies the SHA-256 values from the recording. Papers are not redistributed in the kit. If a publisher changes the bytes, the downloader stops rather than silently changing the corpus; review the new source before updating the manifest.

| Step | What to inspect / expected result |
| --- | --- |
| Client-executed function tool | `function-call.json`: a `function_call` with JSON arguments and a `call_id` |
| Function execution | Client computes the elastic-net penalty, **0.6475** |
| State hydration | `function-answer.json`: request carries `previous_response_id` and matching `function_call_output`; final answer includes 0.6475 |
| Upload | 3 PDFs uploaded through `client.files.create(..., purpose="assistants")` |
| Index | Vector store created; each `files.create_and_poll` reaches `completed` |
| Retrieval | `vector_stores.search` returns actual passages |
| Server-executed search | `file-search.json` includes completed **file_search_call** items and results, using `tools=[{"type":"file_search", ...}]` |
| Citations | Nonempty **file_citation** annotations reference uploaded file IDs; check the passages support the claims |
| Persistence | `responses.retrieve` returns the stored response |

This recording uses keyword retrieval. It does not run an embedding service, and an upload is not itself proof of successful retrieval. The script asserts tool execution and citation IDs; it does not prove every generated statement is supported.

Sources: [Zou & Hastie: elastic net](https://web.stanford.edu/~hastie/Papers/elasticnet.pdf), [Friedman, Hastie & Tibshirani: glmnet](https://hastie.su.domains/Papers/glmnet.pdf), [Tibshirani et al.: strong rules](https://arxiv.org/abs/1011.2234). Source URLs and hashes are in `full_trace/corpus-sources.json`.

## 7. Inspect the actual inference wire

Put a local recording tap between Agentic API and vLLM. The tap below supports a local **HTTP** upstream; tunnel remote inference to localhost first. It captures request/response bodies, not request credential headers.

```bash
# Terminal A: leave the tap running.
python full_trace/trace_proxy.py --port 8011 \
  --upstream "$UPSTREAM_URL" --capture runs/wire
```

Restart the gateway from section 5 with `LLM_API_BASE=http://127.0.0.1:8011`, then repeat section 6 into a fresh capture directory. Inspect `runs/wire/inference.jsonl` and the `*-request.json` / `*-response.sse` files.

Look for the hydrated `input` history upstream: `previous_response_id` is resolved at the gateway rather than sent unchanged to the inference engine. For file search, the next inference request includes the retrieved passages. For the client function, it includes the matching `function_call_output`.

To inspect sampled token pieces with a compatible vLLM Responses implementation, start another tap with `--token-logprobs`. It requests `message.output_text.logprobs`, `top_logprobs=1`, and disables thinking for this recording profile. A streamed text delta is not necessarily one token. Logprob token pieces are decoded pieces, not token IDs; tool-argument deltas are still fragments.

For the exact historical Codex recording, the client-side tap also used `--omit-tool-output-ids` to remove optional `function_call_output.id` values while preserving `call_id`. Both original and adjusted requests were saved. This compatibility modification is not required for the SDK demo. Native terminal capture tools (`record_tui.py`, `prepare_codex.py`) are included under `full_trace/`; their historical defaults are documented in `full_trace/README.md`. In particular, `prepare_codex.py` creates a read-only, already-correct fixture; replace it with the section 4 buggy fixture and use `sandbox_mode="workspace-write"` to recreate the editing demo. Pass `--codex "$(command -v codex)"` to `record_tui.py` rather than its presenter-specific default.

Only record fixture data. Request bodies and tool output can contain local files/context; inspect and redact them before publishing your own traces. [Public recording provenance](../captures/codex-tui/provenance.json) and [PDF-demo provenance](../captures/responses-full-trace/provenance.json) distinguish captures from edited playback.

## 8. Compaction: save a checkpoint, then continue

```bash
python compact.py
```

The script creates a **fresh stored response**, compacts that response ID, writes `runs/compact.json`, and sends the **entire returned output array** plus the follow-up message into the next request. No response IDs from the slides are reused.

Success: `object` is `response.compaction`, an output item has `type="compaction"`, and the continuation preserves **DEMO-742**, no new dependencies, and no test edits. Inspect `runs/compact-continued.json`; the script checks the response shape, and you check the retained constraints. Compaction does not execute the code fix. This gateway's checkpoint representation is not a claim of OpenAI-hosted encrypted-checkpoint interoperability.

For the longer explicitly seeded teaching transcript, run `python demo.py compact`. It should also retain the 12-second retry cap, zero rule, standard-library restriction, and next action. [Compaction implementation guide](https://github.com/vllm-project/agentic-api/blob/main/docs/guides/responses-compaction.md).

## 9. Server-side web search, Codex and Claude Code

Set **YOU_API_KEY** in the gateway process environment using your own You.com account; the workshop does not supply a shared key. Restart the gateway after changing its configuration. Never put the key in a slide, URL, or committed config file.

```bash
python web_search.py
```

Success: a completed `web_search_call` appears in the output, followed by an answer based on search results. The script saves `runs/web-search.json` and rejects an answer with no executed search. Search results and model wording change over time.

For Claude Code's `WebSearch` client function to execute at the gateway, set `MESSAGES_GATEWAY_TOOL_ALIASES=WebSearch=web_search` **on the gateway**, then restart it. Attach Claude as in section 4 and ask it to search the web for current Agentic API documentation. For Codex, enable web search in its isolated configuration/session (`-c 'web_search="live"'` as a Codex argument after the launcher's `--`) and ask the same question. Confirm execution in gateway logs; the model saying it searched is insufficient. [Gateway-owned web-search configuration](https://github.com/vllm-project/agentic-api/blob/main/docs/guides/harness-cli-testing.md).

## 10. Kubernetes + llm-d: same API, different workers

The recording used two CPU gateway pods sharing PostgreSQL and file storage, the official llm-d standalone Router, and **one** existing Spark GPU behind a connector. It demonstrated continuation across two gateway pods. It did not demonstrate multiple GPU workers, autoscaling, failover, or prefill/decode disaggregation.

Prerequisites: a disposable `kind` cluster, Docker, kubectl, Helm, and a reachable tool-capable inference endpoint. Use the [Agentic API Kubernetes guide](https://github.com/vllm-project/agentic-api/blob/main/docs/deploying/kubernetes.md) and [llm-d quickstart](https://github.com/llm-d/llm-d/blob/main/docs/getting-started/quickstart.md) for cluster prerequisites, including the InferencePool CRD. The kit contains the exact recording manifests under `full_trace/kubernetes/`; these use disposable database credentials and a local image.

To reproduce the recorded topology on a Linux Docker host:

1. Build the section 5 gateway **for the Linux architecture of your kind node**. Copy its binary beside `full_trace/kubernetes/Dockerfile`; run `docker build -t aie-agentic-trace:dev full_trace/kubernetes`, then `kind load docker-image aie-agentic-trace:dev --name YOUR_CLUSTER`.
2. Create namespace `llm-d-demo`. In `spark-connector.yaml`, replace the presenter's `http://172.18.0.1:18001` with an inference URL reachable **from inside the cluster**. Apply that manifest. A laptop's `127.0.0.1` is not a pod's localhost. Keep the connector's `/health` endpoint working.
3. Install the Router with the captured values:

```bash
kubectl create namespace llm-d-demo
helm upgrade --install aie-router \
  oci://ghcr.io/llm-d/charts/llm-d-router-standalone \
  --version v0 --namespace llm-d-demo \
  -f full_trace/kubernetes/router-values.yaml
# Recording chart digest:
# sha256:b9abb14ca670dc22baa617fb1ee6faa02b442903547ba451538f96aef53842e9
kubectl apply -f full_trace/kubernetes/agentic-api.yaml
kubectl -n agentic-demo rollout status deployment/postgres
kubectl -n agentic-demo rollout status deployment/agentic-api
kubectl -n agentic-demo scale deployment/agentic-api --replicas=2
kubectl -n agentic-demo rollout status deployment/agentic-api
kubectl -n agentic-demo get pods,svc
```

The recording's shared ReadWriteOnce volume works on its single-node kind cluster. Multi-node/shared deployments need suitable shared storage or another storage backend; PostgreSQL alone does not share PDF blobs. Use an immutable image and proper secret management outside this disposable setup. Check the chart digest from Helm against the recorded one when matching the historical deployment.

4. From the kit, record and verify cross-pod continuation:

```bash
python full_trace/record_cluster.py \
  --kubectl "$(command -v kubectl)" --kubeconfig "$KUBECONFIG" \
  --model "$AIE_MODEL" --capture runs/cluster-take
```

Set `KUBECONFIG` to your kind kubeconfig first. The recorder requires exactly two ready gateway pods, forwards them separately on 9031 and 9032, sends the first request to one pod, and continues through the other. Success: `deployment-proof.json` names **different** gateway pods and the final answer includes **0.6475**. The recorder closes its own port-forwards. Router/gateway logs and deployment inspection are saved alongside the API results.

For a real multi-GPU llm-d deployment, replace the connector with actual model-server pods and size them independently from the CPU gateways. Prefix-cache affinity is an inference-router concern; conversation state lives at the gateway/storage layer. Neither proves the other is being reused.

## 11. What you can reproduce, and what is a research direction

| In this workshop | Status |
| --- | --- |
| Codex edits Python, calls local tools, runs unchanged tests | Captured native CLI session; runnable fixture included |
| Responses function loop, stored-ID hydration, PDF upload/search/citations | Real captured API traffic; pinned gateway build and scripts included |
| Compaction + continuation; server-side web search | Real local API validation; scripts and expected checks included |
| Two CPU gateway pods, shared state, llm-d Router, one GPU | Recorded deployment and cross-pod continuation |
| Separate prefill/decode GPUs | Illustrated architecture; follow the [llm-d disaggregated-serving guide](https://github.com/llm-d/llm-d/tree/main/guides/pd-disaggregation) to deploy it on suitable hardware |
| Skills/containers provisioning a fleet; retained-context swarm branches | Proposed design, not a released end-to-end swarm implementation |
| Shared prefixes, coordination, speculative decoding make exploration cheaper | Hypotheses/mechanisms to measure; no cost reduction benchmark in this workshop |

## Troubleshooting and cleanup

- **Connection refused:** start/tunnel inference first, then gateway; check `/v1/models` and `/ready` separately. Verify ports and served model IDs.
- **A model replies but never calls tools:** verify model capability and its engine's parser/template. Test section 6's forced function call before trying a full coding task.
- **Missing file-search handler / PDF support:** use section 5's pinned source and feature; a declared tool is not proof that a release implements it.
- **Lost response IDs:** preserve the same database, or share PostgreSQL between pods. IDs in published captures belong to the presenter's database and cannot be reused on yours.
- **SDK mismatch:** use the captured SDK pin for section 6 and retain raw JSON. The exact recording package set is in `full_trace/requirements.txt`; video-only dependencies are unnecessary for API requests.
- **Slow/surprising output:** compare model, parser, context window, reasoning mode and hardware. Recordings are edited for clarity; their playback duration is not a latency benchmark.
- Stop local gateways/taps/SSH forwards with Ctrl-C. Remove only the kit's `runtime/`, `runs/`, and `corpus/` directories when you no longer need their data. For a disposable cluster, `kind delete cluster --name YOUR_CLUSTER` removes that cluster and its local data.

[Contribute to Agentic API](https://github.com/vllm-project/agentic-api) · [Project docs](https://vllm-project.github.io/agentic-api/) · [Francisco on X](https://x.com/franciscojarceo)

This is a **README** because it is for workshop attendees. `AGENTS.md` is conventionally used for instructions to coding agents working in a repository.
