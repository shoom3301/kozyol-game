import { Card, Cards } from 'model/Card';

export function canCardBeSelected(card: Card, selectedCards: Cards): boolean {
  return selectedCards.every(item => item[0] === card[0] || item[1] === card[1])
}
