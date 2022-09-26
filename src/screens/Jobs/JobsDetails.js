import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import MyHeader from '../../components/MyHeader';
import { imgURL } from '../../configs/AxiosConfig';
import Entypo from 'react-native-vector-icons/Entypo';
import { ChatMiddleware } from '../../redux/middleware/ChatMiddleware';
import { connect } from 'react-redux';
class JobsDetail extends Component {
    state = {
        loader: true,
        detailsData: [],
    };

    componentDidMount() {
        let data = this.props.route.params.data
        this.setState({ detailsData: data })

    }

    OnCallPress = () => {
        const { detailsData } = this.state;
        console.warn('itemmm', detailsData);
        // let data = this.props.route.params.data
        // let phoneNumber = '090078601'
        // Linking.openURL(`tel:${data?.phone}`)

        detailsData?.phone ? (
            Linking.openURL(`tel:${'+1' + detailsData?.phone}`)
        ) : (alert('User Number is not available.'))
    }

    ChatSession = () => {
        const { detailsData } = this.state;
        this.props.ChatSession({
            id: detailsData?.user_id,
        })
            .then(request => {
                console.warn('dataaRequest', request);
                this.props.navigation.navigate('Chat', { item: { ...request, fromusername: request.user.username } })
            })
        // this.setState({ chatData: this.props.chatSessionData })
    }

    render() {
        const { detailsData } = this.state;
        // console.warn(detailsData);
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <MyHeader
                    back notify profile navigation={this.props.navigation}
                    title={'Job Detail'}
                    onBackPress={() => this.props.navigation.goBack()}
                />
                <View style={styles.ListContainer}>

                    <ScrollView>
                        <Image source={detailsData?.service?.image ?
                            {
                                uri: imgURL + detailsData?.service?.image
                            } : require('../../assets/user.png')
                        } style={styles.ListImage} />
                        <View>
                            <Text adjustsFontSizeToFit numberOfLines={1} style={styles.ListName}>{detailsData?.service?.name}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.TextBold}>Date : </Text>
                                <Text style={styles.Text}>{detailsData?.date}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.TextBold}>Time : </Text>
                                <Text style={styles.Text}>{detailsData?.time}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.TextBold}>Location : </Text>
                                <Text style={styles.Text}>{detailsData?.address}</Text>
                            </View>
                            <View style={{ marginTop: 10 }}>
                                <Text style={styles.ListDescription}>{detailsData?.note}</Text>
                            </View>
                        </View>
                    </ScrollView>
                    <View style={styles.bottomButtons}>
                        <TouchableOpacity
                            onPress={this.OnCallPress}
                            activeOpacity={0.7}
                            style={styles.chatBtn}>
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Call</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={this.ChatSession}
                            activeOpacity={0.7}
                            style={styles.callBtn}>
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Chat</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

        );
    }
}
const mapStateToProps = state => {
    return {
        // role: state.Auth.role,
        // user: state.Auth.user,
        getEnrollServiceData: state.JobsReducer.getEnrollServiceData,
        getEnrollServiceData_list: state.JobsReducer.getEnrollServiceData_list,
        chatSessionData: state.ChatReducer.chatSessionData

    };
};
const mapDispatchToProps = dispatch => ({
    // Login: data => dispatch(AuthMiddleware.Login(data)),
    // Login: data => dispatch(AuthMiddleware.Login(data)),

    getEnrollServiceJobs: (payload) =>
        dispatch(JobsMiddleware.getEnrollServiceJobs(payload)),
    ChatSession: (payload) =>
        dispatch(ChatMiddleware.ChatSession(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(JobsDetail);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        //   paddingHorizontal: 25,
        backgroundColor: "#fff",
    },

    ListContainer: {
        flex: 1,
        width: '93%',
        marginVertical: 10,
        alignSelf: 'center',
        backgroundColor: '#fff'
    },
    ListImage: {
        width: '100%',
        height: 240,
        resizeMode: 'cover'
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
    ListDistances: {
        fontSize: 13,
        fontWeight: 'normal',
    },
    ListDescription: {
        marginVertical: 5,
        fontSize: 13,
        fontWeight: 'normal',
        color: 'black',
    },
    TextBold: {
        marginVertical: 5,
        fontSize: 13,
        fontWeight: 'bold',
        color: 'black',
    },
    Text: {
        marginVertical: 5,
        fontSize: 13,
        fontWeight: 'normal',
        color: 'black',
    },
    ListAddImage: {
        marginRight: 5,
    },
    chatBtn: {
        width: '45%',
        height: 50,
        // bottom: 15,
        // right: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#1D9CD9",
        // position: 'absolute',
    },
    callBtn: {
        width: '45%',
        height: 50,
        // bottom: 15,
        // right: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#1D9CD9",
        // position: 'absolute',
    },
    bottomButtons: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 5,
        justifyContent: 'space-around',
        // backgroundColor: 'red',
        width: '100%',
    },
})