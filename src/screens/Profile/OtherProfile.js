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
import React, { Component } from 'react';
import { Image, Dimensions, View, Animated, TouchableOpacity, Text, FlatList, StyleSheet, Linking, Modal } from 'react-native';
import MyHeader from '../../components/MyHeader';
import Feather from 'react-native-vector-icons/Feather';
import StarRating from 'react-native-star-rating-widget';
import Entypo from 'react-native-vector-icons/Entypo';
import { imgURL, ScreenHeight } from '../../configs/AxiosConfig';
// import {Colors} from '../../Styles';
import { connect } from 'react-redux';
import { ServicesMiddleware } from '../../redux/middleware/ServicesMiddleware';
import { PostMiddleware } from '../../redux/middleware/PostMiddleware';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import VideoPlayer from 'react-native-video-player';
import { ChatMiddleware } from '../../redux/middleware/ChatMiddleware';
import { colors } from '../../Theme';


const { width } = Dimensions.get('window');

class OtherProfile extends Component {

    state = {
        loader: true,
        search: '',
        Postdata: [],
        modalVisible: false,
        selectedItem: null,
        chatData: [],
    };
    componentDidMount() {
        this.props.getAllServiceById({ providerid: this.props.route.params?.data?.id })
        this.Show_Other_User_Post();
        // .then(() => this.setState({ loader: false }))
        // .catch(() => this.setState({ loader: false }));
        console.warn("GEGKJHJKBNJUN: ", this.props.route.params?.data?.id);
    }

    renderServicesList = item => (

        <View >
            <Text style={{ fontSize: 12, color: this.props.Dark ? colors.white : colors.black }}>{item?.name}</Text>
        </View>

    );
    Show_Other_User_Post = () => {

        this.props.Show_Other_User_Post({
            id: this.props.route.params?.data?.id,
            callback: response => {

                if (response) {
                    console.warn("Other,", response);
                    this.setState({
                        Postdata: response?.data
                    })

                } else {
                    this.setState({ loading: false, refreshing: false, });
                }
            },
        });
    }

    renderPostsList = item => (

        <TouchableOpacity
            onPress={() => {
                this.setState({
                    modalVisible: true,
                    selectedItem: item,
                })
            }}
        >
            {item?.type == 1 ?
                <View style={{ margin: 3 }}>
                    <Image source={{ uri: imgURL + item.media }} style={{ width: 100, height: 100, borderRadius: 5, }} />
                </View>
                :
                <View style={{ margin: 3 }}>
                    <View style={{
                        width: 100,
                        height: 100,
                        borderRadius: 5,
                        backgroundColor: '#eee',
                        alignItems: "center",
                        justifyContent: 'center',
                        overflow: "hidden"
                    }}>
                        <Image source={{ uri: imgURL + item.thumbnail }} style={{ ...StyleSheet.absoluteFill }} />
                        {/* <FontAwesome name={'play-circle-o'} size={30} color={'#fff'} /> */}
                        <Entypo name={'controller-play'} size={35} color={"#eee"} />
                    </View>
                </View>
            }
            {/* {item?.type == 0 ?
                <View style={{ margin: 3 }}>
                    <Image source={{ uri: imgURL + item.media }} style={{ width: 100, height: 100, borderRadius: 5, }} />
                </View>
                :
                <View style={{ margin: 3 }}>
                    <View style={{
                        width: 100,
                        height: 100,
                        borderRadius: 5,
                        backgroundColor: '#eee',
                        alignItems: "center",
                        justifyContent: 'center',
                    }}>
                        <FontAwesome name={'play-circle-o'} size={50} color={'#000'} />
                    </View>
                </View>
            } */}
        </TouchableOpacity>

    );
    OnCallPress = () => {
        let data = this.props.route.params.data
        // let phoneNumber = '090078601'
        // Linking.openURL(`tel:${data?.phone}`)

        data?.phone ? (
            Linking.openURL(`tel:${'+1' + data?.phone}`)
        ) : (alert('User Number is not available.'))
    }

    ChatSession = () => {
        // console.warn(this.props.route.params?.data);
        this.props.ChatSession({
            id: this.props.route.params?.data?.id,
        })
            .then(request => {
                console.warn('dataaRequest', request);
                this.props.navigation.navigate('Chat', { item: { ...request, fromusername: request.user.username, }, Screen: 'otherProfile' })
            })
        // this.setState({ chatData: this.props.chatSessionData })
    }
    // OnEmailPress = () => {
    //     console.warn("hello email");
    //     let email = 'Care@amazon.com'
    //     Linking.openURL('mailto:' + email)
    // }

