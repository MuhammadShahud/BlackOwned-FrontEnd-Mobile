import { ActionTypes } from '../action_types';

let initialState = {
    getLisetdCompaniesData: null,
    getLisetdCompaniesData_list: [],
    loading: false,
    
};

export const ListedCompaniesReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.Get_ListedCompanies:
            let getLisetdCompaniesData_list_copy = [];
            getLisetdCompaniesData_list_copy = [
                ...state.getLisetdCompaniesData_list,
                ...action.payload.data,
            ];
            state = {
                ...state,
                getLisetdCompaniesData: action.payload,
                getLisetdCompaniesData_list: getLisetdCompaniesData_list_copy,
            };
            break;
        case ActionTypes.Reset_Get_ListedCompanies:
            state = {
                ...state,
                getLisetdCompaniesData: null,
                getLisetdCompaniesData_list: [],
            };
            break;

        default:
            break;
    }
    return state;
};
