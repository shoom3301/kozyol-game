import { Value, Suit, Card, Deck } from './types';
import { randomArrayValue } from './utils';
import { orderedDeck } from './orderedDeck';

const makeCard = (val: Value, suit: Suit): Card => [suit, val];
export const hearts = (val: Value) => makeCard(val, Suit.Hearts);
export const diamonds = (val: Value) => makeCard(val, Suit.Diamonds);
export const clubs = (val: Value) => makeCard(val, Suit.Clubs);
export const spades = (val: Value) => makeCard(val, Suit.Spades);

export const makeDeck = (): Deck => {
  const deck: Deck = [];
  const fullDeck = orderedDeck();

  while (deck.length < 36) {
    const randomCard = randomArrayValue(fullDeck);
    if (!deck.includes(randomCard)) {
      deck.push(randomCard);
    }
  }

  return deck;
};
