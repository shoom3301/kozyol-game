import { Action } from 'model/Action'
import { defaultGameStateState } from 'store/states/gameState'
import { GameStateActionTypes } from 'store/actions/gameState'
import { GameState } from 'model/GameState'

export function gameStateReducer(
  state = defaultGameStateState,
  action: Action<GameStateActionTypes>,
): GameState {
  switch (action.type) {
    case GameStateActionTypes.UPDATE: {
      return action.payload
    }

    default:
      return state
  }
}
