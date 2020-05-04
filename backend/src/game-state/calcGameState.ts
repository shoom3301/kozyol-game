import { Game } from 'src/games/entities/game';
import { GameState } from './types';
import { getWaitState, getEndedState, getPlayState } from './stateFromGame';

export const calcGameState = async (game: Game, userId: number): Promise<GameState> => {
  if (!game.sets || game.sets.length === 0) {
    return Promise.resolve(getWaitState(game, userId));
  }

  if (game.isFinished()) {
    return Promise.resolve(getEndedState(game, userId));
  }

  return getPlayState(game, userId);
};
