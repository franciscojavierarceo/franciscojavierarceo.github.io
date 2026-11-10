#!/usr/bin/env python3
"""Record real cluster inspection and continuation between distinct gateway pods."""
import argparse
import json
from pathlib import Path
import subprocess
import sys
import time
import urllib.request


def main():
    p=argparse.ArgumentParser();p.add_argument('--kubectl',required=True);p.add_argument('--kubeconfig',required=True);p.add_argument('--capture',type=Path,required=True);p.add_argument('--model',required=True);a=p.parse_args()
    a.capture.mkdir(parents=True,exist_ok=True)
    base=[a.kubectl,'--kubeconfig',a.kubeconfig]
    def command(*args):
        cmd=base+list(args);out=subprocess.check_output(cmd,text=True)
        with (a.capture/'deployment.jsonl').open('a') as f:f.write(json.dumps({'time':time.time(),'command':cmd,'output':out})+'\n')
        return out
    command('get','nodes','-o','wide')
    command('-n','llm-d-demo','get','pods,svc,inferencepool','-o','wide')
    command('-n','agentic-demo','get','pods,svc','-o','wide')
    command('-n','agentic-demo','get','deployment','agentic-api','-o','json')
    pods=json.loads(command('-n','agentic-demo','get','pods','-l','app=agentic-api','-o','json'))['items']
    names=sorted(p['metadata']['name'] for p in pods if any(c['type']=='Ready' and c['status']=='True' for c in p['status']['conditions']))
    assert len(names)==2,names
    procs=[];logs=[]
    try:
        for name,port in zip(names,[9031,9032]):
            log=(a.capture/f'{name}-forward.log').open('w');logs.append(log)
            procs.append(subprocess.Popen(base+['-n','agentic-demo','port-forward','pod/'+name,f'{port}:9000'],stdout=log,stderr=subprocess.STDOUT))
        for port in [9031,9032]:
            for _ in range(30):
                try:
                    urllib.request.urlopen(f'http://127.0.0.1:{port}/ready',timeout=2).read();break
                except OSError:time.sleep(.3)
            else:raise RuntimeError('port forward not ready')
        subprocess.run([sys.executable,str(Path(__file__).with_name('record.py')),'--phase','function','--model',a.model,'--base-url','http://127.0.0.1:9031/v1','--continuation-base-url','http://127.0.0.1:9032/v1','--corpus','/tmp/aie-full-trace/corpus','--capture',str(a.capture)],check=True)
        for name in names:
            command('-n','agentic-demo','logs',name,'--tail=30')
        command('-n','llm-d-demo','logs','deployment/aie-router-epp','-c','epp','--tail=35')
        proof={'first_gateway_pod':names[0],'continuation_gateway_pod':names[1], 'inference_route':'Agentic API → llm-d standalone router → connector pod → one Spark vLLM GPU', 'database':'shared PostgreSQL', 'limitation':'The connector is a network bridge, not an additional GPU model server.'}
        (a.capture/'deployment-proof.json').write_text(json.dumps(proof,indent=2)+'\n');print(json.dumps(proof),flush=True)
    finally:
        for proc in procs:proc.terminate()
        for proc in procs:proc.wait(timeout=10)
        for log in logs:log.close()


if __name__=='__main__':main()
