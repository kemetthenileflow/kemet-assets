import './acceptance';
import React from 'react';
import assert from 'node:assert/strict';
import { render, screen, fireEvent, cleanup, waitFor, act } from '@testing-library/react';
import { VoiceMirror } from '../src/VoiceMirror';
import App from '../src/App';
import core from '../src/data/core.json';
import {queue, advance} from '../src/engine';
const check=(name:string, fn:()=>void)=>{fn();console.log('PASS REVIEW',name)};
(window as any).scrollTo=()=>{};
for (const [dataset,items] of [['unit1',core.UNIT_1_VOCABULARY],['story',core.STORY_VOCABULARY_59]] as const) {
 const ids=items.map(x=>x.id), c={mode:'coverage',dataset,version:'review'};const seen:string[]=[];
 for(let i=0;i<ids.length;i++){const q=queue('review-coverage',c,ids);seen.push(q.ids[q.cursor]);advance('review-coverage',c,ids)}
 check(`${dataset} all words reachable without repetition`,()=>assert.equal(new Set(seen).size,ids.length));
}
let stopped=0,revoked:string[]=[],created=0;
const stream={getTracks:()=>[{stop:()=>stopped++}],getAudioTracks:()=>[{}]};
Object.defineProperty(navigator,'mediaDevices',{configurable:true,value:{getUserMedia:async()=>stream}});
URL.createObjectURL=()=>`blob:review-${++created}`;URL.revokeObjectURL=(u)=>revoked.push(u);
class Recorder {static isTypeSupported(t:string){return t==='audio/mp4'};state='inactive';mimeType='audio/mp4';onstop:any;ondataavailable:any;onerror:any;static latest:Recorder;
 constructor(){Recorder.latest=this};start(){this.state='recording'};stop(){this.state='inactive';this.ondataavailable?.({data:new Blob(['test-audio'])});this.onstop?.()}}
Object.defineProperty(globalThis,'MediaRecorder',{configurable:true,value:Recorder});
render(<VoiceMirror prompt="Speak clearly"/>);
fireEvent.click(screen.getByText('Record my voice'));await waitFor(()=>assert.ok(screen.getByText(/Recording… speak now/)));
check('recording has stop enabled',()=>assert.equal((screen.getByText('Stop recording') as HTMLButtonElement).disabled,false));
fireEvent.click(screen.getByText('Stop recording'));await waitFor(()=>assert.ok(screen.getByText('Replay recording')));
check('recording produces playable local URL and releases track',()=>{assert.equal(screen.getByLabelText('Your voice recording').getAttribute('src'),'blob:review-1');assert.ok(stopped>0)});
fireEvent.click(screen.getByText('Record again'));await waitFor(()=>assert.ok(screen.getByText(/Recording… speak now/)));
fireEvent.click(screen.getByText('Stop recording'));await waitFor(()=>assert.equal(screen.getByLabelText('Your voice recording').getAttribute('src'),'blob:review-2'));
check('record again revokes previous object URL',()=>assert.ok(revoked.includes('blob:review-1')));
fireEvent.click(screen.getByText('Delete recording'));check('delete removes recording and revokes URL',()=>{assert.equal(screen.queryByLabelText('Your voice recording'),null);assert.ok(revoked.includes('blob:review-2'))});cleanup();
for (const [name,expect] of [['NotAllowedError','permission was not granted'],['NotFoundError','No microphone'],['NotReadableError','busy or blocked']]) {
 (navigator.mediaDevices as any).getUserMedia=async()=>{throw {name}};
 render(<VoiceMirror prompt="Speak"/>);fireEvent.click(screen.getByText('Record my voice'));await waitFor(()=>assert.ok(screen.getByRole('status').textContent?.includes(expect)));console.log('PASS REVIEW',name,'explicit recovery');cleanup();
}
let resolve:any;(navigator.mediaDevices as any).getUserMedia=()=>new Promise(r=>resolve=r);
render(<VoiceMirror prompt="Speak"/>);fireEvent.click(screen.getByText('Record my voice'));fireEvent.click(screen.getByText('Cancel permission request'));const before=stopped;await act(async()=>resolve(stream));check('late stream after cancellation is closed',()=>assert.ok(stopped>before));cleanup();
(navigator.mediaDevices as any).getUserMedia=async()=>stream;
render(<VoiceMirror prompt="Speak"/>);fireEvent.click(screen.getByText('Record my voice'));await waitFor(()=>assert.ok(screen.getByText(/Recording… speak now/)));const stopBefore=stopped;cleanup();check('leaving recording screen releases microphone',()=>assert.ok(stopped>stopBefore));
render(<App/>);fireEvent.click(screen.getAllByText('All 18 original PDFs')[0]);check('all 18 documents have an accessible reader action',()=>assert.equal(screen.getAllByText('Read original PDF').length,18));cleanup();
render(<App/>);fireEvent.click(screen.getByRole('button',{name:/2 Explore/}));fireEvent.click(screen.getAllByRole('button',{name:/Alexandrian Reading/})[0]);check('reading route selects Reading instead of stale category',()=>assert.ok(screen.getByRole('heading',{name:core.READING_PASSAGES[0].title})));cleanup();
render(<App/>);fireEvent.click(screen.getByText('Unit 1 listening'));check('listening shortcut opens curriculum recordings',()=>assert.ok(screen.getByRole('heading',{name:'Unit 1 Curriculum Listening | الاستماع المنهجي'})));cleanup();
console.log('Review tests completed: mocked recording and jsdom navigation; no personal microphone test.');
