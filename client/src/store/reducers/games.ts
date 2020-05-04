import { defaultGamesState, GamesState } from 'store/states/games';
import { GamesActionTypes } from 'store/actions/games';
import { Action } from 'model/Action';

export function gamesReducer(state = defaultGamesState, action: Action<GamesActionTypes>): GamesState {
  switch (action.type) {
    case GamesActionTypes.FETCH_ALL_SUCCESS: {
      return { games: action.payload };
    }

    default:
      return state;
  }
}
