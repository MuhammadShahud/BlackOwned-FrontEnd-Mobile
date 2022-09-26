import axios from 'axios';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
export const instance = axios.create({
  //LIVE
  baseURL: 'https://blackowned.biz/api/',
  imgURL: 'https://blackowned.biz/public/images/',

  //STAGE 202
  //baseURL: 'http://202.142.180.146:90/blackowned/api/',
  // imgURL: 'http://202.142.180.146:90/blackowned/public/images/',

  // LOCAL SERVER: 192
  //baseURL: 'http://192.168.0.8:90/blackowned/api/',
  //imgURL: 'http://192.168.0.8:90//blackowned/public/images/',

  //LOCAL HOST PC 
  // baseURL: 'http://192.168.0.172/blackowned/api/',
  // imgURL: 'http://192.168.0.172/blackowned/public/images/',

  timeout: 15000,
  //headers: {Authorization: 'Bearer ' + ''},
});
// //STAGE 202
// export const imgURL = 'http://202.142.180.146:90/blackowned/public/images/'
// export const baseURL = 'http://202.142.180.146:90/blackowned/api/'
export const dummyImage = 'https://www.w3schools.com/w3images/avatar2.png'

//LOCAL HOST PC
//export const imgURL = 'http://192.168.0.8:90/blackowned/public/images/'
//export const baseURL = 'http://192.168.0.8:90/blackowned/api/'

export const imgURL = 'https://blackowned.biz/public/images/'
export const baseURL = 'https://blackowned.biz/api/'


export const ScreenHeight = heightPercentageToDP('100%');
export const ScreenWidth = widthPercentageToDP('100%');

export const post = async (url, data, config) => {
  //console.warn("YEYEYEYEYE:");
  try {
    let request = await instance.post(url, data, config);
    // console.warn("YEYEYEYEYE:", request);
    if (request.data.success == true || request.sucess == true) {
      return request.data.data;
    } else {
      console.warn("Post Axios Config ", request.data)
      alert(request.data.message);
    }
  } catch (error) {
    // console.log('------------------->', JSON.stringify(error.response))
    alert(error);
  }
};
export const POST = async (url, data, config) => {
  try {
    let request = await instance.post(url, data, config);
    if (request.data.success == true) {
      return request.data;
    } else {
      console.log('------------------->', JSON.stringify(request))
      alert(request.data.message);
    }
  } catch (error) {
    console.log('------------------->', JSON.stringify(error.response))
    alert(error);
  }
};

export const get = async (url, data, config) => {
  try {
    let request = await instance.get(url, data, config);
    if (request.data.success == true) {
      return request.data;
    } else {
      alert(request.data.message);
    }
  } catch (error) {
    alert(error);
  }
};
