//S-spades,H-hearts,D-diamonds,C-clubs

export enum Suit {
  Hearts = 0, // – червы ♥
  Diamonds, // – бубны ♦
  Clubs, // – трефы ♣
  Spades, // – пики точеные ♠
}

export const suitSymbols = ['♥', '♦', '♣', '♠']

export const SuitCharMap = {
  [Suit.Hearts]: 'H',
  [Suit.Diamonds]: 'D',
  [Suit.Clubs]: 'C',
  [Suit.Spades]: 'S'
}

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

export const ValueCharMap = {
  [Value.Six]: '6',
  [Value.Seven]: '7',
  [Value.Eight]: '8',
  [Value.Nine]: '9',
  [Value.Jack]: 'J',
  [Value.Queen]: 'Q',
  [Value.King]: 'K',
  [Value.Ten]: '10',
  [Value.Ace]: 'A'
}

export type Card = [Suit, Value];
export type Cards = Card[];

export type Deck = Cards;

export type Hand = Cards;

export type Trick = Cards;

export type Desk = Array<{ [player: number]: Cards }>;
