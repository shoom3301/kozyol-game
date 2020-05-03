import {Action} from 'model/Action';
import {GameFetchOneSuccessAction, GamesActionTypes} from 'store/actions/games';
import {defaultGamesState, GamesState} from 'store/states/games';

export function gamesReducer(state = defaultGamesState, action: Action<GamesActionTypes>): GamesState {
    switch (action.type) {
        case GamesActionTypes.FETCH_ALL_SUCCESS: {
            return [...action.payload];
        }

        case GamesActionTypes.CREATED_SUCCESS: {
            return [...state, action.payload];
        }

        case GamesActionTypes.FETCH_ONE_SUCCESS: {
            const game = (action as GameFetchOneSuccessAction).payload;
            const existing = state.find(({id}) => id === game.id);

            return existing
                ? state
                : [...state, game];
        }

        default:
            return state;
    }
}