import { ActionTypes } from '../action_types';

let initialState = {
    getNewsData: null,
    getNewsData_list: [],
    loading: false,
    
};

export const NewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.Get_News:
            let getNewsData_list_copy = [];
            getNewsData_list_copy = [
                ...state.getNewsData_list,
                ...action.payload.data,
            ];
            state = {
                ...state,
                getNewsData: action.payload,
                getNewsData_list: getNewsData_list_copy,
            };
            break;
        case ActionTypes.Reset_Get_News:
            state = {
                ...state,
                getNewsData: null,
                getNewsData_list: [],
            };
            break;

        default:
            break;
    }
    return state;
};
