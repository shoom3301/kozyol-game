import { Game } from 'src/games/entities/game';
import { GameState, GameStateEnum } from './types';
import { last } from 'ramda';

// TODO: extract to helpers
export const getWaitState = (game: Game): GameState => ({
  id: game.id,
  state: GameStateEnum.WAIT_PLAYERS,
  trump: '',
  myScore: 0,
  gameScore: game.players.reduce((acc, item) => {
    acc[item.id] = 0;
    return acc;
  }, {}),
  cardsOnTable: game.players.reduce((acc, item) => {
    acc[item.id] = [];
    return acc;
  }, {}),
  players: game.players.map(player => ({ id: player.id, name: player.login, order: 0 })),
  myCards: [],
});

// TODO: implement
export const getEndedState = (game: Game): GameState => this.getWaitState(game);

// export const getPlayState = (game: Game): GameState => {
//   const currentSet = last(game.sets);
// };
