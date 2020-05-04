import { IState } from '../states';
import { createMatchSelector } from 'connected-react-router';
import { gameRoute } from 'router/routerPaths';
import { createSelector } from 'reselect';
import { store } from 'store/index';

export const getGamesList = () => store.getState().games.games;

export const getGameIdMatch = createMatchSelector<IState, { gameId: string }>(
  gameRoute()
);

export const getGameIdByLocation = createSelector(getGameIdMatch, match => {
  if (!match) {
    return '';
  }

  return match.params['gameId'];
});
