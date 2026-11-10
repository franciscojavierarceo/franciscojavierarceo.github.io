'use strict';
const $=id=>document.getElementById(id);
let data,term,playing=false,position=0,last=0,frame=0,termIndex=0,eventIndex=0,serverRound=0,wireRound=0,pieces=[],argumentsText='',outputText='';
const pretty=x=>JSON.stringify(x,null,2),clock=t=>`${String(Math.floor(t/60)).padStart(2,'0')}:${String(Math.floor(t%60)).padStart(2,'0')}`;
function fit(){if(!term||!data)return;const r=$('terminal').getBoundingClientRect();const size=Math.max(5,Math.floor(Math.min(r.width/(data.cols*.61),r.height/(data.rows*1.22))));term.options.fontSize=size;term.resize(data.cols,data.rows);}
function controls(){$('play').textContent=playing?'Ⅱ Pause · P':'▶ Play · P';$('play').setAttribute('aria-pressed',String(playing));$('seek').value=position;$('clock').textContent=`${clock(position)} / ${clock(data.duration)}`;}
function pause(){playing=false;cancelAnimationFrame(frame);controls();}
function play(){if(!data)return;if(position>=data.duration)seek(0);playing=true;last=performance.now();controls();frame=requestAnimationFrame(tick);}
function toggle(){if(playing)pause();else play();}
function tokenView(){const frag=document.createDocumentFragment();for(const piece of pieces.slice(-36)){const span=document.createElement('span');span.textContent=piece.replaceAll(' ','·').replaceAll('\n','\\n');frag.append(span);}$('tokens').replaceChildren(frag);}
function apply(row){const d=row.data;
 if(row.side==='server'){
  if(row.request){serverRound++;$('round').textContent=`INFERENCE ROUND ${serverRound} / ${data.rounds}`;$('server-title').textContent=d.output?'Codex returns tool output':'Codex sends the task';let text=`POST /v1/responses\nstore: ${d.store}\n${d.input_items} input items\n\n`;
   if(d.output){text+=`${d.output.type}\n${d.output.call_id}\n\n`+d.output.output.split('Output:\n').slice(-1)[0];}else text+='Initial instructions + user prompt.\nCodex owns terminal execution.';
   $('server').textContent=text.length>1800?text.slice(0,1000)+'\n… excerpt …\n'+text.slice(-650):text;
  }else if(d.type==='response.output_item.done'&&d.item.type==='function_call'){
   $('server-title').textContent='Model requests a client tool';const i=d.item;$('server').textContent=pretty({type:i.type,name:i.name,call_id:i.call_id,arguments:i.arguments})+'\n\nCodex executes this in its workspace.';
  }else if(d.type==='response.completed'){$('server-title').textContent='Round completed';$('server').textContent=pretty(d.response);}
 }else{
  if(row.request){wireRound++;pieces=[];argumentsText='';outputText='';$('tokens').replaceChildren();$('stream').textContent='';$('wire-title').textContent=`Inference round ${wireRound} / ${data.rounds}`;$('wire-label').textContent='ACTUAL SAMPLED TOKEN PIECES';$('wire-raw').textContent='POST /v1/responses\nInput includes prior tool outputs.';}
  else if(d.type==='response.output_text.delta'){
   $('wire-label').textContent='ACTUAL SAMPLED TOKEN PIECES';pieces.push(...(d.logprobs||[]).map(t=>t.token));outputText+=d.delta;tokenView();$('stream').textContent=outputText.slice(-1000);$('wire-raw').textContent=d.type+'\n'+pretty({delta:d.delta,logprobs:(d.logprobs||[]).map(t=>({token:t.token,logprob:t.logprob}))}).slice(0,750);
  }else if(d.type==='response.function_call_arguments.delta'){
   $('wire-label').textContent='STREAMED ARGUMENT FRAGMENTS';argumentsText+=d.delta;$('tokens').replaceChildren();$('stream').textContent=argumentsText.slice(-1600);$('wire-raw').textContent=d.type+'\n'+pretty({delta:d.delta})+'\n\nFragments are not token boundaries.';
  }else if(d.type==='response.output_item.done'&&d.item.type==='function_call'){
   $('wire-title').textContent='Function call assembled';$('stream').textContent=d.item.arguments;$('wire-raw').textContent=`${d.type}\nname: ${d.item.name}\ncall_id: ${d.item.call_id}`;argumentsText='';
  }
 }
}
function advance(t){while(termIndex<data.terminal.length&&data.terminal[termIndex][0]<=t){term.write(data.terminal[termIndex++][1]);}while(eventIndex<data.events.length&&data.events[eventIndex].time<=t)apply(data.events[eventIndex++]);controls();}
function seek(t){position=Math.min(data.duration,Math.max(0,t));term.write('\x1bc');termIndex=eventIndex=serverRound=wireRound=0;pieces=[];argumentsText=outputText='';$('round').textContent='BEFORE THE FIRST REQUEST';$('server-title').textContent='Waiting for the Codex prompt';$('server').textContent='';$('wire-title').textContent='Waiting for inference';$('tokens').replaceChildren();$('stream').textContent='';$('wire-raw').textContent='';advance(position);last=performance.now();}
function tick(now){if(!playing)return;position=Math.min(data.duration,position+(now-last)/1000*Number($('speed').value));last=now;advance(position);if(position>=data.duration){pause();return;}frame=requestAnimationFrame(tick);}
$('play').onclick=toggle;$('replay').onclick=()=>{pause();seek(0);};$('seek').oninput=()=>seek(Number($('seek').value));$('speed').onchange=()=>{last=performance.now();};
document.addEventListener('keydown',e=>{if(e.target.matches('input,select'))return;if(e.key.toLowerCase()==='p'){e.preventDefault();toggle();}if(e.key.toLowerCase()==='v'){e.preventDefault();if(document.fullscreenElement)document.exitFullscreen();else document.documentElement.requestFullscreen();}});
window.addEventListener('message',e=>{if(e.source!==parent||e.origin!==location.origin||!data)return;if(e.data==='trace-toggle')toggle();if(e.data==='trace-pause')pause();});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&data)pause();});
fetch('data.json').then(r=>{if(!r.ok)throw Error('Cannot load recorded trace');return r.json();}).then(d=>{data=d;data.rounds=d.events.filter(r=>r.side==='server'&&r.request).length;term=new Terminal({cols:d.cols,rows:d.rows,disableStdin:true,scrollback:4000,convertEol:false,fontFamily:'ui-monospace, "DejaVu Sans Mono", monospace',fontSize:12,lineHeight:1.05,theme:{background:'#030303',foreground:'#f1f1f0',cursor:'#30a2ff',blue:'#30a2ff',brightBlue:'#58b3ff',yellow:'#fdb515',brightYellow:'#ffdb78'},allowProposedApi:false});term.open($('terminal'));new ResizeObserver(fit).observe($('terminal-wrap'));fit();$('seek').max=d.duration;seek(2.8);parent.postMessage({type:'codex-trace-ready',duration:d.duration},location.origin);}).catch(error=>{$('error').style.display='block';$('error').textContent=error.message;});
