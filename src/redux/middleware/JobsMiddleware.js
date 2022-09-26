import { APIs } from '../../configs/APIs';
import { post } from '../../configs/AxiosConfig';
import { ActionTypes } from '../action_types';
import { getHeaders } from '../../Utils';
import Storage from '../../Utils/AsyncStorage';
import axios, { Axios } from 'axios';
import { Alert } from 'react-native';
// import AuthAction from '../Actions/AuthAction';

export const JobsMiddleware = {


  getUserJobs: ({ next_page_url }) => {
    return async dispatch => {

      // return new Promise(async (resolve, reject) => {
      try {
        if (next_page_url == undefined) {
          dispatch({ type: ActionTypes.Reset_Get_UserJobs, payload: request });
        }
        // dispatch({ type: ActionTypes.ShowLoading });
        // let formData = new FormData();
        // formData.append('search', name);
        // console.warn('search', formData)
        let request = await post(
          APIs.getUserJobs(next_page_url),
          // formData,
          {},
          await getHeaders(),
        );
        // console.warn('request', request?.success);
        if (request) {
          dispatch({ type: ActionTypes.Get_UserJobs, payload: request });
        } else {
          dispatch({ type: ActionTypes.HideLoading });
        }
      } catch (error) { }
      // });
    };
  },

  postJob: ({ service_id, time, date, address, note, lat, lng }) => {
    // console.warn("ghgjgj", name);
    return async dispatch => {
      // return new Promise(async () => {
      try {
        dispatch({ type: ActionTypes.ShowLoading });
        let formData = new FormData();
        formData.append('service_id', service_id);
        formData.append('time', time);
        formData.append('date', date);
        formData.append('address', address);
        formData.append('note', note);
        formData.append('lat', lat);
        formData.append('lng', lng);
        // console.warn('formData', formData)
        let request = await post(
          APIs.postJob,
          formData,
          await getHeaders(),
        );
        console.warn("response=============", request)
        if (request) {
          dispatch({ type: ActionTypes.Post_Job, payload: request });
          dispatch({ type: ActionTypes.HideLoading });
          Alert.alert("Note", 'Job has been posted.')
        } else {
          dispatch({ type: ActionTypes.HideLoading });
        }
      } catch (error) {
        dispatch({ type: ActionTypes.HideLoading });

      }
      dispatch({ type: ActionTypes.HideLoading });
      // });
    };
  },


  getEnrollServiceJobs: ({ next_page_url, name }) => {
    return async dispatch => {

      // return new Promise(async (resolve, reject) => {
      try {
        if (next_page_url == undefined || name) {
          dispatch({ type: ActionTypes.Reset_Get_EnrollServiceJobs, payload: request });
        }
        // dispatch({ type: ActionTypes.ShowLoading });
        let formData = new FormData();
        formData.append('search', name);
        // console.warn('search', formData)
        let request = await post(
          APIs.getEnrollServiceJobs(next_page_url),
          name ? formData : {},
          await getHeaders(),
        );
        // console.warn('request', request?.success);
        if (request) {
          dispatch({ type: ActionTypes.Get_EnrollServiceJobs, payload: request });
        } else {
          dispatch({ type: ActionTypes.HideLoading });
        }
      } catch (error) { }
      // });
    };
  },


};
