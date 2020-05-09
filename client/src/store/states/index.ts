import { RouterState } from 'connected-react-router'
import { GamesState } from 'store/states/games'
import { GameState } from 'model/GameState'

export interface IState {
  router: RouterState
  games: GamesState
  gameState: GameState
}
