import React, { Component } from 'react';
import { View, Dimensions, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import { ArrowBackIcon, Avatar, Heading, HStack, Icon } from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { imgURL } from '../configs/AxiosConfig';
import { colors } from '../Theme';

const { width } = Dimensions.get('window');

class MyHeader extends Component {

  // state = {
  //   profile_pic: this.props.user?.user?.profile_pic
  // }


  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   if (prevProps.user?.user?.profile_pic != this.props.user?.user?.profile_pic) {
  //     this.setState({ profile_pic: this.props.user?.user?.profile_pic })
  //   }
  // }

  render() {
    return (
      <HStack
        backgroundColor={this.props.Dark ? colors.black : colors.white}
        justifyContent="space-between"
        alignItems="center"
        padding={3}>
        {this.props.back ? (
          <HStack>
            <TouchableOpacity onPress={this.props.onBackPress}>
              {/* <ArrowBackIcon /> */}
              <Icon
                as={MaterialCommunityIcons}
                name="arrow-left"
                color={this.props.Dark ? colors.white : colors.black}
                size="7"
              />
            </TouchableOpacity>
            <View style={{ width: width * 0.14 }} />
          </HStack>
        ) : (
          <View style={{ width: width * 0.2 }} />
        )}
        <Heading color={this.props.Dark ? colors.white : colors.black} fontSize={this.props.size ? this.props.size : 'lg'} fontWeight="medium">{this.props.title}</Heading>
        {this.props.notify || this.props.profile ? (
          <HStack space="sm">
            {this.props.notify ? (
              <HStack>
                {!this.props.profile ? (
                  <View style={{ width: width * 0.1 }} />
                ) : null}
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Notification')}>
                  <Icon
                    as={MaterialCommunityIcons}
                    name="bell"
                    color={this.props.Dark ? colors.white : colors.black}
                    size="7"
                  />
                </TouchableOpacity>
              </HStack>
            ) : null}
            {this.props.profile ? (
              <HStack>
                {!this.props.notify ? (
                  <View style={{ width: width * 0.1 }} />
                ) : null}
                <TouchableOpacity onPress={() => { this.props?.user?.user?.role == 'provider' ? this.props.navigation.navigate('UserProfile') : this.props.navigation.navigate('profileSettings') }}>
                  <Image
                    style={{ width: 30, height: 30, borderRadius: 30 }}
                    source={this.props.user?.user?.profile_pic ? { uri: imgURL + this.props.user?.user?.profile_pic } : require('../assets/user.png')}
                  />
                  {/* <Avatar
                    source={this.state.profile_pic ? { uri: imgURL + this.state.profile_pic } : require('../assets/user.png')}
                    size="sm"
                    backgroundColor="#ddd"
                  /> */}
                </TouchableOpacity>
              </HStack>
            ) : null}
          </HStack>
        ) : (
          <View style={{ width: width * 0.2 }} />
        )}
      </HStack>
    );
  }
}

const mapStateToProps = state => ({
  user: state.AuthReducer.user,
  Dark: state.AppReducer.darkmode,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, null)(MyHeader);
