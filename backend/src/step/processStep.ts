import { Game } from '../games/entities/game';
import { Cards } from '../games/cards/types';
import { HttpException, HttpStatus } from '@nestjs/common';
import { allCardsOfSameRankOrSuit } from 'src/games/cards/comparisons';
import { map, prop } from 'ramda';

const CARDS_NOT_ALLOWED_FOR_FIRST_STEP = new HttpException(
  'This cards now allowed for first step',
  HttpStatus.UNPROCESSABLE_ENTITY,
);

export const processStep = async (game: Game, cards: Cards, userId: number) => {
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
  await game.reload();

  if (round.isFinished()) {
    game.initWaitingConfirmationsForContinue();
    await game.save();
  }
};
