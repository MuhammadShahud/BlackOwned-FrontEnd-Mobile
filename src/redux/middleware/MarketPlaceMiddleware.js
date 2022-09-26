import { APIs } from '../../configs/APIs';
import { get, POST, post } from '../../configs/AxiosConfig';
import { ActionTypes } from '../action_types';
import { getHeaders } from '../../Utils';
import Storage from '../../Utils/AsyncStorage';
import axios, { Axios } from 'axios';
import { Alert } from 'react-native';
// import AuthAction from '../Actions/AuthAction';

export const MarketPlaceMiddleware = {

  getAllMarketPlacesSponsored: ({ next_page_url, name }) => {
    return async dispatch => {

      return new Promise(async (resolve, reject) => {
        try {
          if (next_page_url == undefined || name) {
            dispatch({ type: ActionTypes.Reset_Get_MarketPlacesSponsored, payload: request });
          }
          // dispatch({ type: ActionTypes.ShowLoading });
          let formData = new FormData();
          formData.append('search', name);
          // console.warn('search', formData)
          let request = await post(
            APIs.marketPlaceSponsored(next_page_url),
            name ? formData : {},
            await getHeaders(),
          );
          // console.warn('request', request?.success);
          if (request) {
            dispatch({ type: ActionTypes.Get_MarketPlacesSponsored, payload: request });
            resolve(request)
            dispatch({ type: ActionTypes.HideLoading });
          } else {
            dispatch({ type: ActionTypes.HideLoading });
          }
        } catch (error) { }
      });
    };
  },
  getAllMarketPlacesProducts: ({ next_page_url, name }) => {
    return async dispatch => {

      // return new Promise(async (resolve, reject) => {
      try {
        if (next_page_url == undefined || name) {
          dispatch({ type: ActionTypes.Reset_Get_MarketPlacesProducts, payload: request });
        }
        // dispatch({ type: ActionTypes.ShowLoading });
        let formData = new FormData();
        formData.append('search', name);
        // console.warn('search', formData)
        let request = await post(
          APIs.marketPlaceProducts(next_page_url),
          name ? formData : {},
          await getHeaders(),
        );
        // console.warn('request', request?.success);
        if (request) {
          dispatch({ type: ActionTypes.Get_MarketPlacesProducts, payload: request });
        } else {
          dispatch({ type: ActionTypes.HideLoading });
        }
      } catch (error) { }
      // });
    };
  },

  getProductsByCategory: ({ next_page_url, id, distance }) => {
    return async dispatch => {

      // return new Promise(async (resolve, reject) => {
      try {
        if (next_page_url == undefined || id) {
          dispatch({ type: ActionTypes.Reset_GET_PRODUCTSBYCATEGORY, payload: request });
        }
        // dispatch({ type: ActionTypes.ShowLoading });
        let formData = new FormData();
        formData.append('distance', distance);
        formData.append('category_id', id);
        // console.warn('search', formData)
        let request = await post(
          APIs.getProductsByCategory(next_page_url),
          formData,
          await getHeaders(),
        );
        // console.warn('request', request?.success);
        if (request) {
          dispatch({ type: ActionTypes.GET_PRODUCTSBYCATEGORY, payload: request });
        } else {
          dispatch({ type: ActionTypes.HideLoading });
        }
      } catch (error) { }
      // });
    };
  },

  getAllUserProducts: ({ next_page_url, name }) => {
    return async dispatch => {

      return new Promise(async (resolve, reject) => {
        try {
          if (next_page_url == undefined || name) {
            dispatch({ type: ActionTypes.Reset_Get_UserProducts, payload: request });
          }
          // dispatch({ type: ActionTypes.ShowLoading });
          let formData = new FormData();
          formData.append('search', name);
          // console.warn('search', formData)
          let request = await post(
            APIs.getAllUserProducts(next_page_url),
            name ? formData : {},
            await getHeaders(),
          );
          // console.warn('request', request?.success);
          if (request) {
            dispatch({ type: ActionTypes.Get_UserProducts, payload: request });
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

  storeProduct: ({ name, price, discounted_price, description, image, category_id }) => {
    // console.warn("ghgjgj", name);
    return async dispatch => {
      // return new Promise(async () => {
      try {
        dispatch({ type: ActionTypes.ShowLoading });
        let formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('discounted_price', discounted_price);
        formData.append('description', description);
        formData.append('image', image);
        formData.append('category_id', category_id);
        console.warn('formData', formData)
        let request = await POST(
          APIs.storeProduct,
          formData,
          await getHeaders(),
        );
        //console.warn("response=============", request)
        if (request.success) {
          dispatch({ type: ActionTypes.HideLoading });
          Alert.alert("Note", request?.message)
          dispatch({ type: ActionTypes.Store_Product, payload: request?.data });
        } else {
          dispatch({ type: ActionTypes.HideLoading });
        }
      } catch (error) { }
      // });
    };
  },

  promoteProduct: ({ productid }) => {
    // console.warn("ghgjgj", name);
    return async dispatch => {
      // return new Promise(async () => {
      try {
        dispatch({ type: ActionTypes.ShowLoading });
        let formData = new FormData();
        formData.append('productid', productid);

        // console.warn('formData', formData)
        let request = await post(
          APIs.updateProductStatus,
          formData,
          await getHeaders(),
        );
        // console.warn("response=============", request?.success)
        if (request.success) {
          dispatch({ type: ActionTypes.Promote_Product, payload: request });
        } else {
          dispatch({ type: ActionTypes.HideLoading });
        }
      } catch (error) { }
      // });
    };
  },

  deleteProduct: ({ id }) => {
    return async dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          dispatch({ type: ActionTypes.ShowLoading });

          let request = await post(
            APIs.DELETE_PRODUCT(id),
            {},
            await getHeaders(),
          );
          // console.warn("response=============", request?.success)
          if (request.success) {
            resolve(request)
          } else {
            dispatch({ type: ActionTypes.HideLoading });
            reject(false)
          }
        } catch (error) {
          reject(false)
        }
        dispatch({ type: ActionTypes.HideLoading });

      });
    };
  },

  Get_Categories: () => {
    return async dispatch => {

      return new Promise(async (resolve, reject) => {
        try {
          let request = await get(
            APIs.Get_Categories,
            await getHeaders(),
          );
          if (request) {
            dispatch({ type: ActionTypes.GET_CATEGORIES, payload: request });
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

  updateProduct: ({ productId, name, price, discounted_price, description, image, category_id }) => {
    // console.warn("ghgjgj", name);
    return async dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          dispatch({ type: ActionTypes.ShowLoading });
          let formData = new FormData();
          formData.append('id', productId);
          formData.append('name', name);
          formData.append('price', price);
          formData.append('discounted_price', discounted_price);
          formData.append('description', description);
          formData.append('image', image);
          formData.append('category_id', category_id);
          console.warn('formData', formData)
          let request = await POST(
            APIs.updateProduct,
            formData,
            await getHeaders(),
          );
          //console.warn("response=============", request)
          if (request.success) {
            dispatch({ type: ActionTypes.HideLoading });
            Alert.alert("Note", request?.message)
            dispatch({ type: ActionTypes.Update_Product, payload: request?.data });
            resolve(request)
          } else {
            dispatch({ type: ActionTypes.HideLoading });
            reject(false)
          }
        } catch (error) {
          dispatch({ type: ActionTypes.HideLoading });
          reject(false)
        }
      });
    };
  },

};
