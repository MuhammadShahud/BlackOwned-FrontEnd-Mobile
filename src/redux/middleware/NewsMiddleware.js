import { APIs } from '../../configs/APIs';
import { post } from '../../configs/AxiosConfig';
import { ActionTypes } from '../action_types';
import { getHeaders } from '../../Utils';
import Storage from '../../Utils/AsyncStorage';
import axios, { Axios } from 'axios';
// import AuthAction from '../Actions/AuthAction';

export const NewsMiddleware = {

  getAllNews: ({ next_page_url, name }) => {
    return async dispatch => {

      return new Promise(async (resolve, reject) => {
        try {
          if (next_page_url == undefined || name) {
            dispatch({ type: ActionTypes.Reset_Get_News, payload: request });
          }
          // dispatch({ type: ActionTypes.ShowLoading });
          let formData = new FormData();
          formData.append('search', name);
          // console.warn('search', formData)
          let request = await post(
            APIs.getNews(next_page_url),
            name ? formData : {},
            await getHeaders(),
          );
          // console.warn('request', request?.success);
          if (request) {
            dispatch({ type: ActionTypes.Get_News, payload: request });
            resolve(request)
          } else {
            dispatch({ type: ActionTypes.HideLoading });
            reject(false)
          }
        } catch (error) { }
      });
    };
  },

};
