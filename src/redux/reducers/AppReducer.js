import { TabActions } from '@react-navigation/native';
import { ActionTypes } from '../action_types';

const initialState = {
    user: null,
    countriesData: [],
    cityData: [],
    statesData: [],
    darkmode: false,

};

export const AppReducer = (state = initialState, action) => {

    // console.warn("Auth Reducer Dark Mode==", initialState.darkmode);
    switch (action.type) {
        case ActionTypes.GET_COUNTRIES:
            state = { ...state, countriesData: action.payload };
            break;
        case ActionTypes.DARK_MODE:
            state = { darkmode: true };
            break;
        case ActionTypes.LIGHT_MODE:
            state = { darkmode: false };
            break;


        default:
            break;
    }
    return state;
};
