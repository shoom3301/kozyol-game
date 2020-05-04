//S-spades,H-hearts,D-diamonds,C-clubs

import { Suit, SuitCharMap, Value, ValueCharMap } from '../../../types/card';

export function cardImage(value: Value, suit: Suit) {
  return `http://richardschneider.github.io/cardsJS/cards/${ValueCharMap[value]}${SuitCharMap[suit]}.svg`
}
