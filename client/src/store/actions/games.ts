import { Action } from 'model/Action'
import { GameItem } from 'model/GameItem'

export enum GamesActionTypes {
  FETCH_ALL_SUCCESS = 'FETCH_ALL_SUCCESS',
}

export type GameFetchAllSuccessAction = Action<GamesActionTypes.FETCH_ALL_SUCCESS, GameItem[]>

export function gameFetchAllSuccess(games: GameItem[]): GameFetchAllSuccessAction {
  return {
    type: GamesActionTypes.FETCH_ALL_SUCCESS,
    payload: games,
  }
}
