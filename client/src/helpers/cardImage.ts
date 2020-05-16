import { Card, SuitCharMap, ValueCharMap } from 'model/Card'

export function cardImage([suit, value]: Card) {
  return `/cards/${ValueCharMap[value]}${SuitCharMap[suit]}.svg`
}
