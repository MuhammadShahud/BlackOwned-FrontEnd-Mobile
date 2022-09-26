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
import React, { Component } from 'react';
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
  PermissionsAndroid,
  RefreshControl,
  Appearance,
  Animated,
  StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import { ServicesMiddleware } from '../redux/middleware/ServicesMiddleware';
import { ListedCompaniesMiddleware } from '../redux/middleware/ListedCompaniesMiddleware';
import MyHeader from '../components/MyHeader';
import Feather from 'react-native-vector-icons/Feather';
import { imgURL } from '../configs/AxiosConfig';
import geolocation from 'react-native-geolocation-service';
import { AppMiddleware } from '../redux/middleware/AppMiddleware';
import { NetworkMiddleware } from '../redux/middleware/NetworkMiddleware';
import { AuthMiddleware } from '../redux/middleware/AuthMiddleware';
import { ChatMiddleware } from '../redux/middleware/ChatMiddleware';
import database, { firebase } from '@react-native-firebase/database';
import { colors, SCREEN_WIDTH } from '../Theme';
import { ActionTypes } from '../redux/action_types';
import Swiper from 'react-native-swiper';
import Entypo from 'react-native-vector-icons/Entypo';
import StarRating from 'react-native-star-rating-widget';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');

class Dashboard extends Component {
  state = {
    online_friends: [],
    selectedButtonTop: null,
    loader: true,
    friends: [],
    // dark: Appearance.getColorScheme() == 'dark' ? true : false,
  };

  async componentDidMount() {
    // Appearance.addChangeListener((prefer) => {
    //   let dark = prefer.colorScheme == "dark";
    //   this.setState({ dark }, () => {
    //     if (this.state.dark) {
    //       console.warn("heheheh");
    //       this.props.Darkmode();
    //     }
    //   });
    // })

    this.requestLocationPermission();
    this.props.getAllServices({ name: '' });
    this.props.getAllListedCompanies({ name: '' });
    this.props.getAllFriends({
      name: '',
    });

    this.props
      .OnlineUsers({
        callback: friends => {
          let f_array = [];
          console.warn(friends);
          friends.forEach((friend, index) => {
            if (friend.is_login == true) {
              f_array.push(friend);
            }
            database()
              .ref('users/' + friend.id)
              .on('value', snapshot => {
                let data = [...this.state.friends];
                if (snapshot.val().online) {
                  let user = this.props.onlineUsersData.find(
                    elemnt => elemnt.id == friend.id,
                  );
                  data.push(user);
                } else data.splice(index, 1);
                this.setState({ friends: data });
              });
          });
          this.setState({ friends: f_array });
        },
      })
      .then(() => this.setState({ loader: false }))
      .catch(() => this.setState({ loader: false }));
  }

  onRefreshServices = () => {
    // this.setState({ loader: true }, () => {
    this.props
      .getAllServices({ name: '' })
      .then(data =>
        data ? this.setState({ loader: false }) : this.setState({ loader: false }),
      )
      .catch(error => this.setState({ loader: false }));

    this.props
      .getAllListedCompanies({ name: '' })
      .then(data =>
        data ? this.setState({ loader: false }) : this.setState({ loader: false }),
      )
      .catch(error => this.setState({ loader: false }));

    this.props
      .OnlineUsers({
        callback: friends => {
          let f_array = [];
          console.warn(friends);
          friends.forEach((friend, index) => {
            database()
              .ref('users/' + friend.id)
              .off('value');
            if (friend.is_login == true) {
              f_array.push(friend);
            }
            database()
              .ref('users/' + friend.id)
              .on('value', snapshot => {
                let data = [...this.state.friends];
                if (snapshot.val().online) {
                  let user = this.props.onlineUsersData.find(
                    elemnt => elemnt.id == friend.id,
                  );
                  data.push(user);
                } else data.splice(index, 1);
                this.setState({ friends: data });
              });
          });
          this.setState({ friends: f_array });
        },
      })
      .then(() => this.setState({ loader: false }))
      .catch(() => this.setState({ loader: false }));
    // });
  };

  requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This App needs to Access your location',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //To Check, If Permission is granted
          /// setGrantedPermission(true)
          this.getCurrentLocation();
        } else {
          alert('Permission Denied');
        }
      } catch (err) {
        alert('err', err);
      }
    }
    // if (Platform.OS === 'ios') {
    //     try {
    //         const granted = await PermissionsAndroid.request(
    //             PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
    //             'title': 'Location Access Required',
    //             'message': 'This App needs to Access your location'
    //         }
    //         )
    //         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //             //To Check, If Permission is granted
    //             /// setGrantedPermission(true)
    //             this.getCurrentLocation();
    //         } else {
    //             alert("Permission Denied");
    //         }
    //     } catch (err) {
    //         alert("err", err);
    //     }
    // }
  };

  getCurrentLocation = () => {
    geolocation.getCurrentPosition(
      position => {
        // console.warn("Region:", position);
        this.UpdateUserLocation(position);
      },
      error => {
        // See error code charts below.
        // console.warn('Code ', error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 },
    );
  };

  UpdateUserLocation = position => {
    // console.warn("Position:", position?.coords?.longitude);
    let lat = position?.coords?.latitude;
    let lng = position?.coords?.longitude;

    let userData = {
      lat,
      lng,
    };
    this.props.UpdateUserLocation({
      userData,
      callback: response => {
        if (response) {
        } else {
          this.setState({ loading: false, refreshing: false });
        }
      },
    });
  };

  onClick = () => {
    this.props.navigation.navigate('Development In Process');
  };

  _renderItem = item => {
    // console.warn('USER:', this.props.user.subscription);
    const { user } = this.props;
    return (
      <TouchableOpacity
        // onPress={() => this.props.navigation.navigate('ServiceDetail', { name: item.name })}
        // onPress={() => this.props.navigation.navigate(user.user.role == 'provider' ? 'AddServices' : 'Services')}
        onPress={() =>
          this.props.navigation.navigate(
            user.user.role == 'provider' ? 'AddServices' : 'ServiceDetail',
            { data: item },
          )
        }
        style={{ marginEnd: 15 }}>
        <Image
          source={
            item.image
              ? {
                uri: imgURL + item.image,
              }
              : require('../assets/user.png')
          }
          style={{ width: width * 0.5, height: 120, borderRadius: 5 }}
        />
        <Heading
          fontSize="lg"
          marginTop="2"
          color={this.props.Dark ? colors.white : colors.black}>
          {item.name}
        </Heading>
      </TouchableOpacity>
    );
  };

  _renderFriend = item => {
    return (
      <TouchableOpacity
        onPress={() => this.ChatSession(item)}
        style={{ marginEnd: 15 }}>
        <Avatar
          size="md"
          source={
            item.profile_pic
              ? {
                uri: imgURL + item.profile_pic,
              }
              : require('../assets/user.png')
          }
        />
        <View
          style={{
            width: 10,
            height: 10,
            top: -10,
            zIndex: 1,
            borderRadius: 360,
            backgroundColor: 'rgb(21,238,86)',
            alignSelf: 'flex-end',
          }}></View>
      </TouchableOpacity>
    );
    // return (
    //   <FriendItem item={item} />
    // );
  };

  ChatSession = item => {
    // console.warn(item.id)
    this.props
      .ChatSession({
        id: item.id,
      })
      .then(request => {
        // console.warn('dataaRequest', request);
        this.props.navigation.navigate('Chat', {
          item: { ...request, fromusername: request.user.username },
        });
      });
  };

  _renderCompany = item => {
    // console.warn("ITEM_COMPANY:", item);
    return (
      <View
        style={[
          styles.ListContainerNew,
          { backgroundColor: this.props.Dark ? colors.dark : colors.white },
        ]}>
        <View style={{ height: 170 }}>
          <Swiper
            index={0}
            autoplayTimeout={5}
            showsPagination={true}
            loop={true}
            autoplay={true}>
            {item?.user_post?.length > 0 ? (
              item?.user_post?.map((v, key) => {
                return (
                  <Animated.View style={styles.MainView}>
                    {v?.type == 1 ? (
                      <Image
                        source={{ uri: imgURL + v.media }}
                        style={{ ...styles.imgPromo }}
                      />
                    ) : (
                      <>
                        <View
                          style={{
                            width: "100%",
                            height: 170,
                            borderRadius: 5,
                            backgroundColor: '#eee',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                          }}>
                          <Image
                            source={{ uri: imgURL + v.thumbnail }}
                            style={{ ...StyleSheet.absoluteFill }}
                          />
                          <Entypo
                            name={'controller-play'}
                            size={40}
                            color={'#eee'}
                          />
                        </View>
                      </>
                    )}
                  </Animated.View>
                );
              })
            ) : (
              <View style={styles.MainView}>
                <Image
                  source={
                    item?.profile_pic
                      ? {
                        uri: imgURL + item?.profile_pic,
                      }
                      : require('../assets/Company.jpg')
                  }
                  style={styles.imgPromo}
                />
              </View>
            )}
          </Swiper>
        </View>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('OtherProfile', { data: item })
          }
          style={{ width: '100%', paddingTop: 10 }}>
          <View>
            {item?.company_name ? (
              <Text
                style={[
                  styles.ProfileName,
                  { color: this.props.Dark ? colors.white : colors.black },
                ]}>
                {item?.company_name}
              </Text>
            ) : null}
          </View>
          {item?.average_rating ? (
            <View style={{ flexDirection: 'row', alignItems: "center", marginVertical: 2 }}>
              <StarRating
                rating={item?.average_rating}
                onChange={() => null}
                // color={'rgb(187,161,79)'}
                color={'#fcc201'}
                starSize={20}
                maxStars={5}
                starStyle={{ width: 10 }}
                style={{ marginStart: -7 }}
              />
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('ProviderRating', { data: item })
                }>
                <Text
                  style={{
                    fontSize: 12,
                    marginHorizontal: 10,
                    textAlignVertical: 'center',
                    color: this.props.Dark ? colors.white : '#1D9CD9',
                    fontWeight: 'bold',
                  }}>
                  {' '}
                  {item?.review_count + ' Reviews'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
          <View style={{ flexDirection: 'row', }}>
            <Entypo name={'address'} size={15} color={'#1872ea'} />
            <Text
              style={{
                fontSize: 12,
                marginLeft: 5,
                color: this.props.Dark ? colors.white : colors.black,
              }}>
              {item?.address}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      // <TouchableOpacity
      //   onPress={() =>
      //     this.props.navigation.navigate('OtherProfile', {data: item})
      //   }>
      //   <HStack marginBottom="2">
      //     <Image
      //       source={
      //         item.profile_pic
      //           ? {
      //               uri: imgURL + item.profile_pic,
      //             }
      //           : require('../assets/Company.jpg')
      //       }
      //       style={{width: 50, height: 45, borderRadius: 2}}
      //     />
      //     <VStack marginLeft={3} justifyContent="center">
      //       <Heading
      //         color={this.props.Dark ? colors.white : colors.black}
      //         fontSize="md">
      //         {item?.company_name}
      //       </Heading>
      //       {item?.miles ? (
      //         <Text
      //           style={{
      //             fontSize: 12,
      //             color: this.props.Dark ? colors.white : colors.black,
      //           }}>
      //           {item?.miles} miles
      //         </Text>
      //       ) : null}
      //     </VStack>
      //   </HStack>
      // </TouchableOpacity>
    );
  };

  render() {
    console.warn('User ==> :', this.props?.user?.user);

    let { selectedButtonTop } = this.state;
    const {
      getServicesData_list,
      getLisetdCompaniesData_list,
      getFriendsListData_list,
      onlineUsersData,
      user,
      loader,
    } = this.props;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: this.props.Dark ? colors.black : colors.white,
        }}>
        <MyHeader
          title={'Home'}
          notify
          profile
          navigation={this.props.navigation}
        />
        <ScrollView
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              colors={['#1c1c1c', '#5c5c5c']}
              tintColor={this.props.Dark ? colors.black : colors.white}
              refreshing={this.state.loader}
              onRefresh={this.onRefreshServices}
            />
          }>
          <View style={{ flex: 1, padding: 15, marginBottom: "10%" }}>
            <Heading
              color={this.props.Dark ? colors.white : colors.black}
              fontSize="xl">
              Hello {this.props?.user?.user?.username},
            </Heading>
            <Heading
              color={this.props.Dark ? colors.white : colors.black}
              fontSize="2xl">
              Welcome Back
            </Heading>
            {/* <HStack
              backgroundColor="#eee"
              marginTop="2"
              borderRadius={10}
              alignItems="center"
              paddingX="3">
              <Icon as={Feather} name="search" size="sm" color="#aaa" />
              <Input fontSize={14} placeholder="Search" borderWidth={0} />
            </HStack> */}
            <HStack flex={1} marginY={3} alignSelf={'center'} space={'md'}>
              <Button
                onPress={() =>
                  this.props.navigation.navigate(
                    user.user.role == 'provider' ? 'Jobs' : 'AddJobCustomer',
                  )
                }
                flex={0.3}
                borderRadius={5}
                paddingX={0}
                borderBottomWidth={2}
                borderBottomColor={colors.primary_blue}
                borderBottomRadius={'none'}
                bgColor={
                  selectedButtonTop == 0
                    ? colors.primary_blue
                    : this.props.Dark
                      ? colors.black
                      : colors.white
                }>
                <Heading
                  fontSize="13"
                  color={this.props.Dark ? colors.white : colors.black}>
                  Jobs
                </Heading>
              </Button>
              <Button
                onPress={() => this.props.navigation.navigate('Marketplace')}
                flex={0.4}
                borderRadius={5}
                borderBottomWidth={selectedButtonTop == 0 ? 2 : 0}
                borderBottomColor={
                  selectedButtonTop == 0 ? colors.primary_blue : null
                }
                borderBottomRadius={'none'}
                bgColor={this.props.Dark ? colors.black : colors.white}>
                <Heading
                  textAlign={'center'}
                  fontSize="13"
                  color={this.props.Dark ? colors.white : colors.black}>
                  Market Place
                </Heading>
              </Button>
              <Button
                onPress={() => this.props.navigation.navigate('Network')}
                flex={0.3}
                borderRadius={5}
                borderBottomWidth={selectedButtonTop == 0 ? 2 : 0}
                borderBottomColor={
                  selectedButtonTop == 0 ? colors.primary_blue : null
                }
                borderBottomRadius={'none'}
                bgColor={this.props.Dark ? colors.black : colors.white}>
                <Heading
                  fontSize="13"
                  color={this.props.Dark ? colors.white : colors.black}>
                  Network
                </Heading>
              </Button>
            </HStack>
            <HStack justifyContent="space-between" marginY="3">
              <Heading fontSize="md" color={colors.primary_blue}>
                Services
              </Heading>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate(
                    user.user.role == 'provider' ? 'AddServices' : 'Services',
                  )
                }>
                <Text
                  style={{
                    color: this.props.Dark ? colors.white : colors.black,
                  }}>
                  View All
                </Text>
              </TouchableOpacity>
            </HStack>
            <FlatList
              data={getServicesData_list?.slice(0, 4)}
              horizontal
              showsHorizontalScrollIndicator={false}
              // initialNumToRender={5}
              maxToRenderPerBatch={5}
              renderItem={({ item, index }) => this._renderItem(item)}
            />
            <Heading
              fontSize="md"
              color={colors.primary_blue}
              marginTop="5"
              marginBottom="3">
              Online Friends:
            </Heading>
            <FlatList
              // data={this.state.online_friends}
              horizontal
              // renderItem={this._renderFriend}
              data={this.state.friends}
              renderItem={({ item, index }) => this._renderFriend(item)}
            // renderItem={({ item, index }) => this._renderFriend(item)}
            />
            <HStack
              justifyContent="space-between"
              marginBottom="3"
              marginTop="5">
              <Heading fontSize="md" color={colors.primary_blue}>
                Local Companies Listed:
              </Heading>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('LocalCompanyList')
                }>
                <Text
                  style={{
                    color: this.props.Dark ? colors.white : colors.black,
                  }}>
                  View All
                </Text>
              </TouchableOpacity>
            </HStack>
            <FlatList
              data={getLisetdCompaniesData_list?.slice(0, 5)}
              renderItem={({ item, index }) => this._renderCompany(item)}
              initialNumToRender={5}
              numColumns={2}
            // renderItem={this._renderCompany}
            />

          </View>
        </ScrollView>
        <Box
          alignItems={'center'}
          justifyItems="center"
          position="absolute"
          bottom="0"
          w="100%"
          backgroundColor={this.props.Dark ? colors.black : colors.white}
        >
          <HStack
            paddingY={3}
            space={'md'}
          >
            <Button
              onPress={() => this.props.navigation.navigate('Banks')}
              size={'sm'}
              borderRadius={10}
              paddingX={0}
              bgColor="#1872ea">
              <Heading fontSize="12" color="#fff" fontWeight="medium">
                Black Owned Banks
              </Heading>
            </Button>
            <Button
              onPress={() => this.props.navigation.navigate('News')}
              size={'sm'}
              borderRadius={10}
              backgroundColor="#ddd">
              <Heading fontSize="12" color="#000" fontWeight="medium">
                Black News
              </Heading>
            </Button>
            <Button
              onPress={() => this.props.navigation.navigate('Seminar')}
              size={'sm'}
              borderRadius={10}
              backgroundColor="#ddd">
              <Heading fontSize="12" color="#000" fontWeight="medium">
                Seminars
              </Heading>
            </Button>
          </HStack>
        </Box>
      </View>
    );
  }
}

