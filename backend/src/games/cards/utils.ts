import { Suit, Card, Desk, Cards } from './types';
import { sortWith, toPairs, head, without, map, always, concat, findIndex } from 'ramda';
import { isCardsGreater, isCardsPairGreater } from './comparisons';

export const randomArrayValue = <T>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)];

export const randomSuit = (): Suit =>
  randomArrayValue([Suit.Hearts, Suit.Clubs, Suit.Diamonds, Suit.Spades]);

export const suitSymbols = ['♥', '♦', '♣', '♠'];

// make piki to4enie great again
// sort by suit then by rank
export const sortWithTrump = (trump: Suit) => {
  // trump suit increased by 4
  const calcWeight = (suit: Suit) => (suit === trump ? suit + 4 : suit);

  const sortBySuit = (fn: (suit: Suit) => number) => (a: Card, b: Card) => fn(a[0]) - fn(b[0]);

  const sortByRank = (a: Card, b: Card) => a[1] - b[1];

  return sortWith([sortBySuit(calcWeight), sortByRank]);
};

export const hideLosersCards = (desk: Desk, trump: Suit): { [id: number]: Cards | null[] }[] => {
  if (desk.length === 0) {
    return desk;
  }

  // transform desk
  // [{1: [a,b]}, {2:[c,d]}] => [[1, [a,b]], [2, [c,d]]]
  const deskAsPairs = map(item => head(toPairs(item)), desk);

  let winnerPair = head(deskAsPairs);

  const deskTail: [number, Cards | null[]][] = without([winnerPair], deskAsPairs).map(
    ([id, cards]) => {
      if (isCardsGreater(trump)(winnerPair[1], cards)) {
        winnerPair = [id, cards];
        return [parseInt(id, 10), cards];
      } else {
        return [parseInt(id, 10), map(always(null), cards)];
      }
    },
  );

  const deskHead: [number, Cards] = [parseInt(head(deskAsPairs)[0], 10), head(deskAsPairs)[1]];
  const newDeskPairs = concat([deskHead], deskTail);
  const result = newDeskPairs.map(([id, cards]) => ({ [id]: cards }));
  return result;
};

export const prettifyWinnerTurn = (trump: Suit) => (
  prevCards: Cards,
  winnerCards: Cards,
): Cards => {
  let winnerSorted = sortWithTrump(trump)(winnerCards);

  const orderedWinnerCards = prevCards.map(prevCard => {
    const winCardIdx = findIndex(isCardsPairGreater(trump, prevCard), winnerSorted);
    const winCard = winnerSorted[winCardIdx];
    winnerSorted = without([winCard], winnerSorted);
    return winCard;
  });

  return orderedWinnerCards;
};
