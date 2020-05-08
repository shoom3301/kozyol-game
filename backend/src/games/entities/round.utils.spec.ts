/* eslint-disable @typescript-eslint/no-use-before-define */
import { orderedTurns, chargeHands, detectBingoTurn, deskToObj } from './round.utils';
import { spades, hearts, clubs, diamonds } from '../cards/make';
import { Rank } from '../cards/types';
import { take } from 'ramda';

describe('round utils', () => {
  it('create ordered turns according to first player', () => {
    expect(orderedTurns(3, [1, 2, 3, 4])).toEqual([3, 4, 1, 2]);
    expect(orderedTurns(5, [4, 2, 3, 5, 8])).toEqual([5, 8, 4, 2, 3]);
    expect(orderedTurns(1, [1, 2, 3])).toEqual([1, 2, 3]);
    expect(orderedTurns(2, [1, 2])).toEqual([2, 1]);
  });

  describe('charge hands in right order', () => {
    it('when cards amount in the deck is enough', () => {
      const { chargedHands, reducedDeck } = chargeHands(hands, getDeck(), 2);

      expect(chargedHands).toEqual({
        1: [hearts(Rank.Ten), clubs(Rank.Ace), hearts(Rank.Jack), spades(Rank.Nine)],
        2: [hearts(Rank.King), clubs(Rank.Queen), spades(Rank.King), spades(Rank.Ten)],
        3: [spades(Rank.Seven), spades(Rank.Six), spades(Rank.Queen), hearts(Rank.Six)],
      });
      expect(reducedDeck).toEqual([clubs(Rank.Eight), clubs(Rank.Six)]);
    });

    it('when deck is empty', () => {
      const emptyDeck = [];
      const { chargedHands, reducedDeck } = chargeHands(hands, emptyDeck, 1);
      expect(chargedHands).toEqual(hands);
      expect(reducedDeck).toEqual(emptyDeck);
    });

    it('when cards amount in the deck is NOT enough', () => {
      const notFullDeck = take(3, getDeck());

      const { chargedHands, reducedDeck } = chargeHands(hands, notFullDeck, 1);

      expect(chargedHands).toEqual({
        1: [hearts(Rank.Ten), clubs(Rank.Ace), notFullDeck[0]],
        2: [hearts(Rank.King), clubs(Rank.Queen), notFullDeck[1]],
        3: [spades(Rank.Seven), spades(Rank.Six), notFullDeck[2]],
      });
      expect(reducedDeck).toEqual([]);
    });
  });

  it('detect bingo turn', () => {
    expect(detectBingoTurn(handsWithBingoSuits)).toEqual(2);
    expect(detectBingoTurn(handsWithBingoRanks)).toEqual(3);
    expect(detectBingoTurn(handsWithoutBingo)).toEqual(null);
  });

  it('deskToObj', () => {
    const deskObj = deskToObj([
      { 1: [hearts(Rank.Ten), clubs(Rank.Ace)] },
      { 2: [hearts(Rank.King), clubs(Rank.Queen)] },
      { 3: [spades(Rank.Seven), spades(Rank.Six)] },
    ]);
    expect(deskObj).toEqual({
      1: [hearts(Rank.Ten), clubs(Rank.Ace)],
      2: [hearts(Rank.King), clubs(Rank.Queen)],
      3: [spades(Rank.Seven), spades(Rank.Six)],
    });
  });
});

const handsWithBingoSuits = {
  1: [hearts(Rank.Ten), clubs(Rank.Ace), hearts(Rank.Jack), hearts(Rank.Six)],
  2: [spades(Rank.Seven), spades(Rank.Six), spades(Rank.Queen), spades(Rank.Nine)],
  3: [hearts(Rank.King), clubs(Rank.Queen), spades(Rank.King), spades(Rank.Ten)],
};

const handsWithoutBingo = {
  1: [hearts(Rank.Ten), clubs(Rank.Ace), hearts(Rank.Jack), spades(Rank.Nine)],
  2: [hearts(Rank.King), clubs(Rank.Queen), spades(Rank.King), spades(Rank.Ten)],
  3: [spades(Rank.Seven), spades(Rank.Six), spades(Rank.Queen), hearts(Rank.Six)],
};

const handsWithBingoRanks = {
  1: [hearts(Rank.Ten), clubs(Rank.Ace), hearts(Rank.Jack), spades(Rank.Nine)],
  2: [hearts(Rank.King), clubs(Rank.Queen), spades(Rank.King), spades(Rank.Ten)],
  3: [hearts(Rank.Seven), spades(Rank.Seven), clubs(Rank.Seven), diamonds(Rank.Seven)],
};

const hands = {
  1: [hearts(Rank.Ten), clubs(Rank.Ace)],
  2: [hearts(Rank.King), clubs(Rank.Queen)],
  3: [spades(Rank.Seven), spades(Rank.Six)],
};

const getDeck = () => [
  spades(Rank.King),
  spades(Rank.Ten),
  spades(Rank.Queen),
  hearts(Rank.Six),
  hearts(Rank.Jack),
  spades(Rank.Nine),
  clubs(Rank.Eight),
  clubs(Rank.Six),
];
