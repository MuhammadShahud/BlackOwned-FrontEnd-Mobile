import { ActionTypes } from '../action_types';

let initialState = {
    getChatsIndexData: null,
    getChatsIndexData_list: [],

    chatSessionData: [],
    sendAttachment: [],

    loading: false,

};

export const ChatReducer = (state = initialState, action) => {
    switch (action.type) {

        case ActionTypes.Get_ChatsIndex:
            let getChatsIndexData_list_copy = [];
            getChatsIndexData_list_copy = [
                ...state.getChatsIndexData_list,
                ...action.payload.data,
            ];
            state = {
                ...state,
                getChatsIndexData: action.payload,
                getChatsIndexData_list: getChatsIndexData_list_copy,
            };
            break;
        case ActionTypes.Reset_Get_ChatsIndex:
            state = {
                ...state,
                getChatsIndexData: null,
                getChatsIndexData_list: [],
            };
            break;
        case ActionTypes.ChatSession:
            state = { ...state, chatSessionData: action.payload };
            break;

        case ActionTypes.SEND_ATTACHMENT:
            state = { ...state, sendAttachment: action.payload.data };

        default:
            break;
    }
    return state;
};
