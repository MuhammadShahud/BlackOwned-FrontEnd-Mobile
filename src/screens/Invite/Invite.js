import { Button, Heading } from 'native-base';
import React, { Component } from 'react';
import { Dimensions, Text, View } from 'react-native';
import MyHeader from '../../components/MyHeader';
import Share from 'react-native-share';
import { connect } from 'react-redux';
import { colors } from '../../Theme';


const { width } = Dimensions.get('window');
const shareTitle = 'Share Link';

class Invite extends Component {

  componentDidMount() {

  }
  onPressInvite = () => {
    Share.open({ title: shareTitle, url: 'https://play.google.com/store/apps/details?id=com.whatsapp' });
  };
  render() {
    let Dark = this.props.Dark;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Dark ? colors.black : colors.white,
        }}>
        <MyHeader
          back notify profile navigation={this.props.navigation}
          title={'Invite'}
          onBackPress={() => this.props.navigation.goBack()}
        />
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>

          <Heading color={Dark ? colors.white : colors.black} fontSize="xl">Send Invite To Your Friends</Heading>
          <Button
            onPress={this.onPressInvite}
            backgroundColor="primary.100"
            bgColor="#fff"
            color="primary.100"
            borderRadius={10}
            borderWidth={1}
            borderColor="primary.100"
            style={{
              marginVertical: 10,
              width: '50%',
              height: 45,
            }}>
            <Text style={{ color: '#1872ea' }}>Invite</Text>
          </Button>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    Dark: state.AppReducer.darkmode,
  };
};
const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(Invite);
