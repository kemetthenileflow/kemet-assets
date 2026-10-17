import './acceptance';
import React from 'react';
import assert from 'node:assert/strict';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { SYMBOL_CARDS, getCardByNumber, getRandomCard } from '../src/data/symbolCards';
import { SymbolDiscover } from '../src/SymbolDiscover';

// 1. Data Integrity checks
assert.equal(SYMBOL_CARDS.length, 31, 'Must have exactly 31 symbol cards');

for (let i = 1; i <= 31; i++) {
  const card = getCardByNumber(i);
  assert.ok(card, `Card ${i} must exist`);
  assert.equal(card.cardNumber, i);
  assert.ok(card.title.length > 0, `Card ${i} must have title`);
  assert.ok(card.arabicTitle.length > 0, `Card ${i} must have Arabic title`);
  assert.ok(card.educationalText.length > 0, `Card ${i} must have educational text`);
  assert.equal(card.path, `/brand/symbol-cards/card-${i.toString().padStart(2, '0')}.png`);
  assert.equal(card.width, 1024);
  assert.equal(card.height, 1536);
}

// 2. Component Navigation & Interactions
cleanup();
let navigatedPage = '';
const view = render(<SymbolDiscover go={(r) => { navigatedPage = r.page; }} />);

// Check Back to Home button
const homeBtn = screen.getByRole('button', { name: 'Back to Home' });
fireEvent.click(homeBtn);
assert.equal(navigatedPage, 'home', 'Back to Home navigates to home');

// Check Initial Card is #1 Tutankhamun
assert.ok(screen.getAllByText('Tutankhamun').length > 0, 'Card 1 Tutankhamun is displayed');

// Check Next button moves to Card #2 (The Egyptian Scribe)
const nextBtn = screen.getByRole('button', { name: 'Next card' });
fireEvent.click(nextBtn);
assert.ok(screen.getAllByText('The Egyptian Scribe').length > 0, 'Next navigates to Card 2');

// Check Previous button moves back to Card #1
const prevBtn = screen.getByRole('button', { name: 'Previous card' });
fireEvent.click(prevBtn);
assert.ok(screen.getAllByText('Tutankhamun').length > 0, 'Previous returns to Card 1');

// Check Discover Another draws a valid card
const discoverBtn = screen.getByRole('button', { name: 'Discover another card' });
fireEvent.click(discoverBtn);
assert.ok(screen.getByText(/Card \d+ of 31/), 'Discover Another displays a valid card counter');

// Check Gallery Grid toggle
const galleryToggle = screen.getByText(/All 31 Cards/);
fireEvent.click(galleryToggle);
assert.ok(screen.getByText('All (31)'), 'Gallery filter shows All (31)');

cleanup();
console.log('PASS SYMBOL CARDS: All 31 cards verified, navigation, random discovery and gallery grid functional');
