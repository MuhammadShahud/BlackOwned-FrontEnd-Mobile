import { Avatar } from 'native-base';
import React, { Component } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { imgURL } from '../configs/AxiosConfig';
import database from '@react-native-firebase/database';

export default class FriendItem extends Component {


    checkIfOnline = (id) => {
        database().ref("users/" + id).on("value", () => {

        })
    }

    render() {
        let item = this.props.item;
        return (
            <TouchableOpacity style={{ marginEnd: 15 }}>

                <Avatar size="md" source={item.profile_pic ?
                    {
                        uri: imgURL + item.profile_pic
                    } : require('../assets/user.png')
                } />
                <View style={{ width: 10, height: 10, top: -10, zIndex: 1, borderRadius: 360, backgroundColor: 'rgb(21,238,86)', alignSelf: 'flex-end' }}></View>
            </TouchableOpacity>
        );
    }
}