// const mapStateToProps = state => ({
//   user: state.AuthReducer.user,
// });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //   paddingHorizontal: 25,
    backgroundColor: '#fff',
  },

  ListContainer: {
    width: '100%',
    marginVertical: 5,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
  },
  ListContainerNew: {
    width: "50%",
    margin: 5,
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 10
  },
  ListImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
    resizeMode: 'cover',
  },
  teamsListContainer: {
    justifyContent: 'space-between',
  },
  ListName: {
    marginTop: 5,
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  ListDistances: {
    fontSize: 13,
    fontWeight: 'normal',
  },
  ListDescription: {
    fontSize: 13,
    fontWeight: 'normal',
    color: 'black',
  },
  ListAddImage: {
    marginRight: 5,
  },
  loadMoreContentContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: 120,
    marginVertical: 20,
  },
  loadMoreText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 12,
    textAlign: 'center',
    width: '100%',
    // marginLeft: 5,
  },
  loadMoreContainer: {
    paddingHorizontal: 10,
    backgroundColor: '#1D9CD9',
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 2,
  },
  teamContainer: {
    marginVertical: 8,
    marginHorizontal: 5,
    backgroundColor: '#eee',
    flex: 1,
    elevation: 2,
    alignItems: 'center',
    //   borderTopEndRadius: 20,
    //   borderTopLeftRadius: 20,
    overflow: 'hidden',
  },
  profileImg: {
    width: 80,
    height: 80,
  },

  PostListContainer: {
    // marginHorizontal:10
  },
  ProfileName: {
    // padding: 8,
    fontSize: 18,
    color: 'black',
    alignSelf: 'flex-start',
    fontWeight: 'bold',
  },
  Profile: {
    padding: 8,
    fontSize: 12,
    // color: 'black',
    alignSelf: 'flex-end',
    fontWeight: '500',
  },
  imgPromo: {
    width: "100%",
    height: 170,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
});

