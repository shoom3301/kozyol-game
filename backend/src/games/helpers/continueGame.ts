import { startNextRound } from '../../games/entities/round.utils';
import { Game } from '../entities/game';
import { GameSet } from '../entities/set';

export const continueGame = async (gameId: number) => {
  const game = await Game.findOne({ where: { id: gameId } });
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
      game.initWaitingConfirmationsForContinue();
      await game.save();
    } else {
      // start new round only when deck is not empty or hands is not empty
      const { newRound, updatedDeck } = startNextRound(round, set.deck);
      set.rounds.push(newRound);
      set.deck = updatedDeck;
      await set.save();
    }
  }
};
