import { Game } from '../games/entities/game';
import { Cards } from '../games/cards/types';
import { without } from 'ramda';

export const processStep = async (game: Game, cards: Cards, userId: number) => {
  return;

  const set = await game.playingSet();
  const round = set.currentRound();

  // TODO: check that step is allowed
  let isValSame = false;
  let isSuitSame = false;
  cards.reduce((prevCard, card) => {
    isValSame = prevCard[1] === card[1];
    isSuitSame = prevCard[0] === card[0];
    return card;
  }, cards[0]);

  if (round.desk.length === 0) {
    round.desk.push({ [userId]: cards });
    round.hands[userId] = without(cards, round.hands[userId]);

    console.log({ cards, hand: round.hands[userId] });
  }
};
