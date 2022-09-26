import { HStack, Icon, Input, ScrollView } from 'native-base';
import React, { Component } from 'react';
import {
  Image,
  Dimensions,
  View,
  Animated,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MyHeader from '../../components/MyHeader';
import Octicons from 'react-native-vector-icons/Octicons';
import { connect } from 'react-redux';
import { ChatMiddleware } from '../../redux/middleware/ChatMiddleware';
import { imgURL } from '../../configs/AxiosConfig';
import { colors } from '../../Theme';

class ChatList extends Component {
  state = {
    loader: true,
    search: '',
  };
  componentDidMount() {
    this.props.getChatIndex({ name: '' })
      .then((data) => data ? this.setState({ loader: false }) : this.setState({ loader: false }))
      .catch(() => this.setState({ loader: false }));
  }

  onPressLoadMore = () => {
    this.setState({ loader: true }, () => {
      const { getChatsIndexData } = this.props;
      this.props
        .getChatIndex({ next_page_url: getChatsIndexData.next_page_url })
        .then((data) => data ? this.setState({ loader: false }) : this.setState({ loader: false }))
        .catch(() => this.setState({ loader: false }));
    });
  };

  renderLoaderMoreButton = () => {
    const { getChatsIndexData } = this.props;
    const { loader } = this.state;
    return getChatsIndexData.next_page_url ? (
      loader ? (
        <ActivityIndicator
          size={'large'}
          color={'#1D9CD9'}
          style={styles.loadMoreContentContainer}
        />
      ) : (
        <TouchableOpacity
          style={{ width: 110, alignSelf: 'center', marginVertical: 13 }}
          onPress={this.onPressLoadMore}>
          <View style={styles.loadMoreContainer}>
            <Text style={styles.loadMoreText}>Load more</Text>
          </View>
        </TouchableOpacity>
      )
    ) : null;
  };

  onRefreshServices = () => {
    this.setState({ loader: true }, () => {
      this.props.getChatIndex({ name: '' })
        .then((data) => data ? this.setState({ loader: false }) : this.setState({ loader: false }))
        .catch(() => this.setState({ loader: false }));
    });
  };
  // onChangeSearchText = text => {
  //     let { search } = this.state
  //     this.setState({ loader: true, search: text }, () => {
  //         console.log(this.state.search, text, 'TEXT====>');
  //         this.props
  //             .getAllServices({ search })

  //     });
  // };

  onChangeSearchText = text => {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.setState({ loader: true, search: text }, () => {
        console.log(this.state.search, text, 'TEXT====>');
        this.props.getChatIndex({ name: text })
          .then((data) => data ? this.setState({ loader: false }) : this.setState({ loader: false }))
          .catch(() => this.setState({ loader: false }));
      });
    }, 500);
  };
  renderUsersList = item => {
    const { user } = this.props
    console.warn('itemm ======', item);
    let user_to_use = null
    if (user?.user.id == item.from_user_id) {
      user_to_use = item.to_user
    } else {
      user_to_use = item.from_user
    }
    console.log("user_to_useuser_to_useuser_to_use--->", user_to_use)
    return (

      <TouchableOpacity

        onPress={() => this.props.navigation.navigate('Chat', { item })}
        // onPress={() => console.warn(item)}
        activeOpacity={0.7}
        style={styles.ListContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', width: '70%' }}>
          <Image
            source={

              user_to_use?.profile_pic
                ? {
                  uri: imgURL + user_to_use?.profile_pic,
                }
                : require('../../assets/user.png')
            }
            style={styles.ListImage}
          />
          <View style={{ marginLeft: 10 }}>
            <Text style={[styles.ListName, { color: this.props.Dark ? colors.white : colors.black }]}>{user_to_use?.username}</Text>
            <Text numberOfLines={1} style={{ color: this.props.Dark ? colors.white : colors.black }}>
              {item?.last_message?.message}
            </Text>
          </View>
        </View>

        {/* <TouchableOpacity style={styles.ListAddImage}>
                <Ionicons name={'person-add'} size={30} color={'#000'} />
            </TouchableOpacity> */}
        <View style={{ flexDirection: 'row', alignItems: 'center', width: '30%' }}>
          <Text style={{ color: this.props.Dark ? colors.white : colors.black }}>
            {new Date(item?.last_message?.time).toLocaleDateString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { getChatsIndexData, getChatsIndexData_list, loader } = this.props;
    // console.warn('Dataa', getChatsIndexData_list[0]?.message_count);
    return (
      <View style={{ flex: 1, backgroundColor: this.props.Dark ? colors.black : colors.white }}>
        <MyHeader
          back
          notify
          profile
          navigation={this.props.navigation}
          // title={this.props.route.name}
          title={'Chat'}
          onBackPress={() => this.props.navigation.goBack()}
        />
        <ScrollView style={{ flex: 1, paddingHorizontal: 10 }}
          refreshControl={
            <RefreshControl
              colors={["#1c1c1c", "#5c5c5c"]}
              tintColor={this.props.Dark ? "#fff" : "#000"}
              refreshing={this.state.loader}
              onRefresh={this.onRefreshServices}
            />
          }>
          <View style={{}}>
            {/* <HStack
              backgroundColor="#e1e1e1"
              marginTop="2.5"
              marginBottom={'2'}
              borderRadius={10}
              alignItems="center"
              paddingX="3">
              <Icon as={Feather} name="search" size="sm" color="#aaa" />
              <Input fontSize={14} placeholder="Search" borderWidth={0} />
            </HStack> */}
            {/* <View style={{ marginBottom: 15 }}>
              <Text style={{ fontSize: 28, color: 'black', fontWeight: 'bold' }}>
                Chat
              </Text>
              <Text style={{ fontSize: 15 }}>You have {getChatsIndexData_list[0]?.message_count} messages</Text>
            </View> */}
          </View>
          {!getChatsIndexData ? (
            <ActivityIndicator
              size={'large'}
              color={'#1D9CD9'}
              style={styles.loadMoreContentContainer}
            />
          ) : null}
          {getChatsIndexData_list && getChatsIndexData_list?.length ? (
            <FlatList
              // refreshControl={
              //   <RefreshControl
              //     refreshing={loader}
              //     onRefresh={this.onRefreshServices}
              //   />
              // }

              showsVerticalScrollIndicator={false}
              data={getChatsIndexData_list}
              renderItem={({ item, index }) => this.renderUsersList(item)}
              ListFooterComponent={this.renderLoaderMoreButton()}
            />
          ) : null}
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = state => {
  return {
    // role: state.Auth.role,
    Dark: state.AppReducer.darkmode,
    user: state.AuthReducer.user,
    getChatsIndexData: state.ChatReducer.getChatsIndexData,
    getChatsIndexData_list: state.ChatReducer.getChatsIndexData_list,
  };
};
const mapDispatchToProps = dispatch => ({
  // Login: data => dispatch(AuthMiddleware.Login(data)),
  // Login: data => dispatch(AuthMiddleware.Login(data)),

  getChatIndex: payload => dispatch(ChatMiddleware.getChatIndex(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatList);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //   paddingHorizontal: 25,
    backgroundColor: '#fff',
  },

  ListContainer: {
    width: '100%',
    marginVertical: 10,
    elevation: 2,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor: 'red',
  },
  ListImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  teamsListContainer: {
    justifyContent: 'space-between',
  },
  ListName: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold',
  },
  ListAddImage: {
    marginRight: 5,
  },
});
