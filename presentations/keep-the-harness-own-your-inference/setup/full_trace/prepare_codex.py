#!/usr/bin/env python3
"""Prepare a disposable read-only Codex workspace and local model catalog."""
from pathlib import Path
import json
import argparse
p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);p.add_argument('--base-url',default='http://127.0.0.1:9004/v1');a=p.parse_args()
r=a.root;r.mkdir(parents=True,exist_ok=True);home=r/'codex-home';home.mkdir(exist_ok=True);ws=r/'workspace';ws.mkdir(exist_ok=True)
model='nvidia/Qwen3.8-Flash-Next-FP4-Local'
base=json.loads((Path(__file__).parent/'codex-model.json').read_text())
m=base['models'][0];m.update(slug=model,display_name=model,context_window=32768,max_context_window=32768,base_instructions='You are a concise coding assistant. Use the terminal tools to inspect and run the requested local Python script. Report only results you observed. Do not use the network.');m['truncation_policy']={'limit':24000,'mode':'tokens'}
(home/'models.json').write_text(json.dumps(base))
(home/'config.toml').write_text(f'''model = "{model}"
model_provider = "agentic-api"
model_catalog_json = "{home/'models.json'}"
model_reasoning_effort = "low"
web_search = "disabled"
sandbox_mode = "read-only"
[model_providers.agentic-api]
name = "Agentic API"
base_url = "{a.base_url}"
wire_api = "responses"
requires_openai_auth = false
supports_websockets = false
''')
(ws/'penalty.py').write_text('''"""Workshop elastic-net penalty; no network or external packages."""
import json

def elastic_net_penalty(coefficients, alpha, lambda_value):
    l1 = sum(abs(value) for value in coefficients)
    l2 = sum(value * value for value in coefficients) / 2
    return lambda_value * (alpha * l1 + (1 - alpha) * l2)

if __name__ == "__main__":
    print(json.dumps({"coefficients": [1, -2, 0.5], "alpha": 0.7,
                      "lambda_value": 0.2,
                      "penalty": elastic_net_penalty([1, -2, 0.5], 0.7, 0.2)}))
''')
(r/'gateway').mkdir(exist_ok=True)
