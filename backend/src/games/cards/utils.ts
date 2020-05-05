import { Suit, Card } from './types';
import { sortWith } from 'ramda';

export const randomArrayValue = <T>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)];

export const randomSuit = (): Suit =>
  randomArrayValue([Suit.Hearts, Suit.Clubs, Suit.Diamonds, Suit.Spades]);

export const suitSymbols = ['♥', '♦', '♣', '♠'];

// make piki to4enie great again
// sort by suit then by rank
export const sortWithTrump = (trump: Suit) => {
  // trump suit increased by 4
  const calcWeight = (suit: Suit) => (suit === trump ? suit + 4 : suit);

  const sortBySuit = (fn: (suit: Suit) => number) => (a: Card, b: Card) => fn(a[0]) - fn(b[0]);

  const sortByRank = (a: Card, b: Card) => a[1] - b[1];

  return sortWith([sortBySuit(calcWeight), sortByRank]);
};
