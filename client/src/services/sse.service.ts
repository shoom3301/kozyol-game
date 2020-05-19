import { store } from 'store'
import { history } from 'router/router'
import { gameFetchAllSuccess } from 'store/actions/games'
import { getGameIdByLocation } from 'store/selectors/games'
import { IState } from 'store/states'
import { gameStateUpdate } from 'store/actions/gameState'
import { GameItem } from 'model/GameItem'
import { GameState } from 'model/GameState'
import { authorizationRoute } from 'router/routerPaths'

export class SseService {
  private onList = (event: any) => {
    store.dispatch(gameFetchAllSuccess(JSON.parse(event.data) as GameItem[]))
  }

  private onState = (event: any) => {
    const gameId = parseInt(getGameIdByLocation(store.getState() as IState))
    const state = JSON.parse(event.data) as GameState

    if (state.id !== gameId) return

    store.dispatch(gameStateUpdate(state))
  }

  private onError = () => {
    history.replace(authorizationRoute)
  }

  private listManager = new SSEConnectionManager('list', this.onList, this.onError)
  private gameManager = new SSEConnectionManager('state', this.onState, this.onError)

  subscribeToGamesList() {
    this.listManager.connect('/list')
  }

  unsubscribeFromGamesList() {
    this.listManager.disconnect()
  }

  subscribeToGame(gameId: number) {
    this.gameManager.connect(`/game/${gameId}`)
  }

  unsubscribeFromGame() {
    this.gameManager.disconnect()
  }
}

class SSEConnectionManager {
  private connection: EventSource | null = null

  constructor(
    private eventName: string,
    private callback: (event: any) => void,
    private onError?: (event: any) => void
  ) {
  }

  connect(path: string) {
    if (this.connection) {
      this.connection.close()
    }

    this.connection = new EventSource(
      `/api/subscribe${path}`,
      { withCredentials: true }
    )

    this.connection.addEventListener(this.eventName, this.callback)
    this.connection.onmessage = console.log

    if (this.onError) this.connection.onerror = this.onError
  }

  disconnect() {
    if (this.connection) {
      this.connection.removeEventListener(this.eventName, this.callback)
      this.connection.close()
    }
  }
}

export const sseService = new SseService()
