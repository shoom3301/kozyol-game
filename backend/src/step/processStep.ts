import { Game } from '../games/entities/game';
import { Cards } from '../games/cards/types';
import { HttpException, HttpStatus } from '@nestjs/common';
import { GameSet } from '../games/entities/set';
import { allCardsOfSameRankOrSuit } from 'src/games/cards/comparisons';
import { startNextRound } from 'src/games/entities/round.utils';
import { map, prop } from 'ramda';

const CARDS_NOT_ALLOWED_FOR_FIRST_STEP = new HttpException(
  'This cards now allowed for first step',
  HttpStatus.UNPROCESSABLE_ENTITY,
);

export const processStep = async (game: Game, cards: Cards, userId: number): Promise<GameSet> => {
  const set = await game.playingSet();
  const round = await set.currentRound();

  // first step && more than 1 card
  if (round.isDeskEmpty && cards.length > 1) {
    if (!allCardsOfSameRankOrSuit(cards)) {
      throw CARDS_NOT_ALLOWED_FOR_FIRST_STEP;
    }
  }

  await round.pushToDesk(cards, userId, map(prop('id'), game.players));
  await round.save();
  await set.reload(); // for having actual round

  if (round.isFinished()) {
    // check that all cards was played
    if (!round.isHandsEmpty() || set.deck.length > 0) {
      const { newRound, updatedDeck } = startNextRound(round, set.deck);
      set.rounds.push(newRound);
      set.deck = updatedDeck;
    } else {
      set.calcScores();
    }
  }

  await set.save();
  return set;
};
