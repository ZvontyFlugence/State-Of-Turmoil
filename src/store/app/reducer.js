import { types } from './actions';

const initialState = {
  sidebarExpanded: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case types.EXPAND:
      return { sidebarExpanded: true };
    case types.MINIMIZE:
      return { sidebarExpanded: false };
    default:
      return state;
  }
}