import { ActionTypes } from '../action_types';

const initialState = {
  loading: false,
};

export const GeneralReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.ShowLoading:
      state = { loading: true };
      break;
    case ActionTypes.HideLoading:
      state = { loading: false };
      break;
    default:
      break;
  }
  return state;
};
