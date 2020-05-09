import { Action } from 'model/Action'
import { defaultGameStateState } from 'store/states/gameState'
import { GameStateActionTypes } from 'store/actions/gameState'
import { GameStateHelpers } from 'helpers/gameStateHelpers'

export function gameStateReducer(
  state = defaultGameStateState,
  action: Action<GameStateActionTypes>,
): GameStateHelpers | null {
  switch (action.type) {
    case GameStateActionTypes.UPDATE: {
      return action.payload
    }

    default:
      return state
  }
}
