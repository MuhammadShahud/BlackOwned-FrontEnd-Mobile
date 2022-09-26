import { APIs } from '../../configs/APIs';
import { get, POST, post } from '../../configs/AxiosConfig';
import { ActionTypes } from '../action_types';
import { getHeaders } from '../../Utils';
import Storage from '../../Utils/AsyncStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from "@react-native-firebase/database";
import { Alert } from 'react-native';
import {
  LoginManager,
  Profile,
  GraphRequest,
  AccessToken,
  GraphRequestManager,
} from 'react-native-fbsdk-next';
import { appleAuth } from '@invertase/react-native-apple-authentication';
// import AuthAction from '../Actions/AuthAction';
import jwt_decode from "jwt-decode";
import axios from 'axios';

export const AuthMiddleware = {
  Register: userData => {
    return async dispatch => {
      dispatch({ type: ActionTypes.ShowLoading });
      try {
        let formData = new FormData();
        formData.append('username', userData.username);
        formData.append('f_name', userData.f_name);
        formData.append('l_name', userData.l_name);
        formData.append('email', userData.email);
        formData.append('password', userData.password);
        formData.append('confirm_password', userData.c_password);
        // formData.append('city', userData.city);
        formData.append('role', userData.userType);
        formData.append('phone', userData.phone);
        if (userData.provider)
          formData.append('provider_as', userData.provider);
        if (userData.company_name)
          formData.append('company_name', userData.company_name);
        formData.append('lat', userData.lat);
        formData.append('lng', userData.lng);
        formData.append('company_address', userData.geoLocationAddress);
        let request = await POST(APIs.REGISTER, formData);
        if (request) {
          database().ref("users/" + request?.data?.user.id).set({
            online: true
          })
          Alert.alert('Note', request?.message)
          // dispatch({ type: ActionTypes.Register, payload: request });
        }
        dispatch({ type: ActionTypes.HideLoading });
      } catch (error) { }
    };
  },
  Login: userData => {
    return async dispatch => {
      try {
        dispatch({ type: ActionTypes.ShowLoading });
        let deviceToken = await AsyncStorage.getItem('fcmToken')
        let formData = new FormData();
        formData.append('email', userData.email);
        formData.append('password', userData.password);
        formData.append('device_id', deviceToken);
        console.warn("formData:", formData);
        let request = await post(APIs.LOGIN, formData);
        console.warn("Login Data:", request);
        if (request) {
          // console.warn(request);
          await Storage.setToken(request.token);
          await Storage.set("@BB-user", JSON.stringify(request))
          database().ref("users/" + request.user.id).set({
            online: true
          })
          dispatch({ type: ActionTypes.Login, payload: request });
        }
        dispatch({ type: ActionTypes.HideLoading });
      } catch (error) { }
    };
  },
  SendMail: userData => {
    return async dispatch => {
      try {
        dispatch({ type: ActionTypes.ShowLoading });
        let formData = new FormData();
        formData.append('email', userData.email);
        let request = await post(APIs.sendMail, formData);
        // console.warn("Login Data:", request);
        if (request) {
          console.warn(request);
          dispatch({ type: ActionTypes.SendMail, payload: request });
        }
        dispatch({ type: ActionTypes.HideLoading });
      } catch (error) { }
    };
  },
  ResetPassword: userData => {
    return async dispatch => {
      try {
        dispatch({ type: ActionTypes.ShowLoading });
        let formData = new FormData();
        formData.append('email', userData.email);
        formData.append('password', userData.NewPass);
        console.warn("Form Data:", formData);
        let request = await post(APIs.resetPassword, formData);
        // console.warn("Form Data:", formData);
        // console.warn("request:", request);
        if (request) {
          console.warn(request);
          dispatch({ type: ActionTypes.ResetPassword, payload: request });
        }
        dispatch({ type: ActionTypes.HideLoading });
      } catch (error) { }
    };
  },

  OnlineUsers: ({ callback }) => {
    return async dispatch => {

      // return new Promise(async (resolve, reject) => {
      try {

        let request = await get(
          APIs.online_users,
          await getHeaders(),
        );
        // console.warn('request', request?.success);
        if (request) {
          dispatch({ type: ActionTypes.OnlineUsers, payload: request.data });
          callback(request.data)
        } else {
          dispatch({ type: ActionTypes.HideLoading });
        }
      } catch (error) { }
      // });
    };
  },

  facebookLogin: payload => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {

          LoginManager.logInWithPermissions(['public_profile', 'email']).then(
            result => {
              if (result.isCancelled) {
                console.log('Login cancelled');
              } else {
                Profile.getCurrentProfile().then(currentProfile => {
                  console.warn('Payload', currentProfile);
                  AccessToken.getCurrentAccessToken().then(token => {
                    new GraphRequestManager()
                      .addRequest(
                        new GraphRequest(
                          '/me',
                          {
                            accessToken: token?.accessToken,
                            parameters: {
                              fields: {
                                string: 'id,name,first_name, last_name,birthday,email',
                              },
                            },
                          },
                          (err, res) => {
                            resolve(res);
                            if (err) {
                              alert('Something went wrong');
                              reject(null);
                            } else {
                            }
                          },
                        ),
                      )
                      .start();
                  });
                });
              }
            },
            function (error) {
              reject(null);
              console.log('Login fail with error: ' + error);
            },
          );
        } catch (error) {

          alert('Network Error');
          reject(error);

          console.log('error', error);
        }
      });
    };
  },

  appleSignIn :payload => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME]
          });

          
          
          const { email} = jwt_decode(appleAuthRequestResponse.identityToken)
          const {familyName,givenName}=appleAuthRequestResponse.fullName
          //console.log('JWT:',appleAuthRequestResponse.fullName,appleAuthRequestResponse.email)
         // console.log("JJJJJ=====>",jwt_decode(appleAuthRequestResponse.identityToken))
          resolve({email ,name: familyName ,givenName});
        //   // get current authentication state for user
        //   // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
        //   const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
        // console.log("credentialState=>", credentialState)
        //   // use credentialState response to ensure the user is authenticated
        //   if (credentialState === appleAuth.State.AUTHORIZED) {
        //     // user is authenticated
        //   }
        } catch (error) {
          reject(error);
          // alert('Network Error');
          console.log('error 64=>', JSON.stringify(error.response));
        }
      });
    };
  },

socialLogin: ({email,navigation,callback,}) => {
  return async dispatch => {
    try {
      dispatch({ type: ActionTypes.ShowLoading });
      let deviceToken = await AsyncStorage.getItem('fcmToken')
      let formData = new FormData();
      formData.append('email', email);
      console.warn("formData:", formData);
      let request = await POST(APIs.SOCIAL_LOGIN, formData);
      console.warn("Socail Data:", request.success);
      if (request.success) {
       // console.warn("H1");
        if(request?.data)
        {
       // console.warn("H2",request);

       
       await Storage.setToken(request?.data?.token);
        await Storage.set("@BB-user", JSON.stringify(request?.data))
       database().ref("users/" + request?.data?.user?.id).set({
         online: true
       })
       dispatch({ type: ActionTypes.Login, payload: request?.data });
      dispatch({ type: ActionTypes.HideLoading });
      }
      else{
       // console.warn("H3",request);
        dispatch({ type: ActionTypes.HideLoading });
        callback(request)
      }
    
     // dispatch({ type: ActionTypes.HideLoading });
    }
    } catch (error) { 
      dispatch({ type: ActionTypes.HideLoading });
    }
  }
}

};
