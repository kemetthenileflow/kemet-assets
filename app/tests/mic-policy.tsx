import './acceptance';
import React from 'react';
import assert from 'node:assert/strict';
import {render,screen,fireEvent,waitFor,cleanup} from '@testing-library/react';
import {VoiceMirror} from '../src/VoiceMirror';
cleanup();let requested=0;Object.defineProperty(navigator,'mediaDevices',{configurable:true,value:{getUserMedia:async()=>{requested++;throw Error('must not be called')}}});Object.defineProperty(globalThis,'MediaRecorder',{configurable:true,value:class {}});Object.defineProperty(document,'permissionsPolicy',{configurable:true,value:{allowsFeature:()=>false}});
render(<VoiceMirror prompt="Speak"/>);fireEvent.click(screen.getByText('Record my voice'));await waitFor(()=>assert.ok(screen.getByText(/Open Voice Mirror in a separate tab/)));assert.equal(requested,0);assert.ok(screen.getByRole('status').textContent?.includes('embedded preview'));assert.ok(screen.getByRole('link',{name:/Open Voice Mirror/}).getAttribute('href')?.endsWith('/?practice=voice'));cleanup();console.log('PASS MICROPHONE POLICY: blocked frame does not request hardware and offers standalone practice');
