import {createStore, applyMiddleware, compose} from 'redux';

import window from 'global/window';
import {taskMiddleware} from 'react-palm';
import {routerMiddleware} from 'react-router-redux';
import thunkMiddleware from 'redux-thunk'
import {hashHistory} from 'react-router';
import reducers from './reducers/reducers';

export const middlewares = [
    taskMiddleware,
    routerMiddleware(hashHistory),
    thunkMiddleware
];

export const enhancers = [applyMiddleware(...middlewares)];

var initialState = {
    NavigationReducer: {
        drawerOpen: false,
        page: "Multi-Cloud Demonstration"
    }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(
    reducers,
    initialState,
    composeEnhancers(...enhancers)
);