    render() {
        let data = this.props.route.params.data
        let Dark = this.props.Dark;
        const { getServicesByIdData, chatSessionData } = this.props;
        console.warn('ChatDataa', data,);
        return (
            <View style={[styles.container, { backgroundColor: Dark ? colors.black : colors.white }]}>
                <MyHeader
                    back notify profile navigation={this.props.navigation}
                    title={'Profile'}
                    onBackPress={() => this.props.navigation.goBack()}
                />
                <ScrollView style={{ backgroundColor: Dark ? colors.black : colors.white }}>
                    <View style={{ paddingHorizontal: 20 }}>

                        <View style={{ flexDirection: 'row', backgroundColor: Dark ? colors.dark : '#eee', padding: 15, marginVertical: 5 }}>
                            <View style={{ width: '30%' }}>
                                <Image source={data?.profile_pic ?
                                    {
                                        uri: imgURL + data?.profile_pic
                                    } : require('../../assets/user.png')
                                } style={[styles.profileImg, { tintColor: !data?.profile_pic && Dark ? colors.white : null }]} />
                            </View>
                            <View style={{ paddingHorizontal: 10, width: '70%' }}>
                                {data?.company_name ? (
                                    <Text style={[styles.ProfileName, { color: Dark ? colors.white : colors.black }]}>{data?.company_name}</Text>
                                ) : null}
                                <Text style={[styles.ProfileName, { color: Dark ? colors.white : colors.black }]}>{data?.f_name} {data?.l_name}</Text>
                                {data?.rating ? (
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ alignSelf: 'center' }}>
                                            <StarRating
                                                rating={data?.rating?.rating}
                                                onChange={() => null}
                                                color={'#1D9CD9'}
                                                starSize={13}
                                                maxStars={5}
                                                starStyle={{ width: 2 }}
                                            />
                                        </View>
                                        <Text style={{ marginHorizontal: 5, textAlignVertical: 'center', color: Dark ? colors.white : colors.black }}> ({data?.rating?.rating})</Text>
                                    </View>
                                ) : null}
                                {/* <View style={{ flexDirection: 'row' }}>
                                    <Image source={require('../../assets/blueMarker.png')} style={{ width: 20, height: 20 }} />
                                    <Text style={{ color: Dark ? colors.white : colors.black }}>8 miles away</Text>
                                </View> */}

