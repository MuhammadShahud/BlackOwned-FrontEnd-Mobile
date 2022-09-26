import { ActionTypes } from '../action_types';

let initialState = {
    ownPost: [],
    loading: false,

};

export const PostReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.Own_Post:
            state = { ...state, ownPost: action.payload.data };
        default:
            break;
    }
    return state;
};
