import { Action } from 'model/Action'
import { GameState } from 'model/GameState'

export enum GameStateActionTypes {
  UPDATE = 'UPDATE',
}

export type GameStateUpdateAction = Action<GameStateActionTypes.UPDATE, GameState>

export function gameStateUpdate(gameState: GameState): GameStateUpdateAction {
  return {
    type: GameStateActionTypes.UPDATE,
    payload: gameState,
  }
}
