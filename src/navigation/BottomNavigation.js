import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'native-base';
import React from 'react';
import { Image, View } from 'react-native';
import ComingSoon from '../screens/ComingSoon';
import Services from '../screens/Services/Services';
import Dashboard from '../screens/Dashboard';
import Settings from '../screens/Settings';
import MainStack from './MainStack';
import Advertise from '../screens/Advertise/Advertise';
import ChatList from '../screens/Chat/ChatList';
import { connect } from 'react-redux';
import AddServices from '../screens/Services/AddServices';
import { colors } from '../Theme';

const BottomTabsNav = createBottomTabNavigator();

const BottomNavIconComp = ({ focused, size, icon, dark }) => (
  //console.warn("dark123", dark),
  <View
    style={{
      height: size + 12,
      width: size + 12,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: focused ? colors.primary_blue : dark ? colors.black : colors.white,
    }}>
    <Image
      style={{ width: size, height: size, tintColor: focused ? colors.white : dark ? colors.white : colors.black }}
      source={icon}
    />
  </View>
);

function BottomNavigation(props) {
  //console.warn("props:", props);
  let Dark = props.Dark
  return (
    <BottomTabsNav.Navigator

      initialRouteName={Dashboard}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { height: 65, paddingBottom: 5, backgroundColor: Dark ? colors.black : colors.white },
        tabBarLabelStyle: {
          fontWeight: 'bold',
          color: '#000',
          marginTop: -5,

        },

      }}>
      <BottomTabsNav.Screen
        name="Home"
        component={Dashboard}
        options={{
          tabBarIcon: props => (
            //console.warn("hhehhehe:", Dark),
            <BottomNavIconComp
              {...props}
              icon={require('../assets/home.png')}
              dark={Dark}
            />
          ),
          tabBarLabel: props => (
            <Text
              fontSize="11"
              fontWeight="medium"
              color={props.focused ? colors.primary_blue : Dark ? colors.white : colors.black}>
              Home
            </Text>
          ),
        }}
      />
      <BottomTabsNav.Screen
        component={props?.user?.user?.role == 'provider' ? AddServices : Services}
        name="Services"
        options={{
          tabBarIcon: props => (
            <BottomNavIconComp
              {...props}
              icon={require('../assets/services.png')}
              dark={Dark}
            />
          ),
          tabBarLabel: props => (
            <Text
              fontSize="11"
              fontWeight="medium"
              color={props.focused ? colors.primary_blue : Dark ? colors.white : colors.black}>
              Services
            </Text>
          ),
        }}
      />
      <BottomTabsNav.Screen
        component={ChatList}
        name="ChatList"
        options={{
          tabBarIcon: props => (
            <BottomNavIconComp
              {...props}
              icon={require('../assets/chat.png')}
              dark={Dark}
            />
          ),
          tabBarLabel: props => (
            <Text
              fontSize="11"
              fontWeight="medium"
              color={props.focused ? colors.primary_blue : Dark ? colors.white : colors.black}>
              Chat
            </Text>
          ),
        }}
      />
      <BottomTabsNav.Screen
        component={Advertise}
        name="Advertise"
        options={{
          tabBarIcon: props => (
            <BottomNavIconComp
              {...props}
              icon={require('../assets/advertise.png')}
              dark={Dark}
            />
          ),
          tabBarLabel: props => (
            <Text
              fontSize="11"
              fontWeight="medium"
              color={props.focused ? colors.primary_blue : Dark ? colors.white : colors.black}>
              Advertise
            </Text>
          ),
        }}
      />
      <BottomTabsNav.Screen
        component={Settings}
        name="Settings"
        options={{
          tabBarIcon: props => (
            <BottomNavIconComp
              {...props}
              icon={require('../assets/settings.png')}
              dark={Dark}
            />
          ),
          tabBarLabel: props => (
            <Text
              fontSize="11"
              fontWeight="medium"
              color={props.focused ? colors.primary_blue : Dark ? "#fff" : colors.black}>
              Settings
            </Text>
          ),
        }}
      />
    </BottomTabsNav.Navigator>
  );
}

const mapStateToProps = state => ({
  user: state.AuthReducer.user,
  Dark: state.AppReducer.darkmode,
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(BottomNavigation);
