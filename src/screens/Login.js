import {
  Button,
  Heading,
  Icon,
  IconButton,
  Input,
  Pressable,
  ScrollView,
  Text
} from 'native-base';
import React, { Component } from 'react';
import { StyleSheet, Image, View, Dimensions, TouchableOpacity, Appearance, Platform } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import { connect } from 'react-redux';
import { AuthMiddleware } from '../redux/middleware/AuthMiddleware';
import messaging from '@react-native-firebase/messaging';
import { firebase } from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { IS_IOS } from '../configs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { colors } from '../Theme';
const { width } = Dimensions.get('window');

class Login extends Component {

  state = {

    email: '',
    password: '',

    dark: Appearance.getColorScheme() == 'dark' ? true : false,
  };

  async componentDidMount() {

    GoogleSignin.configure({
      webClientId: '',
    });

    Appearance.addChangeListener((prefer) => {
      let dark = prefer.colorScheme == "dark";
      this.setState({ dark });
    })
    let fcmToken = await firebase.messaging().getToken();
    console.warn(fcmToken)
    if (fcmToken) {
      // user has a device token
      await AsyncStorage.setItem('fcmToken', fcmToken);
    }


  }

  Login = () => {
    let { email, password } = this.state;
    if (email && password) {
      this.props.Login({
        email,
        password,
      });
    } else {
      alert('Please enter your email and password');
    }
  };

