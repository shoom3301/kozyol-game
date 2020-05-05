export enum Suit {
  Hearts = 0, // – червы ♥
  Diamonds, // – бубны ♦
  Clubs, // – трефы ♣
  Spades, // – пики точеные ♠
}

export enum Rank {
  Six = 6,
  Seven = 7,
  Eight = 8,
  Nine = 9,
  Jack = 102, // – валет
  Queen = 103, // – дама
  King = 104, // – король
  Ten = 110,
  Ace = 111, // – туз
}

export type Card = [Suit, Rank];
export type Cards = Card[];
export type Deck = Cards;
export type Hand = Cards;
export type Trick = Cards;
export type Desk = Array<{ [player: number]: Cards }>;
