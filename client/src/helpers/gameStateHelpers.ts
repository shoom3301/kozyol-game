import { GameState, GameStateEnum } from 'model/GameState';
import { GameItem } from 'model/GameItem';

export class GameStateHelpers {
  constructor(
    public readonly gameItem: GameItem,
    public readonly gameState: GameState
  ) {
  }

  get isWaitingPlayers(): Boolean {
    return this.gameState.state === GameStateEnum.WAIT_PLAYERS
  }

  get isPlaying(): Boolean {
    return this.gameState.state === GameStateEnum.PLAY
  }

  get isEnded(): Boolean {
    return this.gameState.state === GameStateEnum.ENDED
  }

  get slotsState(): String {
    return `${this.gameState.players.length}/${this.gameItem.slotsCount}`
  }
}
