import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import appReducer from './app/reducer';
import authReducer from './auth/reducer';
import growlReducer from './growl/reducer';
import SoTApi from 'services/SoTApi';

const initialState = {};

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  growl: growlReducer,
});

const middleware = [thunk];

var store = null;
let token = localStorage.getItem('token');

if (token) {
  SoTApi.setToken(token);
}

try {
  store = createStore(rootReducer, initialState, compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  ));
} catch (e) {
  store = createStore(rootReducer, initialState, applyMiddleware(...middleware));
}

export default store;