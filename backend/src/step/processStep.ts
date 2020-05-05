import { Game } from '../games/entities/game';
import { Cards } from '../games/cards/types';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Round } from '../games/entities/round';
import { Set } from '../games/entities/set';
import { allCardsOfSameRankOrSuit } from 'src/games/cards/comparisons';

export const processStep = async (game: Game, cards: Cards, userId: number): Promise<Set> => {
  const set = await game.playingSet();
  const round = await set.currentRound();

  // first step && more than 1 card
  if (round.isDeskEmpty && cards.length > 1) {
    if (!allCardsOfSameRankOrSuit(cards)) {
      throw new HttpException(
        'This cards now allowed for first step',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  await round.pushToDesk(cards, userId);
  await round.save();
  //await set.save(); // update deck. so ugly
  await set.reload();

  if (round.isFinished()) {
    if (!round.isHandsEmpty()) {
      const newRound = new Round();
      newRound.prevRoundId = round.id;
      newRound.hands = round.hands;
      await newRound.initRound(set);
      set.rounds.push(newRound);
      await set.save();
    } else {
      set.calcScores();
      await set.save();
    }
  }

  return set;
};
