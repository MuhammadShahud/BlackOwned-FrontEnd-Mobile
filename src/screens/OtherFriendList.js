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
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import MyHeader from '../components/MyHeader';
import Feather from 'react-native-vector-icons/Feather';
import StarRating from 'react-native-star-rating-widget';
import { connect } from 'react-redux';
import { NetworkMiddleware } from '../redux/middleware/NetworkMiddleware';
import { imgURL } from '../configs/AxiosConfig';
import { colors } from '../Theme';
// import {Colors} from '../../Styles';



// const { width } = Dimensions.get('window');

class OtherFriendList extends Component {
    state = {
        loader: true,
        search: '',
        getFriendListDataCopy: [],
    };
    componentDidMount() {
        // console.warn('FriendListIdddd', this.props.route.params?.item?.id);
        this.props.getAllFriends({
            name: '',
            id: this.props.route.params?.item?.id
        })
    }

    onPressLoadMore = () => {
        this.setState({ loader: true }, () => {
            const { getFriendsListData } = this.props;
            this.props
                .getAllFriends({ next_page_url: getFriendsListData.next_page_url })
                .then((data) => data ? this.setState({ loader: false }) : this.setState({ loader: false }))
                .catch(() => this.setState({ loader: false }));
        });
    };

    renderLoaderMoreButton = () => {
        const { getFriendsListData } = this.props;
        const { loader } = this.state;
        return getFriendsListData.next_page_url ? (
            loader ? (
                <ActivityIndicator
                    size={'large'}
                    color={'#1D9CD9'}
                    style={styles.loadMoreContentContainer}
                />
            ) : (
                <TouchableOpacity
                    style={{ width: 110, alignSelf: 'center', marginVertical: 13 }}
                    onPress={this.onPressLoadMore}>
                    <View style={styles.loadMoreContainer}>
                        <Text style={styles.loadMoreText}>Load more</Text>
                    </View>
                </TouchableOpacity>
            )
        ) : null;
    };

    onRefreshServices = () => {
        this.setState({ loader: true }, () => {
            this.props.getAllFriends({ name: '', id: this.props.route.params?.item?.id })
                .then((data) => data ? this.setState({ loader: false }) : this.setState({ loader: false }))
                .catch(() => this.setState({ loader: false }));
        });
    };


    onChangeSearchText = text => {
        clearTimeout(this.searchTimeout)
        this.searchTimeout = setTimeout(() => {
            this.setState({ loader: true, search: text }, () => {
                // console.log(this.state.search, text, 'TEXT====>');
                this.props
                    .getAllFriends({ name: text, id: this.props.route.params?.item?.id })
                    .then((data) => data ? this.setState({ loader: false }) : this.setState({ loader: false }))
                    .catch(() => this.setState({ loader: false }));
            });
        }, 500)

    };

    renderUsersList = item => (
        // console.warn(item)
        < TouchableOpacity >
            <View style={{ flexDirection: 'row', backgroundColor: '#eee', padding: 10, marginVertical: 5 }}>
                {/* <View> */}
                <Image source={item?.profile_pic ?
                    {
                        uri: imgURL + item?.profile_pic
                    } : require('../assets/user.png')
                } style={styles.profileImg} />
                {/* </View> */}
                <View style={{ paddingHorizontal: 10 }}>
                    <Text style={styles.ProfileName}>{item?.username}</Text>
                    {item?.miles ? <View style={{ flexDirection: 'row' }}>
                        <Image source={require('../assets/blueMarker.png')} style={{ width: 20, height: 20 }} />
                        <Text style={{}}>{item?.miles} miles</Text>
                    </View> : null}
                </View>

                {/* <View style={{}}>
                    <Text style={styles.Profile}>Musician</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <View style={{ alignSelf: 'center' }}>
                            <StarRating
                                rating={4.5}
                                onChange={() => null}
                                color={'#1D9CD9'}
                                starSize={13}
                                maxStars={5}
                                starStyle={{ width: 2 }}
                            />
                        </View>
                        <Text style={{ marginHorizontal: 5, textAlignVertical: 'center' }}>(4.5)</Text>
                    </View>
                </View> */}
            </View>
        </TouchableOpacity >

    );

    render() {
        const { getFriendsListData, getFriendsListData_list, loader } = this.props;
        // console.warn('id', this.props.route.params?.item?.id);
        let Dark = this.props.Dark;
        return (
            <View style={[styles.container, { backgroundColor: Dark ? colors.black : colors.white }]}>
                <MyHeader
                    back notify profile navigation={this.props.navigation}
                    title={'Friends'}
                    onBackPress={() => this.props.navigation.goBack()}
                />
                <ScrollView>
                    <View style={{ paddingHorizontal: 20 }}>
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
                        {!getFriendsListData ? (
                            <ActivityIndicator
                                size={'large'}
                                color={'#1D9CD9'}
                                style={styles.loadMoreContentContainer}
                            />
                        ) : null}
                        {/* <FlatList
                            // numColumns={1}
                            // columnWrapperStyle={styles.teamsListContainer}
                            style={styles.flex1}
                            showsVerticalScrollIndicator={false}
                            data={[
                                { name: 'Alex will', img: require('../assets/1.jpeg') },
                                { name: 'John will', img: require('../assets/2.jpeg') },
                                { name: 'Max will', img: require('../assets/3.jpeg') },
                                { name: 'Marry will', img: require('../assets/4.jpeg') },
                                { name: 'Janifer will', img: require('../assets/3.jpeg') },
                                { name: 'Alex will', img: require('../assets/1.jpeg') },
                                { name: 'John will', img: require('../assets/2.jpeg') },
                                { name: 'Max will', img: require('../assets/5.jpeg') },
                                { name: 'Marry will', img: require('../assets/4.jpeg') },
                                { name: 'Janifer will', img: require('../assets/3.jpeg') },
                            ]}
                            renderItem={({ item }) => this.renderUsersList(item)}
                        /> */}
                        {getFriendsListData_list && getFriendsListData_list?.length ? (
                            <FlatList
                                refreshControl={
                                    <RefreshControl
                                        refreshing={loader}
                                        onRefresh={this.onRefreshServices}
                                    />
                                }
                                style={styles.flex1}
                                showsVerticalScrollIndicator={false}
                                data={getFriendsListData_list}
                                renderItem={({ item, index }) => this.renderUsersList(item)}
                                ListFooterComponent={this.renderLoaderMoreButton()}
                            />
                        ) : null}
                    </View>
                </ScrollView>
            </View>
        );
    }
}
const mapStateToProps = state => {
    return {
        // role: state.Auth.role,
        user: state.AuthReducer.user,
        getFriendsListData: state.NetworkReducer.getFriendsListData,
        getFriendsListData_list: state.NetworkReducer.getFriendsListData_list,
        Dark: state.AppReducer.darkmode,
        FriendRemoveData: state.NetworkReducer.FriendRemoveData,
    };
};
const mapDispatchToProps = dispatch => ({
    // Login: data => dispatch(AuthMiddleware.Login(data)),
    // Login: data => dispatch(AuthMiddleware.Login(data)),

    getAllFriends: (payload) =>
        dispatch(NetworkMiddleware.getAllFriends(payload)),

    friendRemove: payload => dispatch(NetworkMiddleware.friendRemove(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OtherFriendList);
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
    },
    ProfileName: {
        padding: 8,
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
