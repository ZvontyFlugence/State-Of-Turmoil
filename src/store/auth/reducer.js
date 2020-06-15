import { types } from './actions';
import SoTApi from 'services/SoTApi';

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
};

export default function (state = initialState, action) {
  if (action.payload && action.payload.hasOwnProperty('token')) {
    localStorage.setItem('token', action.payload.token);
    SoTApi.setToken(action.payload.token);
  }

  switch (action.type) {
    case types.AUTH_LOADING:
    case types.AUTH_VALIDATE:
    case types.LOAD_USER:
      return {
        ...state,
        isLoading: true,
      }
    case types.AUTH_SUCCESS:
    case types.AUTH_VALID:
    case types.USER_LOADED:
      const { user } = action.payload;
      return {
        isAuthenticated: true,
        isLoading: false,
        user
      }
    case types.AUTH_ERROR:
    case types.LOGOUT:
      localStorage.removeItem('token');
      return initialState;
    default:
      return state;
  }
};