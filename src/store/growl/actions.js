export const types = {
  GROWL_SET: 'GROWL_SET',
}

const action = (type, payload = {}) => ({ type, payload });

const growlActions = {
  setGrowl: el => {
    return dispatch => {
      dispatch(action(types.GROWL_SET, { el }));
      return {};
    };
  },
};

export default growlActions;