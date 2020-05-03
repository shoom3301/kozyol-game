import createSagaMiddleware from 'redux-saga';
import {gamesMiddleware} from 'store/middlewares/games';

export const sagaMiddleware = createSagaMiddleware();

export function runSaga() {
    sagaMiddleware.run(appMiddleware);
}

function* appMiddleware() {
    yield gamesMiddleware();
}
