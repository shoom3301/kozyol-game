import axios from 'axios';
import { GameState } from 'model/GameState';
import { authService } from 'services/auth.service';
import { getGameIdByLocation } from 'store/selectors/games';
import { store } from 'store';
import { IState } from 'store/states';
import { gameStateUpdate } from 'store/actions/gameState';
import { GameStateHelpers } from 'helpers/gameStateHelpers';

export class GameStateService {
  getGameState(gameId: number): Promise<GameState> {
    return axios.get<GameState>(`/api/gameState/${gameId}`, {...authService.withAuth()})
      .then(res => res.data)
  }

  fetch() {
    const gameId = parseInt(getGameIdByLocation(store.getState() as IState))

    if (!gameId || isNaN(gameId)) {
      return
    }

    this.getGameState(gameId).then(state => {
      store.dispatch(gameStateUpdate(new GameStateHelpers(state)))
    })
  }
}

export const gameStateService = new GameStateService()
