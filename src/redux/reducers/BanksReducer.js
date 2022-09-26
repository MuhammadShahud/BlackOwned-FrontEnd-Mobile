import { ActionTypes } from '../action_types';

let initialState = {
    getBanksData: null,
    getBanksData_list: [],
    loading: false,
    
};

export const BanksReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.Get_Banks:
            let getBanksData_list_copy = [];
            getBanksData_list_copy = [
                ...state.getBanksData_list,
                ...action.payload.data,
            ];
            state = {
                ...state,
                getBanksData: action.payload,
                getBanksData_list: getBanksData_list_copy,
            };
            break;
        case ActionTypes.Reset_Get_Banks:
            state = {
                ...state,
                getBanksData: null,
                getBanksData_list: [],
            };
            break;

        default:
            break;
    }
    return state;
};
