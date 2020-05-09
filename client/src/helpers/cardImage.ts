import { Card, SuitCharMap, ValueCharMap } from 'model/Card'

export function cardImage([suit, value]: Card) {
  return `http://richardschneider.github.io/cardsJS/cards/${ValueCharMap[value]}${SuitCharMap[suit]}.svg`
}
