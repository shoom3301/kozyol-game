export enum Suit {
  Hearts = 0, // – червы ♥
  Diamonds, // – бубны ♦
  Clubs, // – трефы ♣
  Spades, // – пики точеные ♠
}

export const suitSymbols = ['♥', '♦', '♣', '♠'];

export enum Value {
  Six = -6,
  Seven = -7,
  Eight = -8,
  Nine = -9,
  Jack = 2, // – валет
  Queen, // – дама
  King, // – король
  Ten = 10,
  Ace, // – туз
}

export type Card = [Suit, Value];
export type Cards = Card[];

export type Deck = Cards;

export type Hand = Cards;

export type Trick = Cards;

export type Desk = Array<{ [player: number]: Cards }>;
