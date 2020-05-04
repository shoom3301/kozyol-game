import { IState } from '../states';
import { createMatchSelector } from 'connected-react-router';
import { gameRoute } from 'router/routerPaths';
import { createSelector } from 'reselect';
import { GameItem } from 'model/GameItem';

export const getGamesList = ({ games }: IState): GameItem[] => games.games;

export const getGameIdMatch = createMatchSelector<IState, { gameId: string }>(
  gameRoute()
);

export const getGameIdByLocation = createSelector(getGameIdMatch, match => {
  if (!match) {
    return '';
  }

  return match.params['gameId'];
});
