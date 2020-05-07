/* eslint-disable @typescript-eslint/no-use-before-define */
import { Round } from './round';
import { Deck, Cards, Desk } from '../cards/types';
import { User } from 'src/user/user.entity';
import {
  findIndex,
  equals,
  slice,
  concat,
  keys,
  map,
  fromPairs,
  range,
  toPairs,
  find,
  zipObj,
  repeat,
  all,
  last,
  clone,
  reduce,
  assoc,
  head,
} from 'ramda';
import { allCardsOfSameRankOrSuit } from '../cards/comparisons';
import { GameSet } from './set';

type Hands = { [id: number]: Cards };

type NewRoundArtefacts = {
  updatedDeck: Deck;
  newRound: Round;
};

export const startNewRound = async (playersIds: number[], deck: Deck, prevSet?: GameSet) => {
  const emptyHands = zipObj(playersIds, repeat([] as Cards, playersIds.length));

  // detect first turn player
  let firstPlayerId = playersIds[0];
  if (prevSet) {
    const lastRound = await Round.findOne({
      where: { set: prevSet },
      order: { createdAt: 'DESC' },
    });
    if (lastRound) {
      firstPlayerId = lastRound.winner.id;
    }
  }

  return initRound(emptyHands, firstPlayerId, deck);
};

export const startNextRound = (from: Round, deck: Deck) =>
  initRound(from.hands, from.winner.id, deck);

const initRound = (hands: Hands, firstPlayerId: number, deck: Deck): NewRoundArtefacts => {
  const newRound = new Round();
  newRound.desk = [];

  const { chargedHands, reducedDeck } = chargeHands(hands, deck, firstPlayerId);
  newRound.hands = chargedHands;

  const bingoTurnUserId = detectBingoTurn(chargedHands);
  newRound.currentPlayer = { id: bingoTurnUserId || firstPlayerId } as User;

  return { updatedDeck: reducedDeck, newRound };
};

export const orderedTurns = (startFrom: number, playersIds: number[]) => {
  const startIdx = findIndex(equals(startFrom), playersIds);
  const head = slice(startIdx, playersIds.length, playersIds);
  const tail = slice(0, startIdx, playersIds);

  return concat(head, tail);
};

export const chargeHands = (
  hands: Hands,
  deck: Deck,
  startPlayerId: number,
): { chargedHands: Hands; reducedDeck: Deck } => {
  if (deck.length === 0) {
    return { chargedHands: hands, reducedDeck: deck };
  }

  const intKeys = keys(hands).map(k => parseInt(`${k}`, 10));
  const orderedIds = orderedTurns(startPlayerId, intKeys);

  const clonedDeck = clone(deck);
  const maxCardsAmountByHandToCharge = Math.floor(clonedDeck.length / intKeys.length);

  const chargedHandsPairs: [number, Cards][] = orderedIds.map(id => {
    const cards: Cards = hands[id];
    const chargedCards = map(
      _ => clonedDeck.shift(),
      range(0, Math.min(maxCardsAmountByHandToCharge, 4 - cards.length)),
    );
    return [id, concat(cards, chargedCards)];
  });

  return {
    chargedHands: fromPairs(chargedHandsPairs),
    reducedDeck: clonedDeck,
  };
};

export const detectBingoTurn = (hands: Hands): number | null => {
  const handsPairs = toPairs(hands);

  if (!all((cards: Cards) => cards.length === 4, map(last, handsPairs))) {
    return null;
  }

  const matchedPair = find(pair => allCardsOfSameRankOrSuit(pair[1]), handsPairs);
  if (matchedPair) {
    return parseInt(matchedPair[0], 10);
  }

  return null;
};

export const deskToObj = (desk: Desk): { [id: number]: Cards } =>
  reduce(
    (acc, val) => {
      const [id, cards] = head(toPairs(val));
      return assoc(id, cards, acc);
    },
    {},
    desk,
  );
