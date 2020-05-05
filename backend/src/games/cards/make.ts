import { Rank, Suit, Card, Deck } from './types';
import { randomArrayValue } from './utils';
import { orderedDeck } from './orderedDeck';

const makeCard = (val: Rank, suit: Suit): Card => [suit, val];
export const hearts = (val: Rank) => makeCard(val, Suit.Hearts);
export const diamonds = (val: Rank) => makeCard(val, Suit.Diamonds);
export const clubs = (val: Rank) => makeCard(val, Suit.Clubs);
export const spades = (val: Rank) => makeCard(val, Suit.Spades);

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
