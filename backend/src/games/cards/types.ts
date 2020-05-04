export enum Suit {
  Hearts, // – червы
  Diamonds, // – бубны
  Clubs, // – трефы
  Spades, // – пики точеные
}

export enum Value {
  Six = 0,
  Seven = 0,
  Eight = 0,
  Nine = 0,
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

export type Desk = {
  [player: number]: Cards;
};
