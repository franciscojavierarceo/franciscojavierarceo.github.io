# Real Responses and llm-d recordings

Recorded November 8, 2026, with an existing local vLLM serving
`nvidia/Qwen3.8-Flash-Next-FP4-Local` on DGX Spark.

- `media/responses-function-trace.mp4`: 55 seconds. A real client-executed function call,
  computation of the elastic-net penalty (0.6475), and stored-ID continuation into the answer.
- `media/responses-file-search-trace.mp4`: 130 seconds. Upload three PDFs, create a vector store,
  attach/index the files, inspect retrieval, run native `file_search`, inspect passages sent back
  to vLLM, emit `file_citation` annotations, and retrieve the stored response.
- `media/llm-d-deployment-trace.mp4`: 81 seconds. Real kind deployment inspection and continuation
  from one gateway pod to a different pod, using PostgreSQL and the official llm-d standalone router.

Paths above are relative to the workshop root. Videos render actual SDK events and recorded HTTP bodies.
Timing is edited for readability; these are not desktop screen captures. The HTML deck embeds the first two
on slide 16 and the Kubernetes recording on slide 21. Slide 15 now includes the upload/index flow and real
output excerpts. `[` / `]` switch clips and `P` plays/pauses on slide 16; `D` toggles the recording on slide 21.

## Implementation and evidence

The recording uses development commit `45c729f` from `codex/file-search-responses-protocol`, built with
`file-search-pdf`, plus `captures/responses-full-trace/startup-file-search.patch`. The patch reuses
`with_file_search_service` at startup so the same service backs uploads and Responses tool execution.
The original development checkout and the main Rust working tree were left untouched.

The patch also adds a startup regression test. Seven tests in `file_search_tool_test` passed; logs are stored
alongside the captures. The real recording assertions check completion, function arguments/output, native
search calls with results, citation IDs against uploaded files, and stored-response retrieval.

This run uses **keyword retrieval**, without an embedding endpoint. Citations identify uploaded files and
text anchors; their existence is not a factual-support score. The corpus contains these publicly hosted papers:

