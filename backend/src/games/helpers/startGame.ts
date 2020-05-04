import { Game } from '../entities/game';
import { Set } from '../entities/set';

export const startGame = (game: Game): Game => {
  const set = new Set();
  set.initSet(game);

  if (!game.sets) {
    game.sets = [];
  }
  game.sets.push(set);

  return game;
};
