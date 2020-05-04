import { RouterState } from 'connected-react-router';
import { GamesState } from 'store/states/games';
import { GameStateHelpers } from 'helpers/gameStateHelpers';

export interface IState {
  router: RouterState;
  games: GamesState;
  gameState: GameStateHelpers;
}
