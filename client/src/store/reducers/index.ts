import { combineReducers } from 'redux';
import { router } from 'router/router';
import { gamesReducer } from 'store/reducers/games';
import { gameStateReducer } from 'store/reducers/gameState';

export const reducers = combineReducers({
  router,
  games: gamesReducer,
  gameState: gameStateReducer
});
