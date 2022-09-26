import { HStack, Icon, Input, Heading, Button } from 'native-base';
import React, { Component } from 'react';
import { Image, Dimensions, View, Animated, TouchableOpacity, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';
import MyHeader from '../../components/MyHeader';
import { connect } from 'react-redux';
import { ListedCompaniesMiddleware } from '../../redux/middleware/ListedCompaniesMiddleware';
import { imgURL } from '../../configs/AxiosConfig';
import { colors, SCREEN_WIDTH } from '../../Theme';
import Entypo from 'react-native-vector-icons/Entypo';
import StarRating from 'react-native-star-rating-widget';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Swiper from 'react-native-swiper';
class LocalCompanyList extends Component {

    state = {
        loader: true,
        search: '',
        currentTime: new Date().getHours(),
    };



    componentDidMount() {
        this.props.getAllListedCompanies({ name: '' })
        console.log(new Date().getHours());
        // .then(() => this.setState({ loader: false }))
        // .catch(() => this.setState({ loader: false }));
    }

    onPressLoadMore = () => {
        this.setState({ loader: true }, () => {
            const { getLisetdCompaniesData } = this.props;
            this.props
                .getAllListedCompanies({ next_page_url: getLisetdCompaniesData.next_page_url })
                .then((data) => data ? this.setState({ loader: false }) : this.setState({ loader: false }))
                .catch(() => this.setState({ loader: false }));
        });
    };

    renderLoaderMoreButton = () => {
        const { getLisetdCompaniesData } = this.props;
        const { loader } = this.state;
        return getLisetdCompaniesData.next_page_url ? (
            // loader ? (
            //     <ActivityIndicator
            //         size={'large'}
            //         color={'#1D9CD9'}
            //         style={styles.loadMoreContentContainer}
            //     />
            // ) : (
            <TouchableOpacity
                style={{ width: 110, alignSelf: 'center', marginVertical: 13 }}
                onPress={this.onPressLoadMore}>
                <View style={styles.loadMoreContainer}>
                    <Text style={styles.loadMoreText}>Load more</Text>
                </View>
            </TouchableOpacity>
            // )
        ) : null;
    };

    onRefreshServices = () => {
        this.setState({ loader: true }, () => {
            this.props.getAllListedCompanies({ name: '' })
                .then((data) => data ? this.setState({ loader: false }) : this.setState({ loader: false }))
                .catch(() => this.setState({ loader: false }));
        });
    };
    // onChangeSearchText = text => {
    //     let { search } = this.state
    //     this.setState({ loader: true, search: text }, () => {
    //         console.log(this.state.search, text, 'TEXT====>');
    //         this.props
    //             .getAllServices({ search })

    //     });
    // };

    onChangeSearchText = text => {
        clearTimeout(this.searchTimeout)
        this.searchTimeout = setTimeout(() => {
            this.setState({ loader: true, search: text }, () => {
                console.log(this.state.search, text, 'TEXT====>');
                this.props
                    .getAllListedCompanies({ name: text })
                    .then((data) => data ? this.setState({ loader: false }) : this.setState({ loader: false }))
                    .catch(() => this.setState({ loader: false }));
            });
        }, 500)

    };

    renderUsersListNew = item => (
        console.warn("ITEM===> ", item),
        <View

            activeOpacity={0.7}
            style={[styles.ListContainerNew, { backgroundColor: this.props.Dark ? colors.dark : colors.white }]}>
            <View style={{ height: 200 }}>
                <Swiper
                    index={0}
                    autoplayTimeout={5}
                    showsPagination={true}
                    loop={true}
                    autoplay={true}
                >
                    {item?.user_post?.length > 0 ?
                        item?.user_post?.map((v, key) => {
                            return (
                                <Animated.View
                                    style={styles.MainView}>
                                    {v?.type == 1 ?
                                        <Image source={{ uri: imgURL + v.media }}
                                            style={{ ...styles.imgPromo, }} />
                                        : <>
                                            <View style={{
                                                width: SCREEN_WIDTH,
                                                height: 200,
                                                borderRadius: 5,
                                                backgroundColor: '#eee',
                                                alignItems: "center",
                                                justifyContent: 'center',
                                                overflow: "hidden"
                                            }}>
                                                <Image source={{ uri: imgURL + v.thumbnail }} style={{ ...StyleSheet.absoluteFill }} />
                                                {/* <FontAwesome name={'play-circle-o'} size={30} color={'#fff'} /> */}
                                                <Entypo name={'controller-play'} size={40} color={"#eee"} />
                                            </View>
                                        </>
                                    }
                                </Animated.View>
                            )
                        }
                        )
                        :
                        <View
                            style={styles.MainView}>
                            <Image
                                source={item?.profile_pic ?
                                    {
                                        uri: imgURL + item?.profile_pic
                                    } : require('../../assets/Company.jpg')} style={styles.imgPromo} />

                        </View>
                    }
                </Swiper>

            </View>
            <TouchableOpacity
                onPress={() => this.props.navigation.navigate('OtherProfile', { data: item })}
                style={{ width: '100%', paddingVertical: 10, }}>
                <View>
                    {item?.company_name ? (
                        <Text style={[styles.ProfileName, { color: this.props.Dark ? colors.white : colors.black }]}>{item?.company_name}</Text>
                    ) : null}
                </View>
                {item?.average_rating ? (
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ alignSelf: 'center' }}>
                            <StarRating
                                rating={item?.average_rating}
                                onChange={() => null}
                                // color={'rgb(187,161,79)'}
                                color={'#fcc201'}
                                starSize={20}
                                maxStars={5}
                                starStyle={{ width: 10, }}
                            />
                        </View>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('ProviderRating', { data: item })}>
                            <Text style={{ fontSize: 16, marginHorizontal: 10, textAlignVertical: 'center', color: this.props.Dark ? colors.white : '#1D9CD9', fontWeight: 'bold' }}> {item?.review_count + ' Reviews'}</Text>
                        </TouchableOpacity>
                    </View>
                ) : null}
                <View style={{ flexDirection: 'row', marginBottom: 3 }}>
                    <Entypo name={'address'} size={15} color={'#1872ea'} />
                    <Text style={{ fontSize: 12, marginLeft: 5, color: this.props.Dark ? colors.white : colors.black }}>{item?.address}</Text>
                </View>
            </TouchableOpacity>


        </View>
    )

    renderUsersList = item => (
        <TouchableOpacity
            onPress={() => this.props.navigation.navigate('OtherProfile', { data: item })}
            activeOpacity={0.7}
            style={[styles.ListContainer, { backgroundColor: this.props.Dark ? colors.dark : colors.white }]}>

            {/* <Image source={item.profile_pic ?
                {
                    uri: imgURL + item.profile_pic
                } : require('../../assets/user.png')
            } style={styles.ListImage} />
            <View style={{ marginHorizontal: 10, width: '70%' }}>
                <Text adjustsFontSizeToFit style={[styles.ListName, { color: this.props.Dark ? colors.white : colors.black }]}>{item.company_name}</Text>
                <Text style={[styles.ListDistances, { color: this.props.Dark ? colors.white : colors.black }]}>2 miles</Text>
            </View> */}
            <View style={{ width: '100%', }}>

                <View style={{ flexDirection: 'row', backgroundColor: this.props.Dark ? colors.dark : '#eee', padding: 15, marginVertical: 5, width: '100%' }}>
                    <View style={{ width: '30%' }}>
                        <Image source={item?.profile_pic ?
                            {
                                uri: imgURL + item?.profile_pic
                            } : require('../../assets/user.png')
                        } style={[styles.profileImg, { tintColor: !item?.profile_pic && this.props.Dark ? colors.white : null }]} />
                    </View>
                    <View style={{ paddingHorizontal: 10, width: '70%' }}>
                        {item?.company_name ? (
                            <Text style={[styles.ProfileName, { color: this.props.Dark ? colors.white : colors.black }]}>{item?.company_name}</Text>
                        ) : null}
                        <Text style={[styles.ProfileName, { color: this.props.Dark ? colors.white : colors.black }]}>{item?.f_name} {item?.l_name}</Text>
                        {item?.average_rating ? (
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ alignSelf: 'center' }}>
                                    <StarRating
                                        rating={item?.average_rating}
                                        onChange={() => null}
                                        color={'#1D9CD9'}
                                        starSize={13}
                                        maxStars={5}
                                        starStyle={{ width: 2 }}
                                    />
                                </View>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('ProviderRating', { data: item })}>
                                    <Text style={{ marginLeft: 5, textAlignVertical: 'center', color: this.props.Dark ? colors.white : '#1D9CD9', fontWeight: 'bold' }}> {item?.review_count + ' Reviews'}</Text>
                                </TouchableOpacity>
                            </View>
                        ) : null}


                    </View>
                    {/* <View style={{ position: 'absolute', bottom: 10, right: 10 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Rating', { provider_id: item?.provider_id, UserImage: item?.profile_pic, UserName: item?.username })}
                            style={{ borderRadius: 6, backgroundColor: '#1872ea', alignItems: 'center', justifyContent: 'center', paddingVertical: 5, paddingHorizontal: 10 }}>
                            <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>Rate</Text>
                        </TouchableOpacity>
                    </View> */}
                    {/* <View>
        
    </View> */}
                </View>

                <View style={{
                    margin: 10, backgroundColor: this.props.Dark ? colors.dark : colors.white, padding: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5,
                }}>
                    <View style={{}}>
                        {/* <View style={{ flexDirection: 'row', marginBottom: 3 }}>
            <Entypo name={'briefcase'} size={15} color={'#1872ea'} />

            <Text style={{ fontSize: 12, marginLeft: 5 }}>{item?.service_name?.name + ' (Professional)'}</Text>
        </View> */}
                        <View style={{ flexDirection: 'row', marginBottom: 3 }}>
                            <Entypo name={'mail'} size={15} color={'#1872ea'} />
                            <Text style={{ fontSize: 12, marginLeft: 5, color: this.props.Dark ? colors.white : colors.black }}>{item?.email}</Text>
                        </View>
                    </View>
                    <View style={{}}>
                        <View style={{ flexDirection: 'row', marginBottom: 3 }}>
                            <FontAwesome name={'phone'} size={15} color={'#1872ea'} />
                            <Text style={{ fontSize: 12, marginLeft: 5, color: this.props.Dark ? colors.white : colors.black }}>{item?.phone}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginBottom: 3 }}>
                            <Entypo name={'address'} size={15} color={'#1872ea'} />
                            <Text style={{ fontSize: 12, marginLeft: 5, color: this.props.Dark ? colors.white : colors.black }}>{item?.address}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginBottom: 3 }}>
                            <Image source={require('../../assets/blueMarker.png')} style={{ width: 15, height: 15 }} />
                            {item?.miles ?
                                <Text style={{ fontSize: 12, marginLeft: 5, color: this.props.Dark ? colors.white : colors.black }}>{item?.miles} miles away</Text>
                                : null}
                        </View>
                        {item?.end_time ?
                            <View>
                                {
                                    new Date().getHours() >= item?.end_time.slice(0, 2) ?
                                        <View style={{ flexDirection: 'row', marginBottom: 3 }}>
                                            <Image source={require('../../assets/blueMarker.png')} style={{ width: 15, height: 15 }} />
                                            <Text style={{ fontSize: 12, marginLeft: 5, color: this.props.Dark ? colors.white : 'red' }}>{'Closed until ' + item?.start_time}</Text>
                                        </View>
                                        :
                                        <View style={{ flexDirection: 'row', marginBottom: 3 }}>
                                            <Image source={require('../../assets/blueMarker.png')} style={{ width: 15, height: 15 }} />
                                            <Text style={{ fontSize: 12, marginLeft: 5, color: this.props.Dark ? colors.white : 'green' }}>{'Currently open'}</Text>
                                        </View>
                                }
                            </View>
                            : null
                        }
                    </View>
                </View>

                {/* <HStack marginY={3} alignSelf={'center'} space={'md'}>
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
                </HStack> */}

            </View>
        </TouchableOpacity>
    );

    render() {
        const { getLisetdCompaniesData, getLisetdCompaniesData_list, loader } = this.props;
        let Dark = this.props.Dark;
        console.warn('Dataa', getLisetdCompaniesData_list);
        return (
            <View style={{ flex: 1, backgroundColor: Dark ? colors.black : colors.white, }}>
                <MyHeader
                    back notify profile navigation={this.props.navigation}
                    title={'Listed Companies'}
                    onBackPress={() => this.props.navigation.goBack()}
                />
                <View style={{ flex: 1, paddingHorizontal: 10 }}>
                    <HStack
                        backgroundColor="#eee"
                        marginTop="2"
                        borderRadius={10}
                        alignItems="center"
                        paddingX="3">
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            {/* <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%' }}>
                                <Icon as={Feather} name="search" size="sm" color="#aaa" />
                                <Input fontSize={14} placeholder="Search" borderWidth={0} onChangeText={this.onChangeSearchText} />
                            </View> */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                                <View style={{ width: '10%' }}>
                                    <Icon as={Feather} name="search" size="sm" color="#aaa" />
                                </View>
                                <View style={{ width: '90%' }}>
                                    <Input fontSize={14} placeholder="Search" borderWidth={0} onChangeText={this.onChangeSearchText} />
                                </View>
                            </View>
                            {/* <TouchableOpacity onPress={() => this.props.navigation.navigate('ServicesFilter')}>
                                <Icon as={Octicons} name="settings" size="sm" color="#aaa" />
                            </TouchableOpacity> */}
                        </View>
                    </HStack>
                    {!getLisetdCompaniesData ? (
                        <ActivityIndicator
                            size={'large'}
                            color={'#1D9CD9'}
                            style={styles.loadMoreContentContainer}
                        />
                    ) : null}
                    {getLisetdCompaniesData_list && getLisetdCompaniesData_list?.length ? (
                        <FlatList
                            refreshControl={
                                <RefreshControl
                                    refreshing={loader}
                                    onRefresh={this.onRefreshServices}
                                />
                            }
                            showsVerticalScrollIndicator={false}
                            data={getLisetdCompaniesData_list}
                            renderItem={({ item, index }) => this.renderUsersListNew(item)}
                            ListFooterComponent={this.renderLoaderMoreButton()}
                        />
                    ) : null}

                </View>
            </View >
        );
    }
}
const mapStateToProps = state => {
    return {
        // role: state.Auth.role,
        // user: state.Auth.user,
        Dark: state.AppReducer.darkmode,
        getLisetdCompaniesData: state.ListedCompaniesReducer.getLisetdCompaniesData,
        getLisetdCompaniesData_list: state.ListedCompaniesReducer.getLisetdCompaniesData_list,
    };
};
const mapDispatchToProps = dispatch => ({
    // Login: data => dispatch(AuthMiddleware.Login(data)),
    // Login: data => dispatch(AuthMiddleware.Login(data)),

    getAllListedCompanies: (payload) =>
        dispatch(ListedCompaniesMiddleware.getAllListedCompanies(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LocalCompanyList);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        //   paddingHorizontal: 25,
        backgroundColor: "#fff",
    },

    ListContainer: {
        width: '100%',
        marginVertical: 5,
        elevation: 2,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
    },
    ListContainerNew: {
        flex: 1,
        width: '100%',
        marginVertical: 5,
        elevation: 2,
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
    },
    ListImage: {
        width: 80,
        height: 80,
        borderRadius: 4,
        resizeMode: 'cover',
    },
    teamsListContainer: {
        justifyContent: 'space-between',
    },
    ListName: {
        marginTop: 5,
        fontSize: 16,
        color: 'black',
        fontWeight: 'bold',
    },
    ListDistances: {
        fontSize: 13,
        fontWeight: 'normal',
    },
    ListDescription: {
        fontSize: 13,
        fontWeight: 'normal',
        color: 'black',
    },
    ListAddImage: {
        marginRight: 5,
    },
    loadMoreContentContainer: {
        justifyContent: 'center',
        alignSelf: 'center',
        width: 120,
        marginVertical: 20,
    },
    loadMoreText: {
        color: '#fff',
        fontWeight: '500',
        fontSize: 12,
        textAlign: 'center',
        width: '100%'
        // marginLeft: 5,
    },
    loadMoreContainer: {
        paddingHorizontal: 10,
        backgroundColor: '#1D9CD9',
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 2,
    },
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
    imgPromo: {
        width: SCREEN_WIDTH,
        height: 200,
        resizeMode: 'cover',
    },

})