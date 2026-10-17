import './acceptance';
import React from 'react';
import assert from 'node:assert/strict';
import {render,screen,fireEvent,cleanup} from '@testing-library/react';
import {MediaLibrary} from '../src/ui';
import core from '../src/data/core.json';
cleanup();let route:any;render(<MediaLibrary initialCategory="curriculum_listening" go={r=>route=r}/>);
for(const [audioId,n] of [['REC-01',16],['REC-04',14]] as const){
 fireEvent.click(screen.getByRole('button',{name:new RegExp(`Open Echoes.*${audioId}`)}));assert.equal(route.audioId,audioId);assert.equal(route.bank,'L1');assert.equal(core.ALL_330_QUESTIONS.filter(q=>q.bankId==='L1'&&q.relatedAudioId===route.audioId).length,n);
}
cleanup();console.log('PASS LISTENING: each media shortcut preserves its selected recording and correct 16/14-question pool');
