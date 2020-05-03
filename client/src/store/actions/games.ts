import {Action} from 'model/Action';
import {GameBlank} from 'model/GameBlank';
import {Game} from 'model/Game';

export enum GamesActionTypes {
    CREATE = 'CREATE',
    CREATED_SUCCESS = 'CREATED_SUCCESS',
    CREATED_FAIL = 'CREATED_FAIL',
    FETCH_ONE = 'FETCH_ONE',
    FETCH_ONE_SUCCESS = 'FETCH_ONE_SUCCESS',
    FETCH_ONE_FAIL = 'FETCH_ONE_FAIL',
    FETCH_ALL = 'FETCH_ALL',
    FETCH_ALL_SUCCESS = 'FETCH_ALL_SUCCESS',
    FETCH_ALL_FAIL = 'FETCH_ALL_FAIL',
}

export type GameCreateAction = Action<GamesActionTypes.CREATE, GameBlank>;
export type GameCreateSuccessAction = Action<GamesActionTypes.CREATED_SUCCESS, Game>;
export type GameCreateFailAction = Action<GamesActionTypes.CREATED_FAIL, Error>;

export type GameFetchOneAction = Action<GamesActionTypes.FETCH_ONE, string>;
export type GameFetchOneSuccessAction = Action<GamesActionTypes.FETCH_ONE_SUCCESS, Game>;
export type GameFetchOneFailAction = Action<GamesActionTypes.FETCH_ONE_FAIL, Error>;

export type GameFetchAllAction = Action<GamesActionTypes.FETCH_ALL>;
export type GameFetchAllSuccessAction = Action<GamesActionTypes.FETCH_ALL_SUCCESS, Game[]>;
export type GameFetchAllFailAction = Action<GamesActionTypes.FETCH_ALL_FAIL, Error>;

export function gameCreate(game: GameBlank): GameCreateAction {
    return {
        type: GamesActionTypes.CREATE,
        payload: game
    };
}

export function gameCreateSuccess(game: Game): GameCreateSuccessAction {
    return {
        type: GamesActionTypes.CREATED_SUCCESS,
        payload: game
    };
}

export function gameCreateError(error: Error): GameCreateFailAction {
    return {
        type: GamesActionTypes.CREATED_FAIL,
        payload: error
    };
}

export function gameFetchOne(gameId: string): GameFetchOneAction {
    return {
        type: GamesActionTypes.FETCH_ONE,
        payload: gameId
    };
}

export function gameFetchOneSuccess(game: Game): GameFetchOneSuccessAction {
    return {
        type: GamesActionTypes.FETCH_ONE_SUCCESS,
        payload: game
    };
}

export function gameFetchOneError(error: Error): GameFetchOneFailAction {
    return {
        type: GamesActionTypes.FETCH_ONE_FAIL,
        payload: error
    };
}

export function gameFetchAll(): GameFetchAllAction {
    return {
        type: GamesActionTypes.FETCH_ALL,
        payload: undefined
    };
}

export function gameFetchAllSuccess(games: Game[]): GameFetchAllSuccessAction {
    return {
        type: GamesActionTypes.FETCH_ALL_SUCCESS,
        payload: games
    };
}

export function gameFetchAllError(error: Error): GameFetchAllFailAction {
    return {
        type: GamesActionTypes.FETCH_ALL_FAIL,
        payload: error
    };
}
