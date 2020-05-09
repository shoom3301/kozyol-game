import { store } from 'store'
import { gameFetchAllSuccess } from 'store/actions/games'
import { gamesService } from 'services/games.service'
import { getGameIdByLocation } from 'store/selectors/games'
import { IState } from 'store/states'
import { gameStateUpdate } from 'store/actions/gameState'
import { gameStateService } from 'services/gameState.service'

const pollingTimeout = 2000

export class SseService {
  private gamesTimer: number | null = null
  private gameTimer: number | null = null

  connect() {
    // TODO
  }

  disconnect() {
    // TODO
  }

  subscribeToGamesList() {
    const update = () => {
      gamesService.getList().then((games) => {
        store.dispatch(gameFetchAllSuccess(games))
      })
    }

    update()

    this.gamesTimer = setInterval(update, pollingTimeout)
  }

  unsubscribeFromGamesList() {
    if (this.gamesTimer !== null) clearInterval(this.gamesTimer)
  }

  subscribeToGame() {
    const gameId = parseInt(getGameIdByLocation(store.getState() as IState))

    if (!gameId || isNaN(gameId)) {
      return
    }

    const update = () => {
      gameStateService.getGameState(gameId).then((state) => {
        store.dispatch(gameStateUpdate(state))
      })
    }

    update()

    this.gameTimer = setInterval(update, pollingTimeout)
  }

  unsubscribeFromGame() {
    if (this.gameTimer !== null) clearInterval(this.gameTimer)
  }
}

export const sseService = new SseService()
