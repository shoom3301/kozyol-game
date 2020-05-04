import { Value, Suit, SuitCharMap, ValueCharMap } from 'model/Card';

export function cardImage(value: Value, suit: Suit) {
  return `http://richardschneider.github.io/cardsJS/cards/${ValueCharMap[value]}${SuitCharMap[suit]}.svg`
}
