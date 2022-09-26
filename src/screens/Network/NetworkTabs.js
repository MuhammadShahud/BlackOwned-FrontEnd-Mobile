import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
//import { connect } from 'react-redux';
import FriendList from './FriendList';
import NetworkList from './NetworkList';

const TabNav = createMaterialTopTabNavigator();

const Tabs = ({ role }) => {
    return (
        <TabNav.Navigator
            screenOptions={{
                indicatorStyle: {
                    backgroundColor: "#1872ea",
                    alignSelf: 'center',
                },
            }}
            style={{ backgroundColor: 'red' }}>
            <TabNav.Screen
                name="NetworkList"
                component={NetworkList}
                options={{ tabBarLabel: 'Network' }}

            />
            <TabNav.Screen
                name="FriendList"
                component={FriendList}
                options={{
                    tabBarLabel: 'Friend List',
                }}
            />
        </TabNav.Navigator>
    );
};

const styles = StyleSheet.create({
    scene: {
        flex: 1,
    },
});

// const mapStateToProps = state => {
//   return {
//     role: state.Auth.role,
//   };
// };
// const mapsDispatchToProps = dispatch => {
//   return {};
// };
export default Tabs;
