import { types } from './actions';

const initialState = {
  el: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case types.GROWL_SET:
      return { ...action.payload };
    default:
      return state;
  }
};