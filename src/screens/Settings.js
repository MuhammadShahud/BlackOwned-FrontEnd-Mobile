import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database';
import { Box, Button, Heading, HStack, Icon, VStack } from 'native-base';
import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  Text, TouchableOpacity, View
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
import MyHeader from '../components/MyHeader';
import { imgURL } from '../configs/AxiosConfig';
import { ActionTypes } from '../redux/action_types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { colors } from '../Theme';

const { width } = Dimensions.get('window');
const iconSize = 20;

class Settings extends Component {
  state = {
    DarkMode: this.props?.Dark,
  }

  Logout = () => {
    console.warn("dasas");
    AsyncStorage.removeItem('@BB-user')
    AsyncStorage.removeItem('@token')
    database().ref("users/" + this.props.user.user.id).set({
      online: false
    })
    this.props.Logout()
  }
  HandleDarkMode = (mode) => {

    if (mode == 0) {
      this.setState({ DarkMode: true })
      AsyncStorage.setItem("BO@DM","true")
      this.props.Darkmode();
    }
    else {
      AsyncStorage.removeItem("BO@DM")
      this.setState({ DarkMode: false })
      this.props.Lightmode();
    }
  }
  render() {
    console.warn("Dark:", this.props?.Dark);
    let Dark = this.props.Dark;
    let { DarkMode } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: Dark ? colors.black : colors.white }}>
        <MyHeader title={'Settings'} image={this.props.user?.user?.profile_pic} notify profile navigation={this.props.navigation} />
        <ScrollView>
          <View style={{ flex: 1, padding: 20 }}>
            <HStack
              padding={5}
              backgroundColor={Dark ? colors.dark : '#eee'}
              space="md"
              alignItems="center">
              <Image
                source={this.props?.user?.user?.profile_pic ?
                  {
                    uri: imgURL + this.props?.user?.user?.profile_pic
                  } : require('../assets/user.png')
                }
                style={{
                  width: width * 0.3,
                  height: width * 0.3,
                  borderRadius: 3,
                }}
              />
              <VStack space="lg">
                <Box>
                  <Heading color={Dark ? colors.white : colors.black} fontSize="lg">{this.props?.user?.user?.f_name} {this.props?.user?.user?.l_name}</Heading>
                  <Text adjustsFontSizeToFit numberOfLines={1} style={{ width: '97%', fontSize: 13, color: Dark ? colors.white : colors.black }}>{this.props?.user?.user?.email}</Text>
                </Box>
                <Button
                  onPress={() => this.props.navigation.navigate('EditProfile')}
                  backgroundColor="primary.100" maxWidth={120}>
                  Edit Profile
                </Button>
              </VStack>
            </HStack>

            <VStack marginTop="5" padding="4" backgroundColor={Dark ? colors.dark : '#eee'} >

              <HStack space="md" alignItems="center" paddingY={3}>
                <MaterialCommunityIcons name={'theme-light-dark'} size={30} color={Dark ? colors.white : colors.black} />
                {Dark ?
                  <Heading color={colors.white} fontSize="lg">Dark Mode</Heading>
                  :
                  <Heading color={colors.black} fontSize="lg">Dark Mode</Heading>
                }
                {!DarkMode ?
                  <TouchableOpacity
                    onPress={() => this.HandleDarkMode(0)}
                    style={{ position: 'absolute', right: 0 }}>
                    <Feather
                      size={32}
                      name={'toggle-left'}
                      color={colors.black}
                    />

                  </TouchableOpacity>
                  :
                  <TouchableOpacity
                    onPress={() => this.HandleDarkMode(1)}
                    style={{ position: 'absolute', right: 0 }}>
                    <Feather
                      size={32}
                      name={'toggle-right'}
                      color={colors.primary_blue}
                    />
                  </TouchableOpacity>
                }

              </HStack>

            </VStack>

            <VStack marginTop="5" padding="5" backgroundColor={Dark ? colors.dark : '#eee'}>
              <TouchableOpacity
                onPress={() => { this.props?.user?.user?.role == 'provider' ? this.props.navigation.navigate('UserProfile') : this.props.navigation.navigate('profileSettings') }
                }>
                <HStack space="md" alignItems="center" paddingY={3}>
                  <Image
                    style={{
                      width: iconSize,
                      height: iconSize,
                      resizeMode: 'contain',
                      tintColor: Dark ? colors.white : colors.black
                    }}
                    source={require('../assets/person.png')}
                  />
                  <Heading color={Dark ? colors.white : colors.black} fontSize="lg">Profile</Heading>
                </HStack>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('SubcriptionPlans')
                }>
                <HStack space="md" alignItems="center" paddingY={3}>
                  <Image
                    style={{
                      width: iconSize,
                      height: iconSize,
                      resizeMode: 'contain',
                      tintColor: Dark ? colors.white : colors.black
                    }}
                    source={require('../assets/subscribe.png')}
                  />
                  <Heading color={Dark ? colors.white : colors.black} fontSize="lg">Subscription Plan</Heading>
                </HStack>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('MyProduct')
                }>
                <HStack space="md" alignItems="center" paddingY={3}>
                  {/* <Image
                    style={{
                      width: iconSize,
                      height: iconSize,
                      resizeMode: 'contain',
                    }}
                    source={require('../assets/subscribe.png')}
                  /> */}
                  <MaterialIcons name={'wallet-giftcard'} size={iconSize} color={Dark ? colors.white : colors.black} />
                  <Heading color={Dark ? colors.white : colors.black} fontSize="lg">My Products</Heading>
                </HStack>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('Invite')
                }>
                <HStack space="md" alignItems="center" paddingY={3}>
                  <Image
                    style={{
                      width: iconSize,
                      height: iconSize,
                      resizeMode: 'contain',
                      tintColor: Dark ? colors.white : colors.black
                    }}
                    source={require('../assets/add_person.png')}
                  />
                  <Heading color={Dark ? colors.white : colors.black} fontSize="lg">Invite</Heading>
                </HStack>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('Payment', { Setting: 'setting' })
                }
              >
                <HStack space="md" alignItems="center" paddingY={3}>
                  {/* <Image
                    style={{
                      width: iconSize,
                      height: iconSize,
                      resizeMode: 'contain',
                    }}
                    source={require('../assets/call.png')}
                  /> */}
                  <MaterialIcons name={'payment'} size={iconSize} color={Dark ? colors.white : colors.black} />
                  <Heading color={Dark ? colors.white : colors.black} fontSize="lg">Payment Method</Heading>
                </HStack>
              </TouchableOpacity>

              {this.props.user?.user?.role == 'provider' ? (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('ProviderRating')
                  }>
                  <HStack space="md" alignItems="center" paddingY={3}>
                    <Icon color={Dark ? colors.white : colors.black} size={'sm'} as={FontAwesome5} name="star-half-alt" />
                    <Heading color={Dark ? colors.white : colors.black} fontSize="lg">Ratings</Heading>
                  </HStack>
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('ContactUs')
                }>
                <HStack space="md" alignItems="center" paddingY={3}>
                  <Image
                    style={{
                      width: iconSize,
                      height: iconSize,
                      resizeMode: 'contain',
                      tintColor: Dark ? colors.white : colors.black
                    }}
                    source={require('../assets/call.png')}
                  />
                  <Heading color={Dark ? colors.white : colors.black} fontSize="lg">Contact Us</Heading>
                </HStack>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('TermsAndConditions')
                }>
                <HStack space="md" alignItems="center" paddingY={3}>
                  <Image
                    style={{
                      width: iconSize,
                      height: iconSize,
                      resizeMode: 'contain',
                      tintColor: Dark ? colors.white : colors.black
                    }}
                    source={require('../assets/read.png')}
                  />
                  <Heading color={Dark ? colors.white : colors.black} fontSize="lg">Terms & Condition</Heading>
                </HStack>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('PrivacyPolicy')
                }>
                <HStack space="md" alignItems="center" paddingY={3}>
                  <Image
                    style={{
                      width: iconSize,
                      height: iconSize,
                      resizeMode: 'contain',
                      tintColor: Dark ? colors.white : colors.black
                    }}
                    source={require('../assets/lock.png')}
                  />
                  <Heading color={Dark ? colors.white : colors.black} fontSize="lg">Privacy Policy</Heading>
                </HStack>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.Logout}>
                <HStack space="md" alignItems="center" paddingY={3}>
                  <Image
                    style={{
                      width: iconSize,
                      height: iconSize,
                      resizeMode: 'contain',
                      tintColor: Dark ? colors.white : colors.black
                    }}
                    source={require('../assets/logout.png')}
                  />
                  <Heading color={Dark ? colors.white : colors.black} fontSize="lg">Logout</Heading>
                </HStack>
              </TouchableOpacity>
            </VStack>
          </View>
        </ScrollView >
      </View >
    );
  }
}

const mapStateToProps = state => ({
  user: state.AuthReducer.user,
  Dark: state.AppReducer.darkmode,
});

const mapDispatchToProps = dispatch => ({
  Logout: () => dispatch({ type: ActionTypes.Logout }),
  Darkmode: () => dispatch({ type: ActionTypes.DARK_MODE }),
  Lightmode: () => dispatch({ type: ActionTypes.LIGHT_MODE }),

});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
