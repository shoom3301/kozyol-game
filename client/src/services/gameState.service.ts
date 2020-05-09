import axios from 'axios'
import { GameState } from 'model/GameState'
import { authService } from 'services/auth.service'
import { apiUrl } from 'helpers/apiUrl'

export class GameStateService {
  getGameState(gameId: number): Promise<GameState> {
    return axios
      .get<GameState>(apiUrl(`/gameState/${gameId}`), { ...authService.withAuth() })
      .then((res) => res.data)
  }
}

export const gameStateService = new GameStateService()
