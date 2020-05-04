import { Suit } from './types';

export const randomArrayValue = <T>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)];

export const randomSuit = (): Suit =>
  randomArrayValue([Suit.Hearts, Suit.Clubs, Suit.Diamonds, Suit.Spades]);