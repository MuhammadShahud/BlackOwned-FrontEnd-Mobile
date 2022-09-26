import { ActionTypes } from '../action_types';

const initialState = {
  PaymentCards: [],
  isBookingConfirm: false,
};

const PaymentReducer = (state = initialState, action) => {
  // console.warn("Reducer", action.payload);
  switch (action.type) {
    case ActionTypes.GET_PAYMENT_CARDS:
      state = { ...state, PaymentCards: action.payload };
      break;

    case ActionTypes.ADD_PAYMENT_CARD:
      state = { ...state, PaymentCards: [...state.PaymentCards, action.payload] };
      console.warn("STATE REDUCER: ", state);
      break;

    default:
      break;
  }

  return state;
};

export default PaymentReducer;
