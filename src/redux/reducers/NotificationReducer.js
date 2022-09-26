import { ActionTypes } from '../action_types';

let initialState = {
    getUserNotificationsData: null,
    getUserNotificationsData_list: [],
    loading: false,
    friendRequestApprovedData: [],

    // getServicesByIdData_list: [],
};

export const NotificationReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.Get_UserNotifications:
            let getUserNotificationsData_list_copy = [];
            getUserNotificationsData_list_copy = [
                ...state.getUserNotificationsData_list,
                ...action.payload.data,
            ];
            state = {
                ...state,
                getUserNotificationsData: action.payload,
                getUserNotificationsData_list: getUserNotificationsData_list_copy,
            };
            break;
        case ActionTypes.Reset_Get_UserNotifications:
            state = {
                ...state,
                getUserNotificationsData: null,
                getUserNotificationsData_list: [],
            };
            break;
        case ActionTypes.Friend_Request_Approved:
            state = { ...state, friendRequestApprovedData: action.payload };
            break;

        default:
            break;
    }
    return state;
};
