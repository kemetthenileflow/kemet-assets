import './acceptance';
import React from 'react';
import assert from 'node:assert/strict';
import {render,screen,fireEvent,cleanup} from '@testing-library/react';
import {RosettaDecoder} from '../src/activities';
import core from '../src/data/core.json';
for(const size of [4,6,8]) {
 cleanup();const view=render(<RosettaDecoder close={()=>{}}/>);
 fireEvent.change(screen.getByLabelText('Decoder level'),{target:{value:String(size)}});
 const seen=new Set<string>();
 for(let round=0;round<Math.ceil(66/size);round++) {
  const items=core.UNIT_1_VOCABULARY.slice(round*size,(round+1)*size);
  for(const word of items){
   const words=Array.from(view.container.querySelectorAll('.words-col button')) as HTMLButtonElement[];
   const meanings=Array.from(view.container.querySelectorAll('.meanings-col button')) as HTMLButtonElement[];
   const w=words.find(b=>b.textContent?.trim()===word.word)!;
   const text=word.englishMeaning+(size===4?' ('+word.arabicMeaning+')':'');
   const m=meanings.find(b=>b.textContent?.trim()===text)!;
   assert.ok(w && m,`round ${round+1} has matching pair ${word.id}`);
   fireEvent.click(w);fireEvent.click(m);assert.ok(w.disabled && m.disabled);seen.add(word.id);
  }
  fireEvent.click(screen.getByText('Next Decoder Set'));
 }
 assert.equal(seen.size,66);assert.ok(screen.getByText(/Set 1 of/));
 console.log(`PASS GAME ${size} pairs: all 66 matched, partial final set completed, replay returned to set 1`);
}
cleanup();
