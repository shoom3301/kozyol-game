import { GameState, GameStateEnum } from "model/GameState";

export class GameStateHelpers {
  constructor(public readonly gameState: GameState) {}

  get isWaitingPlayers(): boolean {
    return this.gameState.state === GameStateEnum.WAIT_PLAYERS;
  }

  get isWaitingConfirmations(): boolean {
    return [
      GameStateEnum.WAIT_CONFIRMATIONS_FOR_START_NEW_ROUND,
      GameStateEnum.WAIT_CONFIRMATIONS_FOR_START_NEW_SET,
    ].includes(this.gameState.state);
  }

  get isPlaying(): boolean {
    return [
      GameStateEnum.PLAY,
      GameStateEnum.WAIT_CONFIRMATIONS_FOR_START_NEW_ROUND,
      GameStateEnum.WAIT_CONFIRMATIONS_FOR_START_NEW_SET,
    ].includes(this.gameState.state);
  }

  get isEnded(): boolean {
    return this.gameState.state === GameStateEnum.ENDED;
  }

  get isMyTurn(): boolean {
    return (
      this.gameState.me === this.gameState.currentPlayerId &&
      !this.isWaitingConfirmations
    );
  }

  get slotsState(): string {
    return `${this.gameState.players.length}/${this.gameState.slotsCount}`;
  }
}
