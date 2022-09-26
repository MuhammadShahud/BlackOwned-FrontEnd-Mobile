import React, { Component, useEffect, useLayoutEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import { View, Text, Platform, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';


export default ({ route, props }) => {
  const navigation = useNavigation()
  const [routes, setRoutes] = useState(null);
  var is_https = route?.params?.url.startsWith('https');
  console.warn('IS_HTTPS: ', is_https);
  useLayoutEffect(() => {
    setTimeout(() => {
      setRoutes(route);
    }, 1000);
    return () => setRoutes(null);
  }, [route]);
  console.warn('route', route, "navigation:", navigation, 'Props:', props);
  return !routes ? (
    null
  ) : (
    <View
      style={{
        flex: 1,
        // backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <WebView
        userAgent="Mozilla/5.0 (Linux; Android 4.1.1; Galaxy Nexus Build/JRO03C) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19"
        onError={err =>
          Alert.alert('Error', err.nativeEvent.description, [
            {
              text: 'Go Back',
              onPress: () => navigation?.navigate('UserProfile'),
              style: 'cancel',
            },
          ])
        }
        originWhitelist={Platform.OS == 'ios' ? ['file://'] : null}
        source={
          !is_https
            ? { uri: 'https://' + routes?.params?.url }
            : { uri: routes?.params?.url }
        }
      // source={{
      //   html: '<h1>back</h1>',
      //   uri: 'https://instagram.com',
      // }}
      />
      <TouchableOpacity
        onPress={() => navigation?.goBack()}
        style={{
          width: '50%',
          height: 50,
          //marginTop: 50,
          backgroundColor: "#1872ea",
          borderRadius: 10,
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
        }}>
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
          Back
        </Text>
      </TouchableOpacity>
    </View>
  );
};