                            </View>
                            <View style={{ position: 'absolute', bottom: 10, right: 10 }}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('Rating', { provider_id: data?.id, UserImage: data?.profile_pic, UserName: data?.username })}
                                    style={{ borderRadius: 6, backgroundColor: '#1872ea', alignItems: 'center', justifyContent: 'center', paddingVertical: 5, paddingHorizontal: 10 }}>
                                    <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>Rate</Text>
                                </TouchableOpacity>
                            </View>
                            {/* <View>
                                
                            </View> */}
                        </View>

                        <View style={{
                            margin: 10, backgroundColor: Dark ? colors.dark : colors.white, padding: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5,
                        }}>
                            <View style={{}}>
                                {/* <View style={{ flexDirection: 'row', marginBottom: 3 }}>
                                    <Entypo name={'briefcase'} size={15} color={'#1872ea'} />

                                    <Text style={{ fontSize: 12, marginLeft: 5 }}>{data?.service_name?.name + ' (Professional)'}</Text>
                                </View> */}
                                <View style={{ flexDirection: 'row', marginBottom: 3 }}>
                                    <Entypo name={'mail'} size={15} color={'#1872ea'} />
                                    <Text style={{ fontSize: 12, marginLeft: 5, color: Dark ? colors.white : colors.black }}>{data?.email}</Text>
                                </View>
                            </View>
                            <View style={{}}>
                                <View style={{ flexDirection: 'row', marginBottom: 3 }}>
                                    <FontAwesome name={'phone'} size={15} color={'#1872ea'} />
                                    <Text style={{ fontSize: 12, marginLeft: 5, color: Dark ? colors.white : colors.black }}>{data?.phone}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', marginBottom: 3 }}>
                                    <Entypo name={'address'} size={15} color={'#1872ea'} />
                                    <Text style={{ fontSize: 12, marginLeft: 5, color: Dark ? colors.white : colors.black }}>{data?.address}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={{
                            margin: 10, backgroundColor: Dark ? colors.dark : colors.white, padding: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5,
                        }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 14, fontWeight: 'bold', color: Dark ? colors.white : colors.black }}>Services</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <FlatList
                                    numColumns={3}
                                    columnWrapperStyle={styles.teamsListContainer}
                                    style={styles.flex1}
                                    showsVerticalScrollIndicator={false}
                                    data={getServicesByIdData}
                                    renderItem={({ item }) => this.renderServicesList(item)}
                                />
                            </View>
                        </View>

                        <HStack marginY={3} alignSelf={'center'} space={'md'}>
                            <Button
                                onPress={this.OnCallPress}
                                flex={1}
                                borderRadius={5}
                                paddingX={0}
                                bgColor="#1872ea">
                                <Heading fontSize="13" color="#fff">
                                    Call
                                </Heading>
                            </Button>
                            <Button
                                onPress={this.ChatSession}
                                flex={1}
                                borderRadius={5}
                                backgroundColor="#1872ea">
                                <Heading fontSize="13" color="#fff">
                                    Chat
                                </Heading>
                            </Button>
                            <Button
                                onPress={() => this.props.navigation.navigate('OtherFriendList', { item: data })}
                                flex={1}
                                borderRadius={5}
                                backgroundColor="#1872ea">
                                <Heading fontSize="13" color="#fff">
                                    Friend List
                                </Heading>
                            </Button>
                        </HStack>
                        <FlatList
                            numColumns={3}
                            columnWrapperStyle={styles.PostListContainer}
                            style={styles.flex1}
                            showsVerticalScrollIndicator={false}
                            data={this.state.Postdata}
                            renderItem={({ item }) => this.renderPostsList(item)}
                        />
                    </View>
                </ScrollView>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setState({ modalVisible: false });
                    }}

                >
                    <View style={{
                        // marginTop: 100,
                        height: ScreenHeight - 20,
                        width: '100%',
                        backgroundColor: '#000',
                        alignSelf: 'center',
                        borderRadius: 6,

                    }}>
                        <TouchableOpacity
                            onPress={() => this.setState({ modalVisible: false })}
                            style={{
                                marginTop: 20,
                                right: 20,
                                position: 'absolute',
                                alignSelf: 'flex-end',
                                zIndex: 1,
                            }}>
                            <AntDesign name={'closecircle'} size={25} color={"#1872ea"} />
                        </TouchableOpacity>
                        {this.state?.selectedItem?.type == 1 ?
                            <Image source={{ uri: imgURL + this.state?.selectedItem?.media }}
                                style={{
                                    height: 600,
                                    width: '96%',
                                    borderRadius: 4,
                                    resizeMode: 'contain',
                                    alignSelf: 'center',
                                    justifyContent: 'center'
                                }} />
                            :
                            <VideoPlayer
                                video={{ uri: imgURL + this.state?.selectedItem?.media }}
                                //autoplay
                                videoWidth={500}
                                videoHeight={220}
                                resizeMode={'contain'}
                                // paused={!screenIsFocused}
                                style={{
                                    height: ScreenHeight - 20,
                                    width: '100%',
                                    borderRadius: 6,
                                    resizeMode: 'contain',
                                    alignSelf: 'center',
                                    justifyContent: 'center'
                                }}
                                // disableSeek
                                thumbnail={{ uri: imgURL + this.state?.selectedItem?.thumbnail }}
                            />
                            // <VideoPlayer
                            //     video={{ uri: imgURL + this.state?.selectedItem?.media }}
                            //     // video={{ uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }}
                            //     videoWidth={1600}
                            //     videoHeight={900}
                            //     thumbnail={{ uri: imgURL + this.state?.selectedItem?.thumbnail }}

                            // />

                        }
                    </View>

                </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(OtherProfile);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        //   paddingHorizontal: 25,
        backgroundColor: "#fff",
    },

    flex1: { flex: 1 },

    teamContainer: {
        marginVertical: 8,
        marginHorizontal: 5,
        backgroundColor: '#eee',
        flex: 1,
        elevation: 2,
        alignItems: 'center',
        //   borderTopEndRadius: 20,
        //   borderTopLeftRadius: 20,
        overflow: 'hidden',
    },
    profileImg: {
        width: 80,
        height: 80,
    },
    teamsListContainer: {
        justifyContent: 'space-between',
        // paddingVertical:8
    },
    PostListContainer: {
        // marginHorizontal:10
    },
    ProfileName: {
        // padding: 8,
        fontSize: 16,
        color: 'black',
        alignSelf: 'flex-start',
        fontWeight: '500',
    },
    Profile: {
        padding: 8,
        fontSize: 12,
        // color: 'black',
        alignSelf: 'flex-end',
        fontWeight: '500',
    },
});
