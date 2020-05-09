import { Action } from 'model/Action'
import { GameStateHelpers } from 'helpers/gameStateHelpers'

export enum GameStateActionTypes {
  UPDATE = 'UPDATE',
}

export type GameStateUpdateAction = Action<GameStateActionTypes.UPDATE, GameStateHelpers>

export function gameStateUpdate(gameState: GameStateHelpers): GameStateUpdateAction {
  return {
    type: GameStateActionTypes.UPDATE,
    payload: gameState,
  }
}
