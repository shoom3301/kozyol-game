import { routerMiddleware } from 'connected-react-router';
import { applyMiddleware, compose, createStore } from 'redux';
import { reducers } from './reducers';
import { history } from 'router/router';

// @ts-ignore
const devToolsEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

const composeEnhancers = devToolsEnhancers || compose;

export const store = createStore(
  reducers,
  composeEnhancers(
    applyMiddleware(
      routerMiddleware(history)
    )
  )
);
