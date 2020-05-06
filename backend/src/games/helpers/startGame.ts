import { Game } from '../entities/game';
import { GameSet } from '../entities/set';

export const startGame = async (game: Game) => {
  const set = new GameSet();
  await set.initSet(game);
  await set.save();

  if (!game.sets) {
    game.sets = [];
  }
  game.sets.push(set);

  return game;
};