  onPressFacebookLogin = () => {
    this.props
      .facebookLogin({})
      .then(data => {

        let New_User = {
          name: data?.first_name,
          email: data?.email,
          familyName: data?.last_name
        }
        if (data?.email) {
          this.props.socailLogin({
            email: data?.email,
            navigation: this.props?.navigation,
            callback: response => {
              if (response) {
                this.props.navigation.navigate('Signup', { social: true, New_User });
              }
              else {
                console.warn('socail else', response)
              }

            }
          })
        }
        //  this.props.navigation.navigate('Signup', { New_User });
      })
      .catch(err => {
        console.log(err);
      });
  };
  onPressGoogleSignIn = async () => {
    console.warn("Google RESponse helllo");
    // Get the users ID token
    const gRes = await GoogleSignin.signIn()
    console.warn("Google RESponse", gRes);
    let New_User = {
      name: gRes?.user?.name,
      email: gRes?.user?.email,
      familyName: gRes?.user?.familyName
    }
    if (gRes?.user?.email) {
      this.props.socailLogin({
        email: gRes?.user?.email,
        navigation: this.props?.navigation,
        callback: response => {
          if (response) {
            this.props.navigation.navigate('Signup', { social: true, New_User });
          }
          else {
            console.warn('socail else', response)
          }

        }
      })
    }
    // this.props
    //   .socialLogin({ email: gRes?.user?.email, platform: 'google' })
    //   .then(data => {
    //     console.warn("data", data);
    //     // if (data?.data?.is_first_time) {
    // this.props.navigation.navigate('Signup', { New_User });
    //     // }
    //   })
    //   .catch(err => { });
  };
  onPressAppleSignIn = () => {
    this.props
      .appleSignIn()
      .then(data => {
        let New_User = {
          email: data?.email,
          name: data?.name == 'undifined' ? '' : data?.name,
          familyName: data?.givenName == 'undifined' ? '' : data?.givenName,
        }
        console.warn("DATA,", data)
        if (data?.email) {
          this.props.socailLogin({
            email: data?.email,
            navigation: this.props?.navigation,
            callback: response => {
              if (response) {
                this.props.navigation.navigate('Signup', { social: true, New_User });
              }
              else {
                console.warn('socail else', response)
              }

            }
          })
        }

        // this.props.navigation.navigate('Signup', { New_User });
        console.log(data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    let Dark = this.state.dark
    return (
      <ScrollView style={[styles.container, { backgroundColor: Dark ? colors.black : colors.white }]}>
        <View style={[styles.container, { backgroundColor: Dark ? colors.black : colors.white }]}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 20,
            }}>
            {this.state.dark ?
              <Image style={styles.logo} source={require('../assets/logo_dark.png')} />
              :
              <Image style={styles.logo} source={require('../assets/logo.png')} />
            }
          </View>
          <View style={{ flex: 1 }}>
            <View
              style={{
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#ccc',
                marginHorizontal: '10%',
                marginVertical: 20,
                borderRadius: 20,
                padding: 20,
              }}>
              <Heading style={{ marginBottom: 25, color: Dark ? colors.white : colors.black }}>Log In</Heading>
              <View style={{ width: '100%' }}>
                <View style={{ marginBottom: 10, backgroundColor: colors.white }}>
                  <Input
                    placeholder="Email"
                    style={styles.input}
                    value={this.state.email}
                    onChangeText={email => this.setState({ email })}
                  />
                </View>
                <View style={{ backgroundColor: colors.white }}>

                  <Input
                    placeholder="Password"
                    style={styles.input}
                    value={this.state.password}
                    secureTextEntry
                    onChangeText={password => this.setState({ password })}
                  />
                </View>
              </View>
              <Button
                onPress={this.Login}
                // backgroundColor="primary.100"
                // _light={{ backgroundColor: "#eb6b34" }}
                // _dark={{ backgroundColor: "#c3901c" }}
                style={{
                  width: '95%',
                  borderRadius: 10,
                  marginVertical: 10,
                  height: 45,
                }}>
                Login
              </Button>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('ForgotPassword', { Dark: this.state.dark })
                }
                style={{ padding: 5 }}>
                <Text style={{ color: Dark ? colors.white : colors.black }}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
            <View style={{ alignItems: 'center' }}>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: Dark ? colors.white : colors.black }}>Don't have an account?</Text>
              </View>
              <Button
                onPress={() => this.props.navigation.navigate('Signup', { Dark: this.state.dark })}
                backgroundColor="primary.100"
                bgColor="#fff"
                color="primary.100"
                borderRadius={10}
                borderWidth={1}
                style={{
                  marginVertical: 10,
                  width: '50%',
                  height: 45,
                }}>
                <Text >SIGNUP</Text>
              </Button>
              <Text style={{ color: Dark ? colors.white : colors.black }}>Or Sign Up with</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                {Platform.OS === 'ios' && (
                  <TouchableOpacity
                    style={{ width: 35, height: 35, alignItems: 'center', justifyContent: 'center', marginHorizontal: 5, backgroundColor: "#A2AAAD", borderRadius: 100, padding: 5 }}

                    //style={{width: 35, height: 35,marginTop: -5,marginRight:8}}
                    onPress={this.onPressAppleSignIn}>
                    {/* <Image
                            resizeMode="contain"
                            source={require('../assets/apple_logo.png')}
                            style={{
                              width: 40,
                              height: 40,
                            }}
                          /> */}
                    <FontAwesome
                      name={'apple'}
                      size={25}
                      color={'#fff'}
                    />
                  </TouchableOpacity>
                )}

                <IconButton
                  onPress={() => this.onPressFacebookLogin()}
                  icon={
                    <Icon
                      name="facebook"
                      as={MaterialCommunityIcons}
                      color="#3b5998"
                      size={10}
                    />
                  }
                />
                <IconButton
                  onPress={() => this.onPressGoogleSignIn()}
                  icon={
                    <Icon
                      name="google-plus"
                      as={FontAwesome5Pro}
                      color="#DB4437"
                      size={9}
                    />
                  }
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  Login: data => dispatch(AuthMiddleware.Login(data)),
  facebookLogin: payload => dispatch(AuthMiddleware.facebookLogin(payload)),
  appleSignIn: payload => dispatch(AuthMiddleware.appleSignIn(payload)),
  socailLogin: payload => dispatch(AuthMiddleware.socialLogin(payload)),

});

export default connect(null, mapDispatchToProps)(Login);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
  },
  input: {
    width: '95%',
    borderRadius: 10,
    textAlign: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
    elevation: 3,
    borderWidth: 0,
    //height:IS_IOS ? 45 : null
  },
});
