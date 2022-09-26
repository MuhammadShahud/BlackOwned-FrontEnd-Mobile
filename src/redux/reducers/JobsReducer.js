import { ActionTypes } from '../action_types';

let initialState = {
    getUserJobsData: null,
    getUserJobsData_list: [],

    postJobData: [],
    getEnrollServiceData: null,
    getEnrollServiceData_list: [],
    loading: false,

};

export const JobsReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.Get_UserJobs:
            let getUserJobsData_list_copy = [];
            getUserJobsData_list_copy = [
                ...state.getUserJobsData_list,
                ...action.payload.data,
            ];
            state = {
                ...state,
                getUserJobsData: action.payload,
                getUserJobsData_list: getUserJobsData_list_copy,
            };
            break;
        case ActionTypes.Reset_Get_UserJobs:
            state = {
                ...state,
                getUserJobsData: null,
                getUserJobsData_list: [],
            };
            break;

        case ActionTypes.Post_Job:
            state = { ...state, postJobData: action.payload };
            break;

        case ActionTypes.Get_EnrollServiceJobs:
            let getEnrollServiceData_list_copy = [];
            getEnrollServiceData_list_copy = [
                ...state.getEnrollServiceData_list,
                ...action.payload.data,
            ];
            state = {
                ...state,
                getEnrollServiceData: action.payload,
                getEnrollServiceData_list: getEnrollServiceData_list_copy,
            };
            break;
        case ActionTypes.Reset_Get_EnrollServiceJobs:
            state = {
                ...state,
                getEnrollServiceData: null,
                getEnrollServiceData_list: [],
            };
            break;

        default:
            break;
    }
    return state;
};
