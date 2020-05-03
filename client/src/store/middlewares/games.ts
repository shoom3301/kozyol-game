import {call, put} from 'redux-saga/effects';
import {history} from 'router/router';
import {createGame, loadGame, loadGamesList} from 'helpers/games/gamesHttp';
import {
    GameCreateAction,
    gameCreateSuccess,
    gameCreateError,
    GameCreateFailAction,
    GamesActionTypes,
    GameFetchOneAction,
    gameFetchOneError,
    GameFetchOneFailAction,
    gameFetchOneSuccess,
    GameFetchAllFailAction, GameFetchAllAction, gameFetchAllSuccess, gameFetchAllError
} from 'store/actions/games';
import {takeLatest, takeEvery} from 'redux-saga/effects';
import {authorizationRoute} from 'router/routerPaths';

export function* gamesMiddleware() {
    yield takeLatest(GamesActionTypes.CREATE, gameCreation);
    yield takeEvery(GamesActionTypes.CREATED_FAIL, gameCreationFail);

    yield takeEvery(GamesActionTypes.FETCH_ONE, gameFetching);
    yield takeEvery(GamesActionTypes.FETCH_ONE_FAIL, gameFetchingFail);

    yield takeLatest(GamesActionTypes.FETCH_ALL, gamesFetching);
    yield takeEvery(GamesActionTypes.FETCH_ALL_FAIL, gamesFetchingFail);
}

export function* gameCreation(action: GameCreateAction) {
    try {
        const newGame = yield call(createGame, action.payload);

        yield put(gameCreateSuccess(newGame));
    } catch (error) {
        yield put(gameCreateError(error));
    }
}

export function gameCreationFail(action: GameCreateFailAction) {
    console.error('Game creation error: ', action.payload);
}

export function* gameFetching(action: GameFetchOneAction) {
    try {
        const game = yield call(loadGame, action.payload);

        yield put(gameFetchOneSuccess(game));
    } catch (error) {
        yield put(gameFetchOneError(error));
    }
}

export function gameFetchingFail(action: GameFetchOneFailAction) {
    console.error('Game fetching error: ', action.payload);
}

export function* gamesFetching(action: GameFetchAllAction) {
    try {
        const game = yield call(loadGamesList);

        yield put(gameFetchAllSuccess(game));
    } catch (error) {
        yield put(gameFetchAllError(error));
    }
}

export function gamesFetchingFail(action: GameFetchAllFailAction) {
    history.replace(authorizationRoute);
    console.error('Games fetching error: ', action.payload);
}