- [Zou and Hastie: Regularization and Variable Selection via the Elastic Net](https://web.stanford.edu/~hastie/Papers/elasticnet.pdf)
- [Friedman, Hastie and Tibshirani: Regularization Paths for Generalized Linear Models via Coordinate Descent](https://hastie.su.domains/Papers/glmnet.pdf)
- [Tibshirani et al.: Strong Rules for Discarding Predictors in Lasso-type Problems](https://arxiv.org/abs/1011.2234)

PDF source URLs and download SHA-256 hashes are in each capture's `corpus-sources.json`.
Original PDFs are held in `/tmp/aie-full-trace/corpus`, not bundled into the presentation.

`captures/responses-full-trace/` contains client events, exact vLLM request JSON and response SSE bodies,
server logs, validation logs, source patch, and provenance. `captures/llm-d-full-trace/` also contains
real kubectl output, pod logs, and `deployment-proof.json`. Captures omit request headers and credentials.

## Rehearse or record again

The local demo server is at `http://127.0.0.1:9001/v1`. Its upstream recording tap is on port 8011.
The Kubernetes gateway Service is forwarded to `http://127.0.0.1:9021/v1`; the llm-d router is on 8021.
The isolated kubeconfig is `/tmp/aie-full-trace/kubeconfig`, context `kind-aie-trace`.

```bash
/tmp/aie-full-trace/venv/bin/python \
  workshop/aie-code-2026/demo/full_trace/record.py \
  --base-url http://127.0.0.1:9001/v1 \
  --model nvidia/Qwen3.8-Flash-Next-FP4-Local \
  --corpus /tmp/aie-full-trace/corpus \
  --capture /tmp/aie-full-trace/new-take
```

Use a fresh capture directory. `trace_proxy.py` records real upstream HTTP bodies; run it with a fresh
`--capture` directory too when producing a new video. Upload/indexing calls use the official OpenAI Python
SDK. The continuation explicitly supplies `tool_choice="none"` after forced function calling, because the
stored request's tool choice can otherwise be inherited.

`record_cluster.py` inspects the cluster, forwards to two distinct ready gateway pods, calls `record.py`
with different first/continuation endpoints, and removes its own pod port forwards afterward.

```bash
/tmp/aie-full-trace/venv/bin/python \
  workshop/aie-code-2026/demo/full_trace/record_cluster.py \
  --kubectl /tmp/aie-full-trace/bin/kubectl \
  --kubeconfig /tmp/aie-full-trace/kubeconfig \
  --model nvidia/Qwen3.8-Flash-Next-FP4-Local \
  --capture /tmp/aie-full-trace/new-cluster-take
```

`render.py` renders either phase from `client.jsonl` and the matching `inference.jsonl`.
Recording dependencies are pinned in `requirements.txt`.

## Local Kubernetes topology

Two CPU-only Agentic API replicas share PostgreSQL and file storage. The official standalone llm-d
router runs EPP and Envoy. A single connector pod forwards requests and metrics to the existing Spark
vLLM, through the private kind bridge. That connector is a network bridge, **not an additional GPU**.
This demonstrates the routing/state contract and cross-gateway continuation; it does not measure
multi-GPU placement, prefix-cache balancing, disaggregation, or automatic failover.

The chart was fetched as `ghcr.io/llm-d/charts/llm-d-router-standalone:v0`, digest
`sha256:b9abb14ca670dc22baa617fb1ee6faa02b442903547ba451538f96aef53842e9`.
Resolved running image digests are captured in deployment metadata. The gateway image is local-only,
`aie-agentic-trace:dev` (`sha256:bfdb1e10affa521a9b2495fe5dc669ac54615cbbb02a182af7aad4c34c9de237`).
The example manifests contain disposable local demo database credentials. Use the repository's regular
Kubernetes guide and managed secrets for an actual shared deployment.

The actual prepared chart, build source, binaries and kubeconfig are under `/tmp/aie-full-trace/`.
The source patch and portable manifest examples are saved with the presentation.
To remove only this isolated cluster after rehearsing:

```bash
DOCKER_HOST=unix:///var/run/docker.sock \
  /tmp/aie-full-trace/bin/kind delete cluster --name aie-trace
```


## Codex → Agentic API → vLLM token recording (November 8)

Slide 16 now opens the real Codex 0.160.0 terminal-tool loop: inspect `penalty.py`, run it, and
incorporate the observed `0.6475` into the answer. This is three inference rounds with two successful
client command executions. The other tab retains the SDK-based PDF upload and native file-search demo.

`prepare_codex.py --root /tmp/new-codex-take --base-url http://127.0.0.1:9004/v1` creates a disposable
workspace, config and model catalog. Use the pinned local model and development gateway described in
the capture provenance. Start two taps before `record_codex.py --root /tmp/new-codex-take`:

- Inference: `trace_proxy.py --port 8013 --upstream http://127.0.0.1:8000 --capture /tmp/new-codex-take/inference --token-logprobs`.
- Gateway: point its upstream at port 8013, expose it on port 9003.
- Client: `trace_proxy.py --port 9004 --upstream http://127.0.0.1:9003 --capture /tmp/new-codex-take/client-wire --omit-tool-output-ids`.

The client tap removes only optional `function_call_output.id` fields (new Codex uses `fco_`, which the
recorded development gateway rejects). It preserves `call_id` and saves original and adjusted requests.
The inference tap adds token-logprob collection and disables thinking. These are recording-specific
compatibility/instrumentation settings, not a claim of unmodified compatibility across versions.

Export and check with `export_codex.py --root /tmp/new-codex-take --output /tmp/public-codex-capture`.
The exporter checks three successful inference requests, two successful commands, tool-output replay,
and the observed result. It explicitly omits base instructions, the installed skill catalog, environment
context and client metadata from public request captures. Raw private tap files remain in the take directory.
Render with `render_codex.py --capture /tmp/public-codex-capture --output /tmp/codex-agent-loop-trace.mp4`.
All commands use the Python environment described above; `record_codex.py --codex` selects another CLI path.

The video shows actual decoded sampled pieces returned in vLLM logprobs, not token IDs or guessed
SSE-delta boundaries. vLLM may include serialized tool-control markers there even when its text parser
removes them from the text delta. Function-call argument deltas are shown as streamed fragments, without
claiming per-token boundaries. Spaces are rendered as `·` and newlines as `\n` in token chips. Playback is
slowed and edited, not a latency benchmark. Codex uses `store:false` with full-history replay in this clip;
the separate SDK demos demonstrate saved-ID continuation and gateway-executed file search.

Slide 22 adds a manually started, illustrative llm-d/vLLM disaggregation walkthrough. It does not imply
that the local one-GPU recording ran across separate prefill and decode GPUs. Its sources are linked
on the slide and in its speaker notes.


## Native interactive Codex terminal replay

The current slide 16 uses `media/codex-terminal/`, not the older hand-composed MP4. Its client pane is
exact native Codex interactive TUI output captured from a real 76×36 PTY with `record_tui.py`.
No `codex exec --json` is used for this take. xterm.js 6.0.0 (vendored with its MIT license) interprets
the original terminal escape sequences, including native tool progress and answer formatting.

The run asks Codex to reproduce three failing elastic-net tests, repair the implementation, rerun
tests, and execute the script. The fixture deliberately swaps alpha's weights. All three tests pass
afterward, the test file hash is unchanged, and independent execution confirms the observed 0.6475.
The original take is `/tmp/aie-codex-tui/take1`; public evidence is under `captures/codex-tui/`.

To reproduce, prepare a fresh workspace/config, set `sandbox_mode="workspace-write"` for the disposable
fixture, and run `record_tui.py --root /tmp/new-tui-take` in a terminal. Use the same two recording taps
as above, with fresh capture directories named `server` and `inference`. Type the task in the actual
Codex composer. The recorder logs native output bytes, input and timestamps in asciicast v2 format;
it responds to terminal cursor/background queries. It does not draw a simulated Codex UI.

`export_tui.py --root /tmp/aie-codex-tui/take1 --deck workshop/aie-code-2026` checks captured failures,
passing tests, output, and the independent validation record, exports explicitly redacted HTTP captures,
and builds the synchronized playback data. The opening idle is shortened to three seconds; the rest
retains the original event timing. Playback defaults to 0.75× and starts paused. P toggles playback,
V expands, and the timeline supports seeking. The public capture retains seven main agent-loop requests
and the separate background title-generation request; the latter is excluded from the main panes.
The previous optional-ID compatibility shim and vLLM logprob instrumentation are unchanged and documented
in provenance. Opening the static player does not connect a viewer to a shell or model endpoint.
