import { startNextRound } from '../../games/entities/round.utils';
import { Game } from '../entities/game';
import { GameSet } from '../entities/set';
import { createAwaitedConfirmation, confirmContinueForAll } from './createAwaitedConfirmation';
import { SchedulerRegistry } from '@nestjs/schedule';
import { deleteTimeoutForGame, getTimeoutNameForGame } from './timeoutHelpers';
import { broadcastGameState } from 'src/subscribe/subscribe.controller';

export const continueGame = async (gameId: number, schedulerRegistry: SchedulerRegistry) => {
  const game = await Game.findOne({ where: { id: gameId }, relations: ['players'] });
  const set = await game.lastSet();
  const round = await set.lastRound();
  round.set = set;

  if (set.finished) {
    const newSet = new GameSet();
    await newSet.initSet(game);
    await newSet.save();
  } else if (round.isFinished()) {
    // check that all cards was played (set is over)
    if (round.isHandsEmpty() && set.deck.length === 0) {
      set.calcScores();
      await set.save();
      await Promise.all(game.players.map(player => createAwaitedConfirmation(game.id, player.id)));
      deleteTimeoutForGame(gameId, schedulerRegistry);
      schedulerRegistry.addTimeout(
        getTimeoutNameForGame(game.id),
        setTimeout(async () => {
          await confirmContinueForAll(game.id);
          await broadcastGameState(game.id);
        }, 10000),
      );
    } else {
      // start new round only when deck is not empty or hands is not empty
      const { newRound, updatedDeck } = startNextRound(round, set.deck);
      set.rounds.push(newRound);
      set.deck = updatedDeck;
      await set.save();
    }
  }
};
