export const types = {
  EXPAND: 'EXPAND',
  MINIMIZE: 'MINIMIZE',
};

const action = (type, payload = {}) => ({ type, payload });

const appActions = {
  expand: () => {
    return dispatch => dispatch(action(types.EXPAND));
  },
  minimize: () => {
    return dispatch => dispatch(action(types.MINIMIZE));
  },
};

export default appActions;