const mapStateToProps = state => {
  return {
    user: state.AuthReducer.user,
    getServicesData: state.ServicesReducer.getServicesData,
    getServicesData_list: state.ServicesReducer.getServicesData_list,
    getLisetdCompaniesData: state.ListedCompaniesReducer.getLisetdCompaniesData,
    getLisetdCompaniesData_list:
      state.ListedCompaniesReducer.getLisetdCompaniesData_list,
    getFriendsListData: state.NetworkReducer.getFriendsListData,
    onlineUsersData: state.AuthReducer.onlineUsersData,
    chatSessionData: state.ChatReducer.chatSessionData,
    Dark: state.AppReducer.darkmode,
  };
};
const mapDispatchToProps = dispatch => ({
  // Login: data => dispatch(AuthMiddleware.Login(data)),
  // Login: data => dispatch(AuthMiddleware.Login(data)),

  getAllServices: payload =>
    dispatch(ServicesMiddleware.getAllServices(payload)),
  getAllListedCompanies: payload =>
    dispatch(ListedCompaniesMiddleware.getAllListedCompanies(payload)),
  UpdateUserLocation: paylaod =>
    dispatch(AppMiddleware.UpdateUserLocation(paylaod)),
  getAllFriends: payload => dispatch(NetworkMiddleware.getAllFriends(payload)),
  OnlineUsers: payload => dispatch(AuthMiddleware.OnlineUsers(payload)),
  ChatSession: payload => dispatch(ChatMiddleware.ChatSession(payload)),
  Darkmode: () => dispatch({ type: ActionTypes.DARK_MODE }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
