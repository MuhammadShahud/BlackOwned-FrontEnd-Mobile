import React, { Component } from 'react';
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
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   Linking,
//   TouchableOpacity,
// } from 'react-native';
import { Image, Dimensions, View, Animated, TouchableOpacity, Text, FlatList, StyleSheet, Linking, Modal, Alert, Platform } from 'react-native';

import MyHeader from '../../components/MyHeader';
import Feather from 'react-native-vector-icons/Feather';
import { ItemClick } from 'native-base/lib/typescript/components/composites/Typeahead/useTypeahead/types';
import { imgURL } from '../../configs/AxiosConfig';
import { ChatMiddleware } from '../../redux/middleware/ChatMiddleware';
import { connect } from 'react-redux';
import { colors } from '../../Theme';
import RenderHTML from 'react-native-render-html';

class SeminarsDetail extends Component {
    state = {
        loader: true,
        detailsData: [],
    };

    openGps = (lat, lng) => {
        var scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';

        var url = scheme + `${lat},${lng}`;
        console.warn("URL", url);
        Linking.openURL(url);
    }

    componentDidMount() {
        let data = this.props.route.params.data;
        this.setState({ detailsData: data });
    }
    //   OnCallPress = () => {
    //     const { detailsData } = this.state;
    //     console.warn('hello');
    //     // let phoneNumber = '090078601';
    //     detailsData?.user?.phone ? (
    //     Linking.openURL(`tel:${detailsData?.user?.phone}`)
    //     ) : (alert('User Number is not available.'))
    //   };
    //   OnEmailPress = () => {
    //     const { detailsData } = this.state;
    //     console.warn('hello email');
    //     // let email = 'Care@amazon.com';
    //     detailsData?.user?.email ? (
    //     Linking.openURL('mailto:' + detailsData?.user?.email)
    //     ) : (alert('User Email is not available.'))
    //   };

    //   ChatSession = () => {
    //     this.props.ChatSession({
    //       id: this.state.detailsData?.user_id,
    //     })
    //       .then(request => {
    //         //  console.warn('dataaRequest', request);
    //         this.props.navigation.navigate('Chat', { item: request })
    //       })
    //     // this.setState({ chatData: this.props.chatSessionData })
    //   }

