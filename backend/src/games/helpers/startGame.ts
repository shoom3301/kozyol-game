import { Game } from '../entities/game';

export const startGame = (game: Game): Promise<Game> => {
  return Promise.resolve(game);
};
