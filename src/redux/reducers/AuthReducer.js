import { TabActions } from '@react-navigation/native';
import { ActionTypes } from '../action_types';

const initialState = {
  user: null,
  is_logged_in: false,
  mailData: [],
  resetPasswordData: [],
  loading: false,
  onlineUsersData: [],
};

export const AuthReducer = (state = initialState, action) => {

  // console.warn("Auth Reducer ==", action.type);
  switch (action.type) {
    case ActionTypes.Register:
      state = { user: action.payload, is_logged_in: true };
      break;
    case ActionTypes.Login:
      // console.warn("LOGIN REDUCER===================>", action.payload);
      state = { user: action.payload, is_logged_in: true };
      break;
    case ActionTypes.Logout:
      state = { user: null, is_logged_in: false };
      break;
    case ActionTypes.Update_Profile:
      state = { ...state, user: { ...state.user, user: action.payload }, is_logged_in: true };
      break;
    case ActionTypes.SendMail:
      state = { ...state, mailData: action.payload };
      break;
    case ActionTypes.OnlineUsers:
      state = { ...state, onlineUsersData: action.payload };
      break;
    case ActionTypes.ResetPassword:
      state = { ...state, resetPasswordData: action.payload };
      break;
    default:
      break;
  }
  return state;
};
