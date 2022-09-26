import { APIs } from '../../configs/APIs';
import { post, get, baseURL, POST, imgURL } from '../../configs/AxiosConfig';
import { ActionTypes } from '../action_types';
import { getHeaders } from '../../Utils';
import Storage from '../../Utils/AsyncStorage';
import axios, { Axios } from 'axios';
// import AuthAction from '../Actions/AuthAction';
import RNFetchBlob from 'rn-fetch-blob';
import { Alert } from 'react-native';
import { IS_IOS } from '../../configs';


export const ChatMiddleware = {
  getChatIndex: ({ next_page_url, name }) => {
    return async dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          if (next_page_url == undefined || name) {
            dispatch({ type: ActionTypes.Reset_Get_ChatsIndex, payload: request });
          }
          // dispatch({ type: ActionTypes.ShowLoading });
          let formData = new FormData();
          formData.append('search', name);
          // console.warn('search', formData)
          let request = await post(
            APIs.getchatIndex(next_page_url),
            name ? formData : {},
            await getHeaders(),
          );
          // console.warn('request ===', request);
          if (request) {
            dispatch({ type: ActionTypes.Get_ChatsIndex, payload: request });
            resolve(request)
          } else {
            dispatch({ type: ActionTypes.HideLoading });
            reject(false)
          }
        } catch (error) { }
      });
    };
  },

  SendMessage: ({ userId, message, type, uri }) => {
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let formData = new FormData();
          formData.append('user_id', userId);
          formData.append('message', message);
          formData.append('type', type);
          let response = await post(
            APIs.SendMessage,
            formData,
            await getHeaders(),
          );
          if (response) {
            resolve(response);
          } else {
            reject(false);
          }
        } catch (error) {
          reject(false);
        }
      });
    };
  },

  SendAttachment: ({ userData, userId, callback, uploading }) => {
    console.warn('userData', userData, 'userId', userId);
    return async dispatch => {
      let headers = (await getHeaders()).headers
      await RNFetchBlob
        .config({ timeout: 60 * 60 })
        .fetch("POST", baseURL + APIs.Send_Attachment,
          headers,
          [{
            name: "type",
            data: "media",
          },
          {
            name: "user_id",
            data: userId + ""
          },
          {
            name: "message",
            data: "Attachment"
          },
          {
            name: "image",
            data: userData?.type + "",
          },

          // {
          //   name: "media",
          //   filename: userData?.media?.name,
          //   data: RNFetchBlob.wrap(userData?.media?.uri),
          //   type: userData?.media?.type,
          // },
          {
            name: "media",
            filename: userData?.media?.name,
            data: IS_IOS ? RNFetchBlob.wrap(userData?.media?.uri.replace('file://', '')) :
              RNFetchBlob.wrap(userData?.media?.uri),
            type: userData?.media?.type,
          },
          ...userData?.thumbnail ? [{
            name: "thumbnail",
            filename: userData?.thumbnail?.name,
            data: RNFetchBlob.wrap(userData?.thumbnail?.uri)
          },] : []]
        )
        // .uploadProgress((sent, total) => {
        //   // uploading(sent, total);
        // })
        .then((request) => {
          console.warn('request', JSON.parse(JSON.stringify(request.data)));
          dispatch({ type: ActionTypes.SEND_ATTACHMENT, payload: JSON.parse(request?.data) });
          callback(request)
          //console.warn()
        }).catch((err) => {
          console.warn('requestError', err);
        })
    };
  },

  DownloadAttachment: ({ selectedItem, }) => {

    let dirs = RNFetchBlob.fs.dirs
    console.warn('dirs.DocumentDir', dirs.DownloadDir);
    // console.warn('baseURL + selectedItem', imgURL + selectedItem,);
    return async dispatch => {
      let headers = (await getHeaders()).headers

      await RNFetchBlob
        .config({
          timeout: 60 * 60,
          fileCache: true,
          path: dirs.DownloadDir + '/' + selectedItem,
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            mime: 'application/pdf',
            title: selectedItem,
            path: IS_IOS ? dirs.DocumentDir + '/' + selectedItem : dirs.DownloadDir + '/' + selectedItem,

          },

        })
        .fetch("GET", imgURL + selectedItem,
          headers,
        )

        .then((res) => {
          IS_IOS ? RNFetchBlob.ios.openDocument(res.data)
          :
          Alert.alert('File Downloaded Successfully.');
          console.warn('The file saved to ', res.path())
          
          console.warn(res)
        }).catch((err) => {
          console.warn(err);
        })
    };
  },

  getAllUserMessages: ({ next_url, id }) => {
    // console.warn('response ====', next_url);
    return dispatch => {
      return new Promise(async (resolve, reject) => {
        try {
          let response = await get(APIs.getAllMessages(next_url, id), await getHeaders());

          if (response.success) {
            resolve(response.data);
          } else {
            reject(false);
          }
        } catch (error) {
          reject(false);
        }
      });
    };
  },

  ChatSession: ({ id }) => {

    return async dispatch => {
      return new Promise(async (resolve, reject) => {
        try {

          let formData = new FormData();
          formData.append('id', id);
          let request = await post(
            APIs.ChatSession,
            formData,
            await getHeaders(),
          );

          if (request) {

            dispatch({ type: ActionTypes.ChatSession, payload: request });
            resolve(request)
          } else {
            dispatch({ type: ActionTypes.HideLoading });
          }
        } catch (error) {
        }
      });
    };
  },
};
