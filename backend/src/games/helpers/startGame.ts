import { Game } from '../entities/game';
import { Set } from '../entities/set';

export const startGame = async (game: Game) => {
  const set = new Set();
  await set.initSet(game);

  if (!game.sets) {
    game.sets = [];
  }
  game.sets.push(set);

  return game;
};
