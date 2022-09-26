import React, { Component } from 'react';
import {
  Avatar,
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  Input,
  ScrollView,
  VStack,
} from 'native-base';
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   Linking,
//   TouchableOpacity,
// } from 'react-native';
import { Image, Dimensions, View, Animated, TouchableOpacity, Text, FlatList, StyleSheet, Linking, Modal, Alert } from 'react-native';

import MyHeader from '../../components/MyHeader';
import Feather from 'react-native-vector-icons/Feather';
import { ItemClick } from 'native-base/lib/typescript/components/composites/Typeahead/useTypeahead/types';
import { imgURL } from '../../configs/AxiosConfig';
import { ChatMiddleware } from '../../redux/middleware/ChatMiddleware';
import { connect } from 'react-redux';
import { colors } from '../../Theme';

class ProductDetails extends Component {
  state = {
    loader: true,
    detailsData: [],
  };

  componentDidMount() {
    let data = this.props.route.params.data;
    this.setState({ detailsData: data });
  }
  OnCallPress = () => {
    const { detailsData } = this.state;
    // console.warn('hello');
    // let phoneNumber = '090078601';
    detailsData?.user?.phone ? (
      Linking.openURL(`tel:${'+1' + detailsData?.user?.phone}`)
    ) : (alert('User Number is not available.'))
  };
  OnEmailPress = () => {
    const { detailsData } = this.state;
    // console.warn('hello email');
    // let email = 'Care@amazon.com';
    detailsData?.user?.email ? (
      Linking.openURL('mailto:' + detailsData?.user?.email)
    ) : (alert('User Email is not available.'))
  };

  ChatSession = () => {
    this.props.ChatSession({
      id: this.state.detailsData?.user_id,
    })
      .then(request => {
        //  console.warn('dataaRequest', request);
        this.props.navigation.navigate('Chat', { item: { ...request, fromusername: request.user.username } })
      })
    // this.setState({ chatData: this.props.chatSessionData })
  }

  render() {
    const { detailsData } = this.state;
    const { user } = this.props;
    let Dark = this.props.Dark;
    console.warn('dadaw', detailsData.user_id);
    console.warn('user', user.user.id);
    return (
      <View style={{ flex: 1, backgroundColor: Dark ? colors.black : colors.white, }}>
        <MyHeader
          back
          notify
          profile
          navigation={this.props.navigation}
          // title={this.props.route.name}
          title={'Product Details'}
          onBackPress={() => this.props.navigation.goBack()}
        />
        <View style={[styles.ListContainer, { backgroundColor: Dark ? colors.black : colors.white, }]}>
          <ScrollView>
            <Image
              source={
                detailsData.image
                  ? {
                    uri: imgURL + detailsData.image,
                  }
                  : require('../../assets/user.png')
              }
              style={styles.ListImage}
              resizeMode="contain"
            />
            <View>
              <Text
                adjustsFontSizeToFit
                numberOfLines={1}
                style={[styles.ListName, { color: Dark ? colors.white : colors.black }]}>
                {detailsData.name}
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <Text style={[styles.sponsorPrice, { color: Dark ? colors.white : colors.black }]}>
                  ${detailsData.discounted_price}
                </Text>
                <Text style={[styles.discountPrice, { color: Dark ? colors.white : colors.black }]}>${detailsData.price}</Text>
              </View>

              <Text style={[styles.ListDescription, { color: Dark ? colors.white : colors.black }]}>
                {detailsData.description}
              </Text>
              <Text style={[styles.ListDescription, { color: Dark ? colors.white : colors.black }]}>
                {detailsData?.category?.name}
              </Text>
            </View>
            {detailsData.user_id == user.user.id ? (null) : (
              <HStack marginY={10} alignSelf={'center'} space={'md'}>
                <Button
                  // onPress={() =>
                  //   this.props.navigation.navigate('Chat', {
                  //     chatHead: detailsData.user,
                  //   })
                  // }
                  onPress={this.ChatSession}
                  flex={1}
                  borderRadius={5}
                  paddingX={0}
                  bgColor="#1872ea">
                  <Heading fontSize="13" color="#fff">
                    Chat
                  </Heading>
                </Button>
                <Button
                  onPress={this.OnEmailPress}
                  flex={1}
                  borderRadius={5}
                  backgroundColor="#1872ea">
                  <Heading fontSize="13" color="#fff">
                    Email
                  </Heading>
                </Button>

                <Button
                  onPress={this.OnCallPress}
                  flex={1}
                  borderRadius={5}
                  backgroundColor="#1872ea">
                  <Heading fontSize="13" color="#fff">
                    Call
                  </Heading>
                </Button>
              </HStack>
            )}
          </ScrollView>
        </View>
      </View>
    );
  }
}
const mapStateToProps = state => {
  return {
    user: state.AuthReducer.user,
    Dark: state.AppReducer.darkmode,
    // user: state.Auth.user,
    getServicesByIdData: state.ServicesReducer.getServicesByIdData,
    getServicesByIdData_list: state.ServicesReducer.getServicesByIdData_list,
    chatSessionData: state.ChatReducer.chatSessionData
  };
};
const mapDispatchToProps = dispatch => ({
  // Login: data => dispatch(AuthMiddleware.Login(data)),
  // Login: data => dispatch(AuthMiddleware.Login(data)),
  Show_Other_User_Post: payload => dispatch(PostMiddleware.Show_Other_User_Post(payload)),
  getAllServiceById: (payload) =>
    dispatch(ServicesMiddleware.getAllServiceById(payload)),
  ChatSession: (payload) =>
    dispatch(ChatMiddleware.ChatSession(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //   paddingHorizontal: 25,
    backgroundColor: '#fff',
  },

  ListContainer: {
    flex: 1,
    width: '93%',
    marginVertical: 10,
    alignSelf: 'center',
    backgroundColor: '#fff',
  },
  ListImage: {
    width: '100%',
    height: 240,
    resizeMode: 'cover',
  },
  teamsListContainer: {
    justifyContent: 'space-between',
  },
  ListName: {
    marginTop: 5,
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  ListDistances: {
    fontSize: 13,
    fontWeight: 'normal',
  },
  ListDescription: {
    marginVertical: 5,
    fontSize: 13,
    fontWeight: 'normal',
    color: 'black',
  },
  ListAddImage: {
    marginRight: 5,
  },
  sponsorPrice: {
    fontSize: 14,
    color: '#1D9CD9',
    alignSelf: 'flex-start',
    // fontWeight: 'bold',
    marginHorizontal: 5,
  },
  discountPrice: {
    fontSize: 14,
    color: '#1D9CD9',
    alignSelf: 'flex-start',
    // fontWeight: 'bold',
    textDecorationLine: 'line-through',
    marginHorizontal: 5,
  },
});
