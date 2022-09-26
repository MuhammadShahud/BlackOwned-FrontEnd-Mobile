import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Advertise from '../screens/Advertise/Advertise';
import Banks from '../screens/Banks/Banks';
import BanksDetail from '../screens/Banks/BanksDetail';
import Chat from '../screens/Chat/Chat';
import ChatList from '../screens/Chat/ChatList';
import ComingSoon from '../screens/ComingSoon';
import ContactUs from '../screens/ContactUs/ContactUs';
import EditProfile from '../screens/EditProfile/EditProfile';
import OtherFriendList from '../screens/OtherFriendList';
import Jobs from '../screens/Jobs/Jobs';
import JobsDetails from '../screens/Jobs/JobsDetails';
import AddJobCustomer from '../screens/Jobs/AddJobCustomer';
import PostJobCustomer from '../screens/Jobs/PostJobCustomer';
import LocalCompanyList from '../screens/LocalCompanyList/LocalCompanyList';
import AddProduct from '../screens/Marketplace/AddProduct';
import EditProduct from '../screens/Marketplace/EditProduct';
import Marketplace from '../screens/Marketplace/Marketplace';
import ProductsByCategories from '../screens/Marketplace/ProductsByCategories';
import ProductDetails from '../screens/Marketplace/ProductDetails';
import Network from '../screens/Network';
import News from '../screens/News/News';
import NewsDetail from '../screens/News/NewsDetail';
import Notification from '../screens/Notification/Notification';
import AddCard from '../screens/Payment/AddCard';
import Payment from '../screens/Payment/Payment';
import PrivacyPolicy from '../screens/PrivacyPolicy/PrivacyPolicy';
import OtherProfile from '../screens/Profile/OtherProfile';
import Upload from '../screens/Profile/Upload';
import UserProfile from '../screens/Profile/UserProfile';
import profileSettings from '../screens/ProfileSettings/profileSettings';
import Rating from '../screens/Rating';
import Seminar from '../screens/Seminar/Seminar';
import SeminarsDetail from '../screens/Seminar/SeminarsDetail';
import AddServices from '../screens/Services/AddServices';
import ServiceDetail from '../screens/Services/ServiceDetail';
import Services from '../screens/Services/Services';
import ServicesFilter from '../screens/Services/ServicesFilter';
import SubcriptionPlans from '../screens/SubcriptionPlans/SubcriptionPlans';
import TermsAndConditions from '../screens/TermsAndConditions/TermsAndConditions';
import BottomNavigation from './BottomNavigation';
import ProviderRating from '../screens/ProviderRating/ProviderRating';
import WebView from '../screens/webView';
import Invite from '../screens/Invite/Invite';
import MyProduct from '../screens/MyProduct/MyProduct';

const MainStackNav = createStackNavigator();

const MainStack = () => {
  return (
    <MainStackNav.Navigator screenOptions={{ headerShown: false }}>
      {/* <MainStackNav.Screen name="BottomNavigation" component={BottomNavigation} /> */}
      <MainStackNav.Screen name="Dashboard" component={BottomNavigation} />
      <MainStackNav.Screen name="Services" component={Services} />
      <MainStackNav.Screen name="AddServices" component={AddServices} />
      <MainStackNav.Screen name="ServicesFilter" component={ServicesFilter} />
      <MainStackNav.Screen name="ServiceDetail" component={ServiceDetail} />
      <MainStackNav.Screen name="UserProfile" component={UserProfile} />
      <MainStackNav.Screen name="Upload" component={Upload} />
      <MainStackNav.Screen name="OtherProfile" component={OtherProfile} />
      <MainStackNav.Screen name="OtherFriendList" component={OtherFriendList} />
      <MainStackNav.Screen name="Rating" component={Rating} />
      <MainStackNav.Screen name="Network" component={Network} />
      <MainStackNav.Screen name="Banks" component={Banks} />
      <MainStackNav.Screen name="BanksDetail" component={BanksDetail} />
      <MainStackNav.Screen name="Seminar" component={Seminar} />
      <MainStackNav.Screen name="SeminarsDetail" component={SeminarsDetail} />
      <MainStackNav.Screen name="News" component={News} />
      <MainStackNav.Screen name="NewsDetail" component={NewsDetail} />
      <MainStackNav.Screen name="Marketplace" component={Marketplace} />
      <MainStackNav.Screen name="ProductsByCategories" component={ProductsByCategories} />
      <MainStackNav.Screen name="ProductDetails" component={ProductDetails} />
      <MainStackNav.Screen name="AddProduct" component={AddProduct} />
      <MainStackNav.Screen name="EditProduct" component={EditProduct} />
      <MainStackNav.Screen name="Jobs" component={Jobs} />
      <MainStackNav.Screen name="JobsDetails" component={JobsDetails} />
      <MainStackNav.Screen name="AddJobCustomer" component={AddJobCustomer} />
      <MainStackNav.Screen name="PostJobCustomer" component={PostJobCustomer} />
      <MainStackNav.Screen name="Notification" component={Notification} />
      <MainStackNav.Screen name="profileSettings" component={profileSettings} />
      <MainStackNav.Screen name="EditProfile" component={EditProfile} />
      <MainStackNav.Screen name="SubcriptionPlans" component={SubcriptionPlans} />
      <MainStackNav.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <MainStackNav.Screen name="TermsAndConditions" component={TermsAndConditions} />
      <MainStackNav.Screen name="ContactUs" component={ContactUs} />
      <MainStackNav.Screen name="Advertise" component={Advertise} />
      <MainStackNav.Screen name="Payment" component={Payment} />
      <MainStackNav.Screen name="AddCard" component={AddCard} />
      <MainStackNav.Screen name="Chat" component={Chat} />
      <MainStackNav.Screen name="ChatList" component={ChatList} />
      <MainStackNav.Screen name="LocalCompanyList" component={LocalCompanyList} />
      <MainStackNav.Screen name="ProviderRating" component={ProviderRating} />
      <MainStackNav.Screen name="WebView" component={WebView} />
      <MainStackNav.Screen name="Invite" component={Invite} />
      <MainStackNav.Screen name="MyProduct" component={MyProduct} />



      <MainStackNav.Screen
        name="Development In Process"
        component={ComingSoon}
      />
    </MainStackNav.Navigator>
  );
};

export default MainStack;
