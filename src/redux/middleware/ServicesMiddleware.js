import { APIs } from '../../configs/APIs';
import { post, get } from '../../configs/AxiosConfig';
import { ActionTypes } from '../action_types';
import { getHeaders } from '../../Utils';
import Storage from '../../Utils/AsyncStorage';
import axios, { Axios } from 'axios';
// import AuthAction from '../Actions/AuthAction';

export const ServicesMiddleware = {
  // Login: userData => {
  //   return async dispatch => {
  //     try {
  //       dispatch({type: ActionTypes.ShowLoading});
  //       let formData = new FormData();
  //       formData.append('email', userData.email);
  //       formData.append('password', userData.password);
  //       let request = await post(APIs.LOGIN, formData);
  //       if (request) {
  //         dispatch({type: ActionTypes.Register, payload: request});
  //       }
  //       dispatch({type: ActionTypes.HideLoading});
  //     } catch (error) {}
  //   };
  // },

  getAllServices: ({ next_page_url, name }) => {
    return async dispatch => {

      return new Promise(async (resolve, reject) => {
        try {
          if (next_page_url == undefined || name) {
            dispatch({ type: ActionTypes.Reset_Customer_Services, payload: request });
          }
          // dispatch({ type: ActionTypes.ShowLoading });
          let formData = new FormData();
          formData.append('search', name);
          let request = await post(
            APIs.CUSTOMER_SERVICES(next_page_url),
            name ? formData : {},
            await getHeaders(),
          );
          if (request) {
            dispatch({ type: ActionTypes.Customer_Services, payload: request });
            resolve(request)
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
  Service_Index: ({
    callback,
  }) => {
    return async dispatch => {
      try {
        let response = await get(
          `${APIs.SERVICE_INDEX}`,
          await getHeaders(),
        );
        // console.warn("ServicesIndex response: ", response);
        if (response.success) {
          callback(response);
        }
      } catch (error) {
        callback(false);
        // console.warn('err ', error);
      }

    };
  },

  storeService: ({ service_id }) => {
    // console.warn("ghgjgj", name);
    return async dispatch => {
      // return new Promise(async () => {
      try {
        let formData = new FormData();
        formData.append('service_id', service_id);
        // console.warn('service_id', formData)
        let request = await post(
          APIs.storeService,
          formData,
          await getHeaders(),
        );
        // console.warn("response=============", request?.success)
        if (request.success) {
          dispatch({ type: ActionTypes.Store_Service, payload: request });
        } else {
          dispatch({ type: ActionTypes.HideLoading });
        }
      } catch (error) { }
      // });
    };
  },

  removeService: ({ service_id }) => {
    // console.warn("ghgjgj", name);
    return async dispatch => {
      // return new Promise(async () => {
      try {
        let formData = new FormData();
        formData.append('service_id', service_id);
        // console.warn('service_id', formData)
        let request = await post(
          APIs.removeService,
          formData,
          await getHeaders(),
        );
        // console.warn("response=============", request?.success)
        if (request.success) {
          dispatch({ type: ActionTypes.Remove_Service, payload: request });
        } else {
          dispatch({ type: ActionTypes.HideLoading });
        }
      } catch (error) { }
      // });
    };
  },

  getAllProviders: ({ next_page_url, name, serviceid, min_distance, max_distance, min_rating, max_rating, lat, lng }) => {
    return async dispatch => {
      // return new Promise(async (resolve, reject) => {
      try {
        if (next_page_url == undefined || name) {
          dispatch({ type: ActionTypes.Reset_Providers_Services, payload: request });
        }
        // dispatch({ type: ActionTypes.ShowLoading });
        let formData = new FormData();
        name && formData.append('search', name);
        formData.append('serviceid', serviceid);
        formData.append('min_distance', min_distance);
        formData.append('max_distance', max_distance);
        min_rating && formData.append('min_rating', min_rating);
        max_rating && formData.append('max_rating', max_rating);
        lat && formData.append('lat', parseFloat(lat));
        lng && formData.append('lng', parseFloat(lng));

        let request = await post(
          APIs.providerServicesByid(next_page_url),
          formData,
          await getHeaders(),
        );
        if (request) {
          dispatch({ type: ActionTypes.Providers_Services, payload: request });
        } else {
          dispatch({ type: ActionTypes.HideLoading });
        }
      } catch (error) {
      }
      // });
    };
  },

  getAllServiceById: ({ providerid }) => {
    return async dispatch => {

      // return new Promise(async (resolve, reject) => {
      try {
        // if (next_page_url == undefined || name) {
        //   dispatch({ type: ActionTypes.Reset_Providers_Services, payload: request });
        // }
        // dispatch({ type: ActionTypes.ShowLoading });
        let formData = new FormData();
        // formData.append('search', name);
        formData.append('providerid', providerid);
        // console.warn('search', formData)
        let request = await post(
          APIs.serviceIndexByid,
          formData,
          await getHeaders(),
        );
        // console.warn('request', request?.success);
        if (request) {
          dispatch({ type: ActionTypes.Services_ById, payload: request });
        } else {
          dispatch({ type: ActionTypes.HideLoading });
        }
      } catch (error) { }
      // });
    };
  },

  Get_All_Service: ({
    callback,
  }) => {
    return async dispatch => {
      try {
        dispatch({ type: ActionTypes.ShowLoading });
        let response = await get(
          `${APIs.GET_ALL_SERVICES}`,
          await getHeaders(),
        );
        console.warn("Get_All_Service response: ", response);
        if (response.success) {
          dispatch({ type: ActionTypes.HideLoading });
          callback(response);
        }
      } catch (error) {
        callback(false);
        // console.warn('err ', error);
      }
      dispatch({ type: ActionTypes.HideLoading });

    };
  },

};
