import { APIs } from '../../configs/APIs';
import { post } from '../../configs/AxiosConfig';
import { ActionTypes } from '../action_types';
import { getHeaders } from '../../Utils';
import Storage from '../../Utils/AsyncStorage';
import axios, { Axios } from 'axios';
// import AuthAction from '../Actions/AuthAction';

export const NetworkMiddleware = {

  getAllUserList: ({ next_page_url, name }) => {
    return async dispatch => {

      return new Promise(async (resolve, reject) => {
        try {
          if (next_page_url == undefined || name) {
            dispatch({ type: ActionTypes.Reset_Get_UserList, payload: request });
          }
          // dispatch({ type: ActionTypes.ShowLoading });
          let formData = new FormData();
          formData.append('search', name);
          // console.warn('search', formData)
          let request = await post(
            APIs.userList(next_page_url),
            name ? formData : {},
            await getHeaders(),
          );
          if (request) {
            dispatch({ type: ActionTypes.Get_UserList, payload: request });
            resolve(request)
          } else {
            dispatch({ type: ActionTypes.HideLoading });
            reject(request)
          }
        } catch (error) {
          reject(request)
        }
      });
    };
  },

  friendRequest: ({ friendid }) => {
    // console.warn("ghgjgj", name);
    return async dispatch => {
      // return new Promise(async () => {
      try {
        dispatch({ type: ActionTypes.ShowLoading });
        let formData = new FormData();
        formData.append('friend_id', friendid);

        // console.warn('formData', formData)
        let request = await post(
          APIs.friendRequest,
          formData,
          await getHeaders(),
        );
        // console.warn("response=============", request?.success)
        if (request.success) {
          dispatch({ type: ActionTypes.Friend_Request, payload: request });
        } else {
          dispatch({ type: ActionTypes.HideLoading });
        }
      } catch (error) { }
      // });
    };
  },

  getAllFriends: ({ next_page_url, id, name, ...props }) => {
    return async dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          if (next_page_url == undefined || name) {
            dispatch({ type: ActionTypes.Reset_Get_FriendsList, payload: request });
          }
          // dispatch({ type: ActionTypes.ShowLoading });
          let formData = new FormData();
          formData.append('search', name);
          formData.append('id', id);
          let request = await post(
            APIs.friendList(next_page_url),
            name || id ? formData : {},
            await getHeaders(),
          );
          if (request) {
            dispatch({ type: ActionTypes.Get_FriendsList, payload: request });
            resolve(request)
            if (props.callback)
              props.callback(request)
          } else {
            dispatch({ type: ActionTypes.HideLoading });
            reject(false)
          }
        } catch (error) {
          reject(false)
        }
      });
    };
  },

  friendRemove: ({ friendid }) => {
    // console.warn("ghgjgj", name);
    return async dispatch => {
      // return new Promise(async () => {
      try {
        dispatch({ type: ActionTypes.ShowLoading });
        let formData = new FormData();
        formData.append('friend_id', friendid);

        // console.warn('formData', formData)
        let request = await post(
          APIs.removeFriend,
          formData,
          await getHeaders(),
        );
        // console.warn("response=============", request?.success)
        if (request.success) {
          dispatch({ type: ActionTypes.Friend_Remove, payload: request });
        } else {
          dispatch({ type: ActionTypes.HideLoading });
        }
      } catch (error) { }
      // });
    };
  },

};
