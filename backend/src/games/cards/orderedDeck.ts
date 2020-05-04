import { hearts, diamonds, spades, clubs } from './make';
import { Value } from './types';

export const orderedDeck = () => [
  hearts(Value.Six),
  hearts(Value.Seven),
  hearts(Value.Eight),
  hearts(Value.Nine),
  hearts(Value.Jack),
  hearts(Value.Queen),
  hearts(Value.King),
  hearts(Value.Ten),
  hearts(Value.Ace),

  diamonds(Value.Six),
  diamonds(Value.Seven),
  diamonds(Value.Eight),
  diamonds(Value.Nine),
  diamonds(Value.Jack),
  diamonds(Value.Queen),
  diamonds(Value.King),
  diamonds(Value.Ten),
  diamonds(Value.Ace),

  spades(Value.Six),
  spades(Value.Seven),
  spades(Value.Eight),
  spades(Value.Nine),
  spades(Value.Jack),
  spades(Value.Queen),
  spades(Value.King),
  spades(Value.Ten),
  spades(Value.Ace),

  clubs(Value.Six),
  clubs(Value.Seven),
  clubs(Value.Eight),
  clubs(Value.Nine),
  clubs(Value.Jack),
  clubs(Value.Queen),
  clubs(Value.King),
  clubs(Value.Ten),
  clubs(Value.Ace),
];
