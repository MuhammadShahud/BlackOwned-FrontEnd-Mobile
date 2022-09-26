import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import ComingSoon from '../screens/ComingSoon';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import ForgotPassword from '../screens/ForgotPassword/ForgotPassword';
import Dashboard from '../screens/Dashboard';


const AuthStackNav = createStackNavigator();

const AuthStack = () => {
  return (
    <AuthStackNav.Navigator screenOptions={{headerShown: false}}>
      <AuthStackNav.Screen name="Login" component={Login} />
      <AuthStackNav.Screen name="Signup" component={Signup} />
      <AuthStackNav.Screen name="ForgotPassword" component={ForgotPassword} />
      <AuthStackNav.Screen
        name="Development In Process"
        component={ComingSoon}
      />
    </AuthStackNav.Navigator>
  );
};

export default AuthStack;
