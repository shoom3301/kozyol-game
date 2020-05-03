import {IState} from '../states';
import {createMatchSelector} from 'connected-react-router';
import {gameRoute} from 'router/routerPaths';
import {createSelector} from 'reselect';
import {GamesState} from 'store/states/games';

export const getGamesList = ({games}: IState): GamesState => games;

export const getGameIdMatch = createMatchSelector<IState, { gameId: string }>(
    gameRoute()
);

export const getGameIdByLocation = createSelector(getGameIdMatch, match => {
    if (!match) {
        return '';
    }

    return match.params['gameId'];
});
