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
import { Image, Dimensions, View, Animated, TouchableOpacity, Text, FlatList, StyleSheet, Linking, Modal, Alert, Platform } from 'react-native';

import MyHeader from '../../components/MyHeader';
import Feather from 'react-native-vector-icons/Feather';
import { ItemClick } from 'native-base/lib/typescript/components/composites/Typeahead/useTypeahead/types';
import { imgURL } from '../../configs/AxiosConfig';
import { ChatMiddleware } from '../../redux/middleware/ChatMiddleware';
import { connect } from 'react-redux';
import { colors } from '../../Theme';

class BanksDetail extends Component {
  state = {
    loader: true,
    detailsData: [],
  };

  componentDidMount() {
    let data = this.props.route.params.data;
    this.setState({ detailsData: data });
  }

  openGps = (lat, lng) => {
    var scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';

    var url = scheme + `${lat},${lng}`;
    console.warn("URL", url);
    Linking.openURL(url);
  }

  render() {
    const { detailsData } = this.state;
    // console.warn('dadaw', detailsData);
    return (
      <View style={{ flex: 1, backgroundColor: this.props.Dark ? colors.black : colors.white }}>
        <MyHeader
          back
          notify
          profile
          navigation={this.props.navigation}
          // title={this.props.route.name}
          title={'Details'}
          onBackPress={() => this.props.navigation.goBack()}
        />
        <View style={[styles.ListContainer, { backgroundColor: this.props.Dark ? colors.black : colors.white }]}>
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
            <View style={{}}>
              <View style={{ flexDirection: 'row', padding: 10 }}>
                <Text style={[styles.ListName, { color: this.props.Dark ? colors.white : colors.black }]}>Name : </Text>
                <Text
                  adjustsFontSizeToFit
                  style={[styles.ListNameValue, { color: this.props.Dark ? colors.white : colors.black }]}>
                  {detailsData.name}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', padding: 10 }}>
                <Text style={[styles.ListName, { color: this.props.Dark ? colors.white : colors.black }]}>Address : </Text>
                <Text
                  adjustsFontSizeToFit
                  style={[styles.ListNameValue, { color: this.props.Dark ? colors.white : colors.black }]}>
                  {detailsData.address}
                </Text>
              </View>
              <TouchableOpacity onPress={() => this.openGps(detailsData?.lat, detailsData?.lng)}>
                <Text
                  style={{
                    marginLeft: '30%',
                    top: -5,
                    fontSize: 12,
                    color: '#1872ea',
                    textDecorationLine: 'underline',

                  }}>View Location</Text>
              </TouchableOpacity>

              <View style={{ flexDirection: 'row', padding: 10 }}>
                <Text style={[styles.ListName, { color: this.props.Dark ? colors.white : colors.black }]}>Branch Code : </Text>
                <Text
                  adjustsFontSizeToFit
                  style={[styles.ListNameValue, { color: this.props.Dark ? colors.white : colors.black }]}>
                  {detailsData.branch_code}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', padding: 10 }}>
                <Text style={[styles.ListName, { color: this.props.Dark ? colors.white : colors.black }]}>Email : </Text>
                <Text
                  adjustsFontSizeToFit
                  style={[styles.ListNameValue, { color: this.props.Dark ? colors.white : colors.black }]}>
                  {detailsData.email}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', padding: 10 }}>
                <Text style={[styles.ListName, { color: this.props.Dark ? colors.white : colors.black }]}>Number : </Text>
                <Text
                  adjustsFontSizeToFit
                  style={[styles.ListNameValue, { color: this.props.Dark ? colors.white : colors.black }]}>
                  {detailsData.number}
                </Text>
              </View>

              {/* <View style={{ flexDirection: 'row', padding: 10 }}>
                <Text style={styles.ListName}>Location : </Text>
                <Text
                  onPress={() => this.openGps(detailsData?.lat, detailsData?.lng)}
                  adjustsFontSizeToFit
                  style={styles.ListNameValue}>
                  {detailsData.number}
                </Text>
              </View> */}


            </View>

            {/* <HStack marginY={10} alignSelf={'center'} space={'md'}>
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
            </HStack> */}
          </ScrollView>
        </View>
      </View>
    );
  }
}
const mapStateToProps = state => {
  return {
    // role: state.Auth.role,
    // user: state.Auth.user,
    getServicesByIdData: state.ServicesReducer.getServicesByIdData,
    getServicesByIdData_list: state.ServicesReducer.getServicesByIdData_list,
    chatSessionData: state.ChatReducer.chatSessionData,
    Dark: state.AppReducer.darkmode,
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

export default connect(mapStateToProps, mapDispatchToProps)(BanksDetail);
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
    width: '30%',
    // marginTop: 5,
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    textAlignVertical: 'center'
  },
  ListNameValue: {
    // backgroundColor: 'red',
    width: '60%',
    // marginTop: 5,
    fontSize: 14,
    color: 'black',
    textAlignVertical: 'center'
    // fontWeight: 'bold',
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
