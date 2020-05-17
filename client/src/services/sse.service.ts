import { store } from 'store'
import { gameFetchAllSuccess } from 'store/actions/games'
import { getGameIdByLocation } from 'store/selectors/games'
import { IState } from 'store/states'
import { gameStateUpdate } from 'store/actions/gameState'
import { GameItem } from 'model/GameItem'
import { GameState } from 'model/GameState'

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

  private listManager = new SSEConnectionManager('list', this.onList)
  private gameManager = new SSEConnectionManager('state', this.onState)

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
    private callback: (event: any) => void
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

    this.connection.addEventListener('list', this.callback)
  }

  disconnect() {
    if (this.connection) {
      this.connection.removeEventListener('list', this.callback)
      this.connection.close()
    }
  }
}

export const sseService = new SseService()
