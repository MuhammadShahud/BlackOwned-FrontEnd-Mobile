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
import { Image, Modal, Dimensions, View, Animated, TouchableOpacity, Text, FlatList, StyleSheet, RefreshControl, Alert, Platform, Linking } from 'react-native';
import MyHeader from '../../components/MyHeader';
import Feather from 'react-native-vector-icons/Feather';
import StarRating from 'react-native-star-rating-widget';
import Entypo from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { ServicesMiddleware } from '../../redux/middleware/ServicesMiddleware';
import { imgURL, ScreenHeight, ScreenWidth } from '../../configs/AxiosConfig';
import { WebView } from 'react-native-webview';
import { PostMiddleware } from '../../redux/middleware/PostMiddleware';
// import {Colors} from '../../Styles';
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import VideoPlayer from 'react-native-video-player';
import { colors } from '../../Theme';

const { width } = Dimensions.get('window');

class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            Services: [],
            Profile_Image: this.props?.user?.user?.profile_pic ?
                { uri: imgURL + this.props?.user?.user?.profile_pic }
                : require('../../assets/user.png'),
            Posts: this.props.ownPost ? this.props.ownPost : [],
            modalVisible: false,
            selectedItem: [],
            slectForDelete: null,
        };
    }
    componentDidMount() {
        this.Services_Index();
        this.Show_User_Post();
    }
    onRefresh = () => {
        this.Services_Index();
        this.Show_User_Post();
    }
    Services_Index = () => {
        this.props.Service_Index({
            callback: response => {

                if (response) {
                    console.warn("ServiceIndex,", response.data);
                    this.setState({
                        Services: response?.data,
                        refreshing: false,
                    })

                } else {
                    this.setState({ loading: false, refreshing: false, });
                }
            },
        });
    }
    Show_User_Post = () => {
        this.props.Show_User_Post();
    }

    renderServicesList = item => (

        <View >
            <Text style={{ fontSize: 12, color: this.props.Dark ? colors.white : colors.black }}>{item?.services?.name}</Text>
        </View>

    );

    renderPostsList = item => (
        <TouchableOpacity
            onLongPress={() => this.setState({ slectForDelete: item?.id })}
            onPress={() => { this.setState({ modalVisible: true, selectedItem: item, slectForDelete: null }) }}>
            {this.state.slectForDelete == item.id ?
                <TouchableOpacity
                    onPress={() => this.OnDelClick(item?.id)}
                    style={{
                        position: 'absolute',
                        zIndex: 1,
                        backgroundColor: 'red',
                        padding: 3,
                        borderRadius: 4,
                        marginTop: 5,
                        marginLeft: 4,
                    }}>
                    <AntDesign name={'delete'} size={16} color={'#fff'} />
                </TouchableOpacity>
                : null}
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

        </TouchableOpacity>

    );
    OnDelClick = (id) => {
        let userData = { id }
        this.setState({
            slectForDelete: null
        })
        Alert.alert(
            "Waring",
            "Do you want to delete.",
            [
                {
                    text: "No",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Yes", onPress: () => {

                        this.props.Delete_Post({ userData })

                    }
                }
            ]
        );

    }
    SocailButtonClick = (value) => {
        // Linking.openURL('https://google.com')

        // console.warn("hell", value, this.props.user.user.facebook);
        let URL = ''
        if (value == 'facebook') {
            var is_https = URL.startsWith('https');
            if (!is_https) {
                URL = 'https://' + this.props?.user?.user?.facebook
            }
            else {
                URL = this.props?.user?.user?.facebook
            }
            Linking.openURL(URL)
        }
        else if (value == 'youtube') {
            var is_https = URL.startsWith('https');
            if (!is_https) {
                URL = 'https://' + this.props?.user?.user?.youtube
            }
            else {
                URL = this.props?.user?.user?.youtube
            }
            Linking.openURL(URL)
        }
        else if (value == 'instagram') {
            var is_https = URL.startsWith('https');
            if (!is_https) {
                URL = 'https://' + this.props?.user?.user?.instagram
            }
            else {
                URL = this.props?.user?.user?.instagram
            }
            Linking.openURL(URL)
        }
        else { }

    }
    showAlert = () => {
        Alert.alert(
            'Note',
            'please subscribe to the package for uploading videos/ images.',
            [{
                text: 'Cancel',

            },
            {
                text: 'Ok',
                onPress: () => this.props.navigation.navigate('SubcriptionPlans'),
                style: 'cancel'
            }],
            { cancelable: false },
        );
    };

    render() {
        let User = this.props?.user?.user;
        let Dark = this.props.Dark;

        return (
            <View style={[styles.container, { backgroundColor: Dark ? colors.black : colors.white }]}>
                <MyHeader
                    back notify navigation={this.props.navigation}
                    title={'Profile'}
                    onBackPress={() => this.props.navigation.goBack()}
                />
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                        />
                    }
                >
                    <View style={{ paddingHorizontal: 20 }}>

                        <View style={{ flexDirection: 'row', backgroundColor: Dark ? colors.dark : '#eee', padding: 15, marginVertical: 5 }}>
                            <Image source={this.state.Profile_Image} style={styles.profileImg} />
                            <View style={{ paddingHorizontal: 10, justifyContent: 'center' }}>
                                <Text style={[styles.ProfileName, { color: Dark ? colors.white : colors.black }]}>{User?.f_name} {User?.l_name}</Text>
                                {this.props.user.user?.rating ?
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ alignSelf: 'center' }}>
                                            <StarRating
                                                rating={User?.rating?.rating}
                                                onChange={() => null}
                                                color={'#1D9CD9'}
                                                starSize={13}
                                                maxStars={5}
                                                starStyle={{ width: 3 }}
                                            />
                                        </View>
                                        <Text style={{ marginHorizontal: 5, textAlignVertical: 'center', color: Dark ? colors.white : colors.black }}>({User?.rating?.rating})</Text>
                                    </View> : null}
                                {/* <View style={{ flexDirection: 'row' }}>
                                    <Image source={require('../../assets/blueMarker.png')} style={{ width: 18, height: 18 }} />
                                    <Text style={{ color: Dark ? colors.white : colors.black }}>8 miles away</Text>
                                </View> */}


                            </View>
                            {/* <View>
                                <View style={{marginVertical:20}}>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Rating')}
                                        style={{ borderRadius: 10, backgroundColor: '#1872ea',  alignItems: 'center', justifyContent: 'center' ,paddingVertical:5,paddingHorizontal:10}}>
                                        <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>Rate</Text>
                                    </TouchableOpacity>
                                </View>
                            </View> */}
                        </View>

                        <View style={{
                            margin: 10,
                            backgroundColor: Dark ? colors.dark : colors.white,
                            paddingHorizontal: 10,
                            paddingVertical: 15,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2, },
                            shadowOpacity: 0.25,
                            shadowRadius: 4,
                            elevation: 5,
                        }}>
                            <View style={{}}>
                                {User.provider_as == 'business' ?
                                    <>
                                        < View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
                                            <Entypo name={'briefcase'} size={15} color={'#1872ea'} />
                                            <Text style={{ fontSize: 12, marginLeft: 5, color: Dark ? colors.white : colors.black }}>{User?.company_name}</Text>
                                        </View>
                                        < View style={{ alignItems: 'center', flexDirection: 'row', marginBottom: 3 }}>
                                            <FontAwesome name={'address-card'} size={15} color={'#1872ea'} />
                                            <Text style={{ fontSize: 12, marginLeft: 5, color: Dark ? colors.white : colors.black }}>{User?.company_address}</Text>
                                        </View>
                                    </>
                                    : null}
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
                                    <Entypo name={'mail'} size={15} color={'#1872ea'} />
                                    <Text style={{ fontSize: 12, marginLeft: 5, color: Dark ? colors.white : colors.black }}>{User.email}</Text>
                                </View>
                            </View>
                            <View style={{}}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
                                    <Entypo name={'phone'} size={15} color={'#1872ea'} />
                                    <Text style={{ fontSize: 12, marginLeft: 5, color: Dark ? colors.white : colors.black }}>{User.phone}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
                                    <Entypo name={'address'} size={15} color={'#1872ea'} />
                                    <Text style={{ fontSize: 12, marginLeft: 5, color: Dark ? colors.white : colors.black }}>{User.address}</Text>
                                </View>
                            </View>
                        </View>
                        {this.state.Services?.length > 0 ?
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('AddServices')} style={{
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
                                        data={
                                            this.state.Services
                                        }
                                        renderItem={({ item }) => this.renderServicesList(item)}
                                    />
                                </View>
                            </TouchableOpacity>
                            : null}

                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            {this.props?.user?.user?.facebook ?
                                <TouchableOpacity
                                    onPress={() => this.SocailButtonClick('facebook')}
                                    style={styles.socialIconButton}>
                                    <FontAwesome size={35} color={'#0010F3'} name={"facebook-square"} />
                                </TouchableOpacity>
                                : null}
                            {this.props?.user?.user?.youtube ?
                                <TouchableOpacity
                                    onPress={() => this.SocailButtonClick('youtube')}
                                    style={styles.socialIconButton}>
                                    <Entypo size={35} color={'#FF0000'} name="youtube" />
                                </TouchableOpacity>
                                : null}
                            {this.props?.user?.user?.instagram ?
                                <TouchableOpacity
                                    onPress={() => this.SocailButtonClick('instagram')}
                                    style={styles.socialIconButton}>
                                    <Entypo size={35} color={'#652C00'} name="instagram" />
                                </TouchableOpacity>
                                : null}

                        </View>

                        <HStack marginY={3} alignSelf={'center'} space={'md'}>
                            <Button onPress={() => this.props.navigation.navigate('EditProfile')}
                                // onPress={this.onClick}
                                flex={1}
                                borderRadius={5}
                                paddingX={0}
                                bgColor="#1872ea">
                                <Heading fontSize="13" color="#fff">
                                    Edit Profile
                                </Heading>
                            </Button>
                            {/* <Button
                                onPress={this.onClick}
                                flex={1}
                                borderRadius={5}
                                backgroundColor="#1872ea">
                                <Heading fontSize="13" color="#fff">
                                    Chat
                                </Heading>
                            </Button> */}
                            <Button
                                onPress={() => this.props.navigation.navigate('OtherFriendList', { item: User, type: 'userProfile' })}
                                flex={1}
                                borderRadius={5}
                                backgroundColor="#1872ea">
                                <Heading fontSize="13" color="#fff">
                                    Friend List
                                </Heading>
                            </Button>
                        </HStack>
                        <View>
                            <FlatList
                                numColumns={3}
                                columnWrapperStyle={styles.PostListContainer}
                                style={styles.flex1}
                                showsVerticalScrollIndicator={false}
                                data={this.props.ownPost}
                                renderItem={({ item }) => this.renderPostsList(item)}
                            />
                        </View>
                    </View>
                </ScrollView >
                <TouchableOpacity
                    onPress={() =>
                        this.props.user?.user?.is_subscribe ?
                            this.props.navigation.navigate('Upload')
                            :
                            this.showAlert()
                    }
                    activeOpacity={0.7}
                    style={styles.fabBtn}>
                    <Entypo name="plus" size={28} color={'#fff'} />
                </TouchableOpacity>
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
            </View >
        );
    }
}

const mapStateToProps = state => ({
    user: state.AuthReducer.user,
    ownPost: state.PostReducer.ownPost,
    Dark: state.AppReducer.darkmode,
});

const mapDispatchToProps = dispatch => ({
    Service_Index: paylaod => dispatch(ServicesMiddleware.Service_Index(paylaod)),
    Show_User_Post: payload => dispatch(PostMiddleware.Show_User_Post()),
    Delete_Post: paylaod => dispatch(PostMiddleware.Delete_Post(paylaod))
});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        //   paddingHorizontal: 25,
        backgroundColor: "#fff",
    },

    flex1: { flex: 0 },

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
        fontSize: 18,
        color: 'black',
        alignSelf: 'flex-start',
        fontWeight: 'bold',
    },
    Profile: {
        padding: 8,
        fontSize: 12,
        // color: 'black',
        alignSelf: 'flex-end',
        fontWeight: '500',
    },
    fabBtn: {
        width: 56,
        height: 56,
        bottom: 15,
        right: 15,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#1D9CD9",
        position: 'absolute',
    },
    socialIconButton: {
        marginHorizontal: 6,
    },
});
