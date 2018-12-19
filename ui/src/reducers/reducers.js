import {combineReducers} from 'redux';
import {handleAction} from 'redux-actions';
import {routerReducer} from 'react-router-redux';
import RequestReducer from './requestReducers';


// INITIAL_APP_STATE
const initialAppState = {
  appName: 'DSE Uptime UI',
};

const reducers = combineReducers({
  RequestReducer,
  app: handleAction(
      'UPDATE',
      (state, action) => ({
          ...state,
          [action.data.key] : action.data.value
      }),
      initialAppState
  ),
  interval: handleAction(
      'SET_INTERVAL',
      (state, action) => ({
          ...state,
          value : action.data
      }),null
  ),
  routing: routerReducer
});

export default reducers;
