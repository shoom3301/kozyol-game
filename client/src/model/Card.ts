//S-spades,H-hearts,D-diamonds,C-clubs

export enum Suit {
  Hearts = 0, // – червы ♥
  Diamonds, // – бубны ♦
  Clubs, // – трефы ♣
  Spades, // – пики точеные ♠
}

export const suitSymbols = ["♥", "♦", "♣", "♠"];

export const suitIsRed: {[key: number]: boolean} = {
  [Suit.Hearts]: true,
  [Suit.Diamonds]: true,
  [Suit.Clubs]: false,
  [Suit.Spades]: false
};

export const SuitCharMap = {
  [Suit.Hearts]: "H",
  [Suit.Diamonds]: "D",
  [Suit.Clubs]: "C",
  [Suit.Spades]: "S",
};

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

export const ValueCharMap = {
  [Rank.Six]: "6",
  [Rank.Seven]: "7",
  [Rank.Eight]: "8",
  [Rank.Nine]: "9",
  [Rank.Jack]: "J",
  [Rank.Queen]: "Q",
  [Rank.King]: "K",
  [Rank.Ten]: "10",
  [Rank.Ace]: "A",
};

export type Card = [Suit, Rank];
export type Cards = Card[];
export type Deck = Cards;
export type Hand = Cards;
export type Trick = Cards;
export type Desk = Array<{ [player: number]: Cards }>;
