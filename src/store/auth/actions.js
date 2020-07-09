import SoTApi from 'services/SoTApi';

export const types = {
  AUTH_ERROR: 'AUTH_ERROR',
  AUTH_LOADING: 'AUTH_LOADING',
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  AUTH_VALID: 'AUTH_VALID',
  AUTH_VALIDATE: 'AUTH_VALIDATE',
  LOAD_USER: 'LOAD_USER',
  USER_LOADED: 'USER_LOADED',
  LOGOUT: 'LOGOUT',
};

const action = (type, payload = {}) => ({ type, payload });

const authActions = {
  login: credentials => {
    return dispatch => {
      dispatch(action(types.AUTH_LOADING));
      return SoTApi.login(credentials).then(data => {
        const { token, user } = data;
        dispatch(action(types.AUTH_SUCCESS, { token, user }));
        return data;
      })
      .catch(err => {
        dispatch(action(types.AUTH_ERROR));
        return err.response.data;
      });
    };
  },
  register: credentials => {
    return dispatch => {
      dispatch(action(types.AUTH_LOADING));
      return SoTApi.register(credentials).then(data => {
        const { token, user } = data;
        dispatch(action(types.AUTH_SUCCESS, { token, user }));
        return data;
      })
      .catch(err => {
        dispatch(action(types.AUTH_ERROR));
        return err.response.data;
      });
    };
  },
  validate: () => {
    return dispatch => {
      dispatch(action(types.AUTH_VALIDATE));
      let token = localStorage.getItem('token');
      SoTApi.setToken(token);
      return SoTApi.validate().then(data => {
        const { token, user } = data;
        dispatch(action(types.AUTH_VALID, { token: token || localStorage.getItem('token'), user }));
        return data;
      })
      .catch(err => {
        dispatch(action(types.AUTH_ERROR));
        return err.response.data;
      });
    }
  },
  logout: () => {
    return dispatch => {
      dispatch(action(types.LOGOUT));
      return {};
    };
  },
  loadUser: () => {
    return dispatch => {
      dispatch(action(types.LOAD_USER));
      return SoTApi.getUser().then(data => {
        const { user } = data;
        dispatch(action(types.USER_LOADED, { user }));
        return data;
      })
      .catch(err => {
        dispatch(action(types.AUTH_ERROR));
        return err.response;
      });
    }
  },
};

export default authActions;