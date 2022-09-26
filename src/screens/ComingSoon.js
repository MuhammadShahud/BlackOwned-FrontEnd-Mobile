import {Heading} from 'native-base';
import React, {Component} from 'react';
import {Image, Dimensions, View, Animated} from 'react-native';
import MyHeader from '../components/MyHeader';

const {width} = Dimensions.get('window');

export default class ComingSoon extends Component {
  rotation = new Animated.Value(0);

  componentDidMount() {
    // Animated.timing(this.rotation, {
    //   toValue: 1,
    //   duration: 1000,
    //   useNativeDriver: true,
    // }).start();
  }

  render() {
    let rotate = this.rotation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
        }}>
        <MyHeader
          back
          title={this.props.route.name}
          onBackPress={() => this.props.navigation.goBack()}
        />
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <Animated.View
            style={{
              transform: [{rotate}],
            }}>
            <Image
              style={{
                width: width * 0.4,
                height: width * 0.4,
                resizeMode: 'contain',
                marginBottom: 30,
                tintColor: '#1872ea',
              }}
              source={require('../assets/process.png')}
            />
          </Animated.View>
          <Heading fontSize="xl">Development in process</Heading>
        </View>
      </View>
    );
  }
}