    render() {
        const { detailsData } = this.state;
        let Dark = this.props.Dark;
        console.warn('dadaw', detailsData);
        return (
            <View style={{ flex: 1, backgroundColor: Dark ? colors.black : colors.white }}>
                <MyHeader
                    back
                    notify
                    profile
                    navigation={this.props.navigation}
                    // title={this.props.route.name}
                    title={'Details'}
                    onBackPress={() => this.props.navigation.goBack()}
                />
                <View style={[styles.ListContainer, { backgroundColor: Dark ? colors.black : colors.white }]}>
                    <ScrollView style={{ backgroundColor: Dark ? colors.black : colors.white }}>

                        <Image
                            source={
                                detailsData.image
                                    ? {
                                        uri: imgURL + detailsData.image,
                                    }
                                    : require('../../assets/user.png')
                            }
                            style={styles.ListImage}
                            resizeMode="contain"
                        />
                        <View>
                            <Text
                                adjustsFontSizeToFit
                                numberOfLines={1}
                                style={[styles.ListName, { color: Dark ? colors.white : colors.black }]}>
                                {detailsData.name}
                            </Text>
                            {/* <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.sponsorPrice}>
                                    Address:
                                </Text>
                                <Text style={styles.discountPrice}>{detailsData.address}</Text>
                            </View> */}
                            <View style={{ flexDirection: 'row', padding: 5 }}>
                                <Text style={[styles.ListNameAddress, { color: Dark ? colors.white : colors.black }]}>Address : </Text>
                                <Text
                                    adjustsFontSizeToFit
                                    style={[styles.ListNameValue, { color: Dark ? colors.white : colors.black }]}>
                                    {detailsData.address}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={() => this.openGps(detailsData?.lat, detailsData?.lng)}>
                                <Text
                                    style={{
                                        marginLeft: '30%',
                                        top: -5,
                                        fontSize: 12,
                                        color: '#1872ea',
                                        textDecorationLine: 'underline'
                                    }}>View Location</Text>
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={[styles.sponsorPrice, { color: Dark ? colors.white : colors.black }]}>
                                    Date:
                                </Text>
                                <Text style={[styles.discountPrice, { color: Dark ? colors.white : colors.black }]}>{new Date(detailsData.date).toLocaleDateString()}</Text>
                            </View>
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={[styles.sponsorPrice, { color: Dark ? colors.white : colors.black }]}>
                                    Description:
                                </Text>
                                <RenderHTML
                                style={styles.ListDescription}
                                contentWidth={'100%'}
                                source={{ html: detailsData?.description }}
                                contentHeight={100}
                                baseStyle={{
                                    color: Dark ? colors.white : colors.black,
                                }}
                            />
                                {/* <Text style={[styles.ListDescription, { color: Dark ? colors.white : colors.black }]}>
                                    {detailsData.description}
                                </Text> */}
                            </View>
                        </View>


                    </ScrollView>
                </View>
            </View>
        );
    }
}
const mapStateToProps = state => {
    return {
        // role: state.Auth.role,
        // user: state.Auth.user,
        Dark: state.AppReducer.darkmode,
        getServicesByIdData: state.ServicesReducer.getServicesByIdData,
        getServicesByIdData_list: state.ServicesReducer.getServicesByIdData_list,
        chatSessionData: state.ChatReducer.chatSessionData
    };
};
const mapDispatchToProps = dispatch => ({
    // Login: data => dispatch(AuthMiddleware.Login(data)),
    // Login: data => dispatch(AuthMiddleware.Login(data)),
    Show_Other_User_Post: payload => dispatch(PostMiddleware.Show_Other_User_Post(payload)),
    getAllServiceById: (payload) =>
        dispatch(ServicesMiddleware.getAllServiceById(payload)),
    ChatSession: (payload) =>
        dispatch(ChatMiddleware.ChatSession(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SeminarsDetail);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        //   paddingHorizontal: 25,
        backgroundColor: '#fff',
    },

    ListContainer: {
        flex: 1,
        width: '93%',
        marginVertical: 10,
        alignSelf: 'center',
        backgroundColor: '#fff',
    },
    ListImage: {
        width: '100%',
        height: 240,
        resizeMode: 'cover',
    },
    teamsListContainer: {
        justifyContent: 'space-between',
    },
    ListName: {
        marginTop: 5,
        fontSize: 18,
        color: 'black',
        fontWeight: 'bold',

    },
    ListNameAddress: {
        width: '30%',
        // marginTop: 5,
        fontSize: 16,
        color: 'black',
        fontWeight: 'bold',
        textAlignVertical: 'center'
    },
    ListDistances: {
        fontSize: 13,
        fontWeight: 'normal',
    },
    ListDescription: {
        marginVertical: 5,
        fontSize: 13,
        fontWeight: 'normal',
        color: 'black',
        marginHorizontal: 5,
    },
    ListAddImage: {
        marginRight: 5,
    },
    sponsorPrice: {
        fontSize: 14,
        color: 'black',
        alignSelf: 'flex-start',
        fontWeight: 'bold',
        marginHorizontal: 5,
    },
    discountPrice: {
        fontSize: 14,
        // color: '#1D9CD9',
        alignSelf: 'flex-start',
        fontWeight: 'bold',
        marginHorizontal: 5,
    },

    ListNameValue: {
        // backgroundColor: 'red',
        width: '60%',
        // marginTop: 5,
        fontSize: 14,
        color: 'black',
        textAlignVertical: 'center'
        // fontWeight: 'bold',
    },
});
