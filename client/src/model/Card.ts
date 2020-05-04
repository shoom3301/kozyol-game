//S-spades,H-hearts,D-diamonds,C-clubs

export function cardImage(value: string, suit: string) {
  return `http://richardschneider.github.io/cardsJS/cards/${value}${suit}.svg`
}
