import { NativeBaseProvider } from 'native-base';
import React from 'react';
import { ActivityIndicator, Modal, SafeAreaView, View, Appearance, } from 'react-native';
import { connect } from 'react-redux';
import AuthStack from './AuthStack';
import MainStack from './MainStack';
import Spinner from 'react-native-spinkit';
import theme from '../configs/Theme';
import SplashScreen from 'react-native-splash-screen';
import Storage from '../Utils/AsyncStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AccessibilityInfo from 'react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo';
import { AuthMiddleware } from '../redux/middleware/AuthMiddleware';
import { ActionTypes } from '../redux/action_types';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';


class AppNav extends React.Component {


  constructor(props) {
    super(props)
    this.state = {
      token: null,
      loading: false,
    }
    SplashScreen.hide();
    //this.createChannel();
  }

  createChannel = async () => {
    let channelId = await notifee.createChannel({
      id: 'balckowned',
      name: 'BO Channel',
    });
  }


  async onDisplayNotification() {
    // Create a channel

  }

  async componentDidMount() {
    Appearance.addChangeListener((pref) => {
      if (pref.colorScheme == "dark")
      {
        if(this.props.isDark)
        this.props.Darkmode();
      }
      else
        this.props.Lightmode();
    })
    this.setState({ appLoading: true })
    let darkString = await AsyncStorage.getItem("BO@DM");
    if (darkString == "true") {
      this.props.Darkmode();
    }
    AsyncStorage.getItem('@BB-user', (error, result) => {
      if (!error) {
        if (result) {
          let data = JSON.parse(result);
          this.props.Login(data)
        }
      }
      this.setState({ appLoading: false })
    })

    //we check if user has granted permission to receive push notifications.
    this.checkPermission();
    messaging().registerDeviceForRemoteMessages();

    messaging().onMessage(this.onMessageReceived);
    // Register all listener for notification 
  }

  async onMessageReceived(message) {
    // Do something
    console.warn(message)

    let channelId = await notifee.createChannel({
      id: 'balckowned',
      name: 'BO Channel',
      sound: "default",
      vibration: true,
      badge: true,
      importance: 4,
      visibility: 1,
      bypassDnd: true
    });
    // Display a notification
    await notifee.displayNotification({
      title: message.notification.title,
      body: message.notification.body,
      android: {
        channelId: channelId,
        importance: 4,
        sound: "default",
      },
    });
  }

  async checkPermission() {
    const enabled = await messaging().hasPermission();
    // If Premission granted proceed towards token fetch
    if (enabled != messaging.AuthorizationStatus.AUTHORIZED) {
      this.requestPermission();
    }
  }

  async requestPermission() {
    try {
      await messaging().requestPermission();
      // User has authorised
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }




  render() {

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <NativeBaseProvider theme={theme}>

          {this.state.appLoading ? <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator color={'blue'} size={'large'} />
          </View>
            :
            this.state.token || this.props.logged_in ? <MainStack />
              :
              <AuthStack />}
          {/* {props.logged_in ? <BottomNavigation /> :  <BottomNavigation />} */}
        </NativeBaseProvider>
        <Modal visible={this.props.loading} transparent>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.3)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Spinner
              isVisible={this.props.loading}
              type="FoldingCube"
              color="#1872ea"
              size={80}
            />
          </View>
        </Modal>
      </SafeAreaView>
    );
  };
}

const mapStateToProps = state => ({
  logged_in: state.AuthReducer.is_logged_in,
  loading: state.GeneralReducer.loading,
  isDark: state.AppReducer.darkmode
});

const mapDispatchToProps = dispatch => ({
  Login: data => dispatch({ type: ActionTypes.Login, payload: data }),
  Darkmode: () => dispatch({ type: ActionTypes.DARK_MODE }),
  Lightmode: () => dispatch({ type: ActionTypes.LIGHT_MODE }),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppNav);
