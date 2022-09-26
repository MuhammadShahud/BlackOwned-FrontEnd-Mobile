export const APIs = {
  REGISTER: `register`,
  LOGIN: `login`,
  SOCIAL_LOGIN:`socialLogin`,
  UPDATEPROFILE: `customers/updateProfile`,
  // CUSTOMER_SERVICES:`customers/services/?name=${searchText ? searchText : ''}`,
  CUSTOMER_SERVICES: next_page_url =>
    next_page_url ? next_page_url : 'customers/services',
  storeService: `provider/storeService`,
  removeService: `provider/removeService`,

  DATA: `data`,
  getBanks: next_page_url =>
    next_page_url ? next_page_url : 'customers/getBanks',
  getNews: next_page_url =>
    next_page_url ? next_page_url : 'customers/getNews',
  getSeminars: next_page_url =>
    next_page_url ? next_page_url : 'customers/getSeminars',
  getCompanies: next_page_url =>
    next_page_url ? next_page_url : 'customers/getCompanies',

  marketPlaceSponsored: next_page_url =>
    next_page_url ? next_page_url : 'customers/marketPlaceSponsored',
  marketPlaceProducts: next_page_url =>
    next_page_url ? next_page_url : 'customers/marketPlaceProducts',

  getProductsByCategory: next_page_url =>
    next_page_url ? next_page_url : 'customers/searchProduct',



  storeProduct: `customers/storeProduct`,

  getAllUserProducts: next_page_url =>
    next_page_url ? next_page_url : 'customers/getAllProducts',

  updateProductStatus: `customers/updateProductStatus`,

  updateProduct: `customers/updateProduct`,

  providerServicesByid: next_page_url =>
    next_page_url ? next_page_url : 'customers/providerServicesByid',

  getUserJobs: next_page_url =>
    next_page_url ? next_page_url : 'customers/getUserJobs',

  postJob: `customers/postJob`,

  serviceIndexByid: `provider/serviceIndexByid`,
  userList: next_page_url =>
    next_page_url ? next_page_url : 'custom/userList',
  friendRequest: `custom/friendRequest`,
  getNotificationByUser: next_page_url =>
    next_page_url ? next_page_url : 'custom/getNotificationByUser',

  friendRequestApproved: `custom/friendRequestApproved`,
  friendList: next_page_url =>
    next_page_url ? next_page_url : 'custom/friendList',
  removeFriend: `custom/removeFriend`,

  getEnrollServiceJobs: next_page_url =>
    next_page_url ? next_page_url : 'provider/getEnrollServiceJobs',

  getchatIndex: next_page_url =>
    next_page_url ? next_page_url : 'custom/chatIndex',
  SendMessage: `custom/sendMessage`,
  Send_Attachment: `custom/sendMessage`,

  ChatSession: `custom/chatSession`,
  getAllMessages: (next_url, id) =>
    next_url ? `custom/viewChatlist/${id}?page=${next_url}` : `custom/viewChatlist/${id}`,

  sendMail: `sendMail`,
  online_users: `customers/online_users`,
  resetPassword: `resetPassword`,


  GET_SEMINAR: `getSeminars`,
  SERVICE_INDEX: `provider/serviceIndex`,
  CONTACT_US: `customers/contactUs`,
  SUBMIT_RATING: `customers/submitRating`,
  // PROVIDER_RATING: `provider/getProviderRating`,
  STORE_POST: `customers/storePost`,
  SHOW_USER_POST: `customers/showUserPost`,
  DELETE_POST: 'customers/deletePost',
  DELETE_PRODUCT: id => `customers/deleteProduct/${id}`,
  GET_SUBSCRIPTIONS: `customers/getSubscriptions`,
  STORE_CARD: `custom/storeCard`,
  UPDATE_DEFAULT_CARD: id =>
    `custom/updateDefaultCard/${id}`,
  // UPDATE_DEFAULT_CARD: `custom/updateDefaultCard/`,
  SHOW_METHOD: `custom/showMethod`,
  DELETE_CARD: `custom/deleteCard`,
  BUY_SUBSCRIPTION: `customers/buySubscription`,
  PROVIDER_RATING: id => `provider/getProviderRating/${id}`,
  GET_COUNTRY: `customers/country`,
  GET_STATE: id =>
    `customers/state/${id}`,
    
  GET_CITY: id =>
    `customers/city/${id}`,
  GET_ALL_SERVICES: `customers/getAllServices`,
  Get_Categories: `customers/getCategory`,
};
