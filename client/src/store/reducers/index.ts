import { combineReducers } from 'redux';
import { router } from 'router/router';
import { gamesReducer } from 'store/reducers/games';

export const reducers = combineReducers({
  router,
  games: gamesReducer
});
