import { ActionTypes } from '../action_types';

let initialState = {
    getServicesData: null,
    getServicesData_list: [],
    loading: false,
    storeServiceData: [],
    storeServiceData: [],
    getProvidersData: null,
    getProvidersData_list: [],
    // getServicesByIdData: null,
    getServicesByIdData: [],
    // getServicesByIdData_list: [],
};

export const ServicesReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.Customer_Services:
            let getServicesData_list_copy = [];
            getServicesData_list_copy = [
                ...state.getServicesData_list,
                ...action.payload.data,
            ];
            state = {
                ...state,
                getServicesData: action.payload,
                getServicesData_list: getServicesData_list_copy,
            };
            break;
        case ActionTypes.Reset_Customer_Services:
            state = {
                ...state,
                getServicesData: null,
                getServicesData_list: [],
            };
            break;

        case ActionTypes.Store_Service:
            state = { ...state, storeServiceData: action.payload };
            break;

        case ActionTypes.Remove_Service:
            state = { ...state, removeServiceData: action.payload };
            break;

        case ActionTypes.Providers_Services:
            let getProvidersData_list_copy = [];
            getProvidersData_list_copy = [
                ...state.getProvidersData_list,
                ...action.payload.data,
            ];
            state = {
                ...state,
                getProvidersData: action.payload,
                getProvidersData_list: getProvidersData_list_copy,
            };
            break;
        case ActionTypes.Reset_Providers_Services:
            state = {
                ...state,
                getProvidersData: null,
                getProvidersData_list: [],
            };
            break;

        // case ActionTypes.Services_ById:
        //     let getServicesByIdData_list_copy = [];
        //     getServicesByIdData_list_copy = [
        //         ...state.getServicesByIdData_list,
        //         ...action.payload.data,
        //     ];
        //     state = {
        //         ...state,
        //         getServicesByIdData: action.payload,
        //         getServicesByIdData_list: getServicesByIdData_list_copy,
        //     };
        //     break;
        case ActionTypes.Services_ById:
            state = { ...state, getServicesByIdData: action.payload };
            break;

        default:
            break;
    }
    return state;
};
