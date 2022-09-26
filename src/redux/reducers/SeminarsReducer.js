import { ActionTypes } from '../action_types';

let initialState = {
    getSeminarsData: null,
    getSeminarsData_list: [],
    loading: false,
    
};

export const SeminarsReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.Get_Seminars:
            let getSeminarsData_list_copy = [];
            getSeminarsData_list_copy = [
                ...state.getSeminarsData_list,
                ...action.payload.data,
            ];
            state = {
                ...state,
                getSeminarsData: action.payload,
                getSeminarsData_list: getSeminarsData_list_copy,
            };
            break;
        case ActionTypes.Reset_Get_Seminars:
            state = {
                ...state,
                getSeminarsData: null,
                getSeminarsData_list: [],
            };
            break;

        default:
            break;
    }
    return state;
};
