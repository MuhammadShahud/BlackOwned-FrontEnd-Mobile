import { APIs } from '../../configs/APIs';
import { post, get, POST } from '../../configs/AxiosConfig';
import { ActionTypes } from '../action_types';
import { getHeaders } from '../../Utils';
import Storage from '../../Utils/AsyncStorage';
import axios, { Axios } from 'axios';
import { Alert } from 'react-native';
// import AuthAction from '../Actions/AuthAction';

export const SubscriptionMiddleware = {

    GetSubscription: ({
        callback,
    }) => {
        return async dispatch => {
            try {
                dispatch({ type: ActionTypes.ShowLoading });
                let response = await get(
                    APIs.GET_SUBSCRIPTIONS,
                    await getHeaders(),
                );
                if (response.success) {
                    callback(response);
                }
            } catch (error) {
                callback(false);
            }
            dispatch({ type: ActionTypes.HideLoading });
        };
    },
    addPaymentCard: ({ cardName, cardNumber, expiryDate, cvv }) => {
        return dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    dispatch({ type: ActionTypes.ShowLoading });
                    let formData = new FormData();
                    formData.append('card_name', cardName);
                    formData.append('exp_date', expiryDate);
                    formData.append('cvc', cvv);
                    formData.append('card_number', cardNumber);

                    // console.warn('Form DTE:', formData);

                    let response = await POST(
                        APIs.STORE_CARD,
                        formData,
                        await getHeaders(),
                    );

                    // console.warn('ress ====', response);
                    if (response.success) {
                        dispatch({ type: ActionTypes.ADD_PAYMENT_CARD, payload: response.data });
                        dispatch({ type: ActionTypes.HideLoading });
                        Alert.alert("Note", response.message)
                        resolve(response.data);
                    } else {
                        reject(false);
                    }
                } catch (error) {
                    reject(false);
                    dispatch({ type: ActionTypes.HideLoading });
                }
                dispatch({ type: ActionTypes.HideLoading });
            });
        };
    },
    showMethod: () => {

        return async dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    dispatch({ type: ActionTypes.ShowLoading });
                    let response = await get(
                        `${APIs.SHOW_METHOD}`,
                        await getHeaders(),
                    );
                    // console.warn("MW get subcription: ", response);
                    if (response.success) {
                        dispatch({ type: ActionTypes.GET_PAYMENT_CARDS, payload: response.data });
                        resolve(response.data);
                    } else {
                        reject(false);
                    }
                } catch (error) {
                    reject(false);
                    console.warn('err ', error);
                }
                dispatch({ type: ActionTypes.HideLoading });
            });
        };

    },

    UpdateDefaultCard: ({ id }) => {
        //console.warn("ID mW", id);
        return async dispatch => {
            try {
                dispatch({ type: ActionTypes.ShowLoading });
                let response = await POST(
                    APIs.UPDATE_DEFAULT_CARD(id),
                    {},
                    await getHeaders(),
                );
                //   console.warn("MW update default: ", response);
                if (response.success) {
                    Alert.alert('Note', response.message)
                    dispatch({ type: ActionTypes.GET_PAYMENT_CARDS, payload: response.data });
                }
            } catch (error) {

            }
            dispatch({ type: ActionTypes.HideLoading });
        };
    },


    Delete_Card: ({ stripe_source_id }) => {
        return dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    dispatch({ type: ActionTypes.ShowLoading });
                    let formData = new FormData();
                    formData.append('stripe_source_id', stripe_source_id);

                    // console.warn('formData', formData);

                    let response = await POST(
                        `${APIs.DELETE_CARD}`,
                        formData,
                        await getHeaders(),
                    );
                    //  console.warn('Responce:', response);
                    if (response.success) {
                        Alert.alert("Note", response.message)
                        dispatch({ type: ActionTypes.GET_PAYMENT_CARDS, payload: response.data });
                        resolve(response.data);
                    } else {
                        reject(false);
                    }
                } catch (error) {
                    reject(false);
                    dispatch({ type: ActionTypes.HideLoading });
                    console.log('error ==', JSON.stringify(error.response));
                }
                dispatch({ type: ActionTypes.HideLoading });
            });
        };
    },
    BUY_SUBSCRIPTION: ({ stripe_id }) => {
        return dispatch => {
            return new Promise(async (resolve, reject) => {
                try {
                    dispatch({ type: ActionTypes.ShowLoading });
                    let formData = new FormData();
                    formData.append('plan_id', stripe_id);


                    let response = await POST(
                        `${APIs.BUY_SUBSCRIPTION}`,
                        formData,
                        await getHeaders(),
                    );
                    console.warn("Note:======>", response);
                    if (response.success) {
                        Alert.alert("Note", response.message)
                        resolve(response.data);
                        // dispatch({ type: ActionTypes.Login, payload: request });
                        dispatch({ type: ActionTypes.Update_Profile, payload: response?.data?.user });
                    } else {
                        reject(false);
                    }
                } catch (error) {
                    reject(false);
                    dispatch({ type: ActionTypes.HideLoading });
                }
                dispatch({ type: ActionTypes.HideLoading });
            });
        };
    },

};
