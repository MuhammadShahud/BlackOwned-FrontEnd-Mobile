import { APIs } from '../../configs/APIs';
import { post, get } from '../../configs/AxiosConfig';
import { ActionTypes } from '../action_types';
import { getHeaders } from '../../Utils';
import Storage from '../../Utils/AsyncStorage';
import axios, { Axios } from 'axios';
// import AuthAction from '../Actions/AuthAction';

export const NotificationMiddleware = {

  getNotificationByUser: ({ next_page_url, name }) => {
    return async dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          if (next_page_url == undefined || name) {
            dispatch({ type: ActionTypes.Reset_Get_UserNotifications, payload: request });
          }
          // dispatch({ type: ActionTypes.ShowLoading });
          let formData = new FormData();
          formData.append('search', name);
          // console.warn('search', formData)
          let request = await post(
            APIs.getNotificationByUser(next_page_url),
            name ? formData : {},
            await getHeaders(),
          );
          // console.warn('request', request?.success);
          if (request) {
            dispatch({ type: ActionTypes.Get_UserNotifications, payload: request });
            resolve(request)
          } else {
            dispatch({ type: ActionTypes.HideLoading });
            reject(false)
          }
        } catch (error) { }
      });
    };
  },

  friendRequestApproved: ({ content_id, notification_id, status }) => {
    // console.warn("ghgjgj", name);
    return async dispatch => {
      // return new Promise(async () => {
      try {
        dispatch({ type: ActionTypes.ShowLoading });
        let formData = new FormData();
        formData.append('content_id', content_id);
        formData.append('notification_id', notification_id);
        formData.append('status', status);

        let request = await post(
          APIs.friendRequestApproved,
          formData,
          await getHeaders(),
        );
        // console.warn("response=============", request?.success)
        if (request.success) {
          dispatch({ type: ActionTypes.Friend_Request_Approved, payload: request });
        } else {
          dispatch({ type: ActionTypes.HideLoading });
        }
      } catch (error) {
        dispatch({ type: ActionTypes.HideLoading });
      }
      // });
    };
  },
};
