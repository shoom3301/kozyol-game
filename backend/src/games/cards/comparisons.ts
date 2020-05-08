import { Card, Suit, Cards } from './types';
import { all, equals, aperture, head, last, find, without } from 'ramda';
import { sortWithTrump } from './utils';

export const sameSuit = (a: Card, b: Card): boolean => a[0] === b[0];
export const sameRank = (a: Card, b: Card): boolean => a[1] === b[1];
export const isTrump = (trump: Suit, card: Card) => card[0] === trump;

/**
 * @returns true if b greater than a
 */
export const isCardsPairGreater = (trump: Suit, a: Card) => (b: Card): boolean => {
  if (sameSuit(a, b)) {
    return b[1] > a[1];
  } else if (isTrump(trump, b)) {
    return true;
  }
  return false;
};

/**
 * @returns true if b greater than a
 */
export const isCardsGreater = (trump: Suit) => (a: Cards, b: Cards) => {
  const sortedA = sortWithTrump(trump)(a);
  let sortedB = sortWithTrump(trump)(b);

  const comparisonResults = sortedA.map(prevCard => {
    const hasWinCard = find(isCardsPairGreater(trump, prevCard), sortedB);
    if (hasWinCard) {
      sortedB = without([hasWinCard], sortedB);
    }
    return !!hasWinCard;
  });

  return all(equals(true), comparisonResults);
};

export const allCardsOfSameRankOrSuit = (cards: Cards) => {
  const ranksPasses = (arr: [Card, Card]) => sameRank(head(arr), last(arr));
  const suitsPasses = (arr: [Card, Card]) => sameSuit(head(arr), last(arr));

  // [1,2,3,4] => [[1,2], [2,3], [3,4]]
  const cardsPairs = aperture(2, cards);
  return all(ranksPasses, cardsPairs) || all(suitsPasses, cardsPairs);
};
