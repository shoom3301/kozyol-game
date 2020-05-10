import { store } from 'store'
import { gameFetchAllSuccess } from 'store/actions/games'
import { getGameIdByLocation } from 'store/selectors/games'
import { IState } from 'store/states'
import { gameStateUpdate } from 'store/actions/gameState'
import { GameItem } from 'model/GameItem'
import { GameState } from 'model/GameState'
import { authService } from 'services/auth.service'

export class SseService {
  private sse: EventSource | null = null

  connect() {
    if (this.sse) {
      return
    }

    this.sse = new EventSource(
      `${process.env.REACT_APP_PROD_HOST}/api/subscribe?token=${authService.getToken()}`,
    )
  }

  disconnect() {
    if (this.sse) {
      this.sse.close()
      this.sse = null
    }
  }

  subscribeToGamesList() {
    if (this.sse) {
      this.sse.addEventListener('list', this.onList)
    }
  }

  unsubscribeFromGamesList() {
    if (this.sse) {
      this.sse.removeEventListener('list', this.onList)
    }
  }

  subscribeToGame() {
    if (this.sse) {
      this.sse.addEventListener('state', this.onState)
    }
  }

  unsubscribeFromGame() {
    if (this.sse) {
      this.sse.removeEventListener('state', this.onState)
    }
  }

  onList = (event: any) => {
    store.dispatch(gameFetchAllSuccess(JSON.parse(event.data) as GameItem[]))
  }

  onState = (event: any) => {
    const gameId = parseInt(getGameIdByLocation(store.getState() as IState))
    const state = JSON.parse(event.data) as GameState

    if (state.id !== gameId) return

    store.dispatch(gameStateUpdate(state))
  }
}

export const sseService = new SseService()
