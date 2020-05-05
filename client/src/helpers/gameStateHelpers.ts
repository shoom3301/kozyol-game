import { GameState, GameStateEnum } from 'model/GameState';

export class GameStateHelpers {
  constructor(
    public readonly gameState: GameState
  ) {
  }

  get isWaitingPlayers(): boolean {
    return this.gameState.state === GameStateEnum.WAIT_PLAYERS
  }

  get isPlaying(): boolean {
    return this.gameState.state === GameStateEnum.PLAY
  }

  get isEnded(): boolean {
    return this.gameState.state === GameStateEnum.ENDED
  }

  get isMyTurn(): boolean {
    return this.gameState.me === this.gameState.currentPlayerId
  }

  get slotsState(): string {
    return `${this.gameState.players.length}/${this.gameState.slotsCount}`
  }
}
