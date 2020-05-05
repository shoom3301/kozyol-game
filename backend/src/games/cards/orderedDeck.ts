import { hearts, diamonds, spades, clubs } from './make';
import { Rank } from './types';

export const orderedDeck = () => [
  hearts(Rank.Six),
  hearts(Rank.Seven),
  hearts(Rank.Eight),
  hearts(Rank.Nine),
  hearts(Rank.Jack),
  hearts(Rank.Queen),
  hearts(Rank.King),
  hearts(Rank.Ten),
  hearts(Rank.Ace),

  diamonds(Rank.Six),
  diamonds(Rank.Seven),
  diamonds(Rank.Eight),
  diamonds(Rank.Nine),
  diamonds(Rank.Jack),
  diamonds(Rank.Queen),
  diamonds(Rank.King),
  diamonds(Rank.Ten),
  diamonds(Rank.Ace),

  spades(Rank.Six),
  spades(Rank.Seven),
  spades(Rank.Eight),
  spades(Rank.Nine),
  spades(Rank.Jack),
  spades(Rank.Queen),
  spades(Rank.King),
  spades(Rank.Ten),
  spades(Rank.Ace),

  clubs(Rank.Six),
  clubs(Rank.Seven),
  clubs(Rank.Eight),
  clubs(Rank.Nine),
  clubs(Rank.Jack),
  clubs(Rank.Queen),
  clubs(Rank.King),
  clubs(Rank.Ten),
  clubs(Rank.Ace),
];
