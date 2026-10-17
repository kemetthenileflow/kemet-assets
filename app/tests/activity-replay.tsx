import './acceptance';
import React from 'react';
import assert from 'node:assert/strict';
import {render,screen,fireEvent,cleanup} from '@testing-library/react';
import {GrammarPyramidGame,NileQuest,SeshatEvidenceHunt} from '../src/activities';
import {attempts} from '../src/engine';
import core from '../src/data/core.json';
cleanup();render(<GrammarPyramidGame mode="detective" close={()=>{}}/>);
for(const correction of ['who','visit','the professor answered questions']){
 fireEvent.click(screen.getByText(`Replace with "${correction}"`));assert.ok(screen.getByRole('status').textContent?.includes('Accurate detection'));
 if(correction!=='the professor answered questions')fireEvent.click(screen.getByText('Next Grammar Challenge'));
}
fireEvent.click(screen.getByText('Restart Grammar'));assert.ok(screen.getByText(/Step 1\/3/));assert.equal(screen.queryByRole('status'),null);cleanup();console.log('PASS REPLAY: all three detective repairs and restart');
render(<NileQuest close={()=>{}}/>);fireEvent.click(screen.getByText('Financial reward from the newspaper editor'));assert.ok(screen.getByRole('status').textContent?.includes('Re-read'));fireEvent.click(screen.getByText('Next Checkpoint'));fireEvent.click(screen.getByText('The professor detects the deception and reacts aggressively'));assert.ok(screen.getByRole('status').textContent?.includes('True to Chapter 1'));fireEvent.click(screen.getByText('Replay Story Quest'));assert.ok(screen.getByText("Malone's Ambition"));assert.equal(screen.queryByRole('status'),null);cleanup();console.log('PASS REPLAY: story wrong/correct feedback and replay');
render(<SeshatEvidenceHunt close={()=>{}}/>);fireEvent.change(screen.getByPlaceholderText(/Paste or type/),{target:{value:core.READING_PASSAGES[0].paragraphs[0].slice(0,25)}});fireEvent.click(screen.getByText('Verify Evidence'));const latest=attempts().filter(x=>x.mode==='evidence_hunt').at(-1)!;assert.equal(latest.result,'pending');assert.equal(latest.review,'pending');assert.equal(latest.dataset,'derived-evidence');cleanup();console.log('PASS EVIDENCE: verbatim span does not earn an automatic correctness grade or enter source330');
