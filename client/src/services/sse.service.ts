import { store } from 'store'
import { gameFetchAllSuccess } from 'store/actions/games'
import { gamesService } from 'services/games.service'
import { getGameIdByLocation } from 'store/selectors/games'
import { IState } from 'store/states'
import { gameStateUpdate } from 'store/actions/gameState'
import { gameStateService } from 'services/gameState.service'
import { GameItem } from 'model/GameItem'
import { GameState } from 'model/GameState'

const pollingTimeout = 2000

export class SseService {
  private gamesTimer: number | null = null
  private gameTimer: number | null = null
  private sse: EventSource | null = null

  connect() {
    this.sse = new EventSource(`${process.env.REACT_APP_PROD_HOST}/api/subscribe`)
  }

  disconnect() {
    if (this.sse) this.sse.close()
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
      this.sse.addEventListener('list', this.onState)
    }
  }

  unsubscribeFromGame() {
    if (this.sse) {
      this.sse.removeEventListener('list', this.onState)
    }
  }

  onList = (event: any) => {
    store.dispatch(gameFetchAllSuccess(event.data as GameItem[]))
  }

  onState = (event: any) => {
    store.dispatch(gameStateUpdate(event.data as GameState))
  }

  // subscribeToGamesList() {
  //   const update = () => {
  //     gamesService.getList().then((games) => {
  //       store.dispatch(gameFetchAllSuccess(games))
  //     })
  //   }
  //
  //   update()
  //
  //   this.gamesTimer = setInterval(update, pollingTimeout)
  // }
  //
  // unsubscribeFromGamesList() {
  //   if (this.gamesTimer !== null) clearInterval(this.gamesTimer)
  // }
  //
  // subscribeToGame() {
  //   const gameId = parseInt(getGameIdByLocation(store.getState() as IState))
  //
  //   if (!gameId || isNaN(gameId)) {
  //     return
  //   }
  //
  //   const update = () => {
  //     gameStateService.getGameState(gameId).then((state) => {
  //       store.dispatch(gameStateUpdate(state))
  //     })
  //   }
  //
  //   update()
  //
  //   this.gameTimer = setInterval(update, pollingTimeout)
  // }
  //
  // unsubscribeFromGame() {
  //   if (this.gameTimer !== null) clearInterval(this.gameTimer)
  // }
}

export const sseService = new SseService()
