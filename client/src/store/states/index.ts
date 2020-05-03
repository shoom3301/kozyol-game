import {RouterState} from 'connected-react-router';
import {GamesState} from 'store/states/games';

export interface IState {
    games: GamesState;
    router: RouterState;
}