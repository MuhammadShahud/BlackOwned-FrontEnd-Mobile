import { HStack, Icon, Input } from 'native-base';
import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';
import { connect } from 'react-redux';
import { NetworkMiddleware } from '../../redux/middleware/NetworkMiddleware';
import { imgURL } from '../../configs/AxiosConfig';
import { ChatMiddleware } from '../../redux/middleware/ChatMiddleware';
import { colors } from '../../Theme';

class FriendList extends Component {
    state = {
        loader: true,
        search: '',
        getFriendListDataCopy: [],
    };
    componentDidMount() {
        this.props.getAllFriends({
            name: '',

            id: this.props?.user?.user?.id
        })
            .then((data) => data ? this.setState({ loader: false }) : this.setState({ loader: false }))
            .catch(() => this.setState({ loader: false }));
        // const item = this.props.route.params?.item;
    }

    friendRemove = item => {
        console.warn('stored', item);
        alert('Friend Removed')

        this.props.friendRemove({ friendid: item.id });
        setTimeout(() => {
            this.props.getAllFriends({
                name: '',

                id: this.props?.user?.user?.id
            })
        }, 4000);
    };

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
        this.props.getAllFriends({
            name: '',

            id: this.props?.user?.user?.id
        })
            .then(() => this.setState({ loader: false }))
            .catch(() => this.setState({ loader: false }));
    };


    onChangeSearchText = text => {
        clearTimeout(this.searchTimeout)
        this.searchTimeout = setTimeout(() => {
            this.setState({ loader: true, search: text }, () => {
                console.log(this.state.search, text, 'TEXT====>');
                this.props
                    .getAllFriends({ name: text, id: this.props?.user?.user?.id })
                    .then((data) => data ? this.setState({ loader: false }) : this.setState({ loader: false }))
                    .catch(() => this.setState({ loader: false }));

            });
        }, 500)

    };
    renderUsersList = item => (
        <TouchableOpacity activeOpacity={0.7} style={[styles.ListContainer, { backgroundColor: this.props.Dark ? colors.black : colors.white }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={item.profile_pic ?
                    {
                        uri: imgURL + item.profile_pic
                    } : require('../../assets/user.png')
                } style={[styles.ListImage, { tintColor: !item.profile_pic && this.props.Dark ? colors.white : null }]} />
                <Text style={[styles.ListName, { color: this.props.Dark ? colors.white : colors.black }]}>{item.username}</Text>
            </View>

            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => this.ChatSession(item)} style={styles.ListAddImage}>
                    <Image source={require('../../assets/chatBlue.png')} style={{ width: 30, height: 30 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.friendRemove(item)} style={styles.ListAddImage}>
                    <Ionicons name={'person-remove'} size={30} color={this.props.Dark ? colors.white : colors.black} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
    ChatSession = (item) => {
        this.props.ChatSession({
            id: item?.id,
        })
            .then(request => {
                console.warn('dataaRequest', request);
                this.props.navigation.navigate('Chat', { item: { ...request, fromusername: request.user.username } })
            })
        this.setState({ chatData: this.props.chatSessionData })
    }

    render() {
        const { getFriendsListData, getFriendsListData_list, loader } = this.props;
        console.warn('id', this.props?.user?.user?.id);
        let Dark = this.props.Dark;
        return (
            <View style={{ flex: 1, paddingHorizontal: 10, justifyContent: 'center', backgroundColor: Dark ? colors.black : colors.white }}>
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
                {getFriendsListData_list && getFriendsListData_list?.length ? (
                    <FlatList
                        refreshControl={
                            <RefreshControl
                                refreshing={loader}
                                onRefresh={this.onRefreshServices}
                            />
                        }
                        style={{ backgroundColor: Dark ? colors.black : colors.white }}
                        showsVerticalScrollIndicator={false}
                        data={getFriendsListData_list}
                        renderItem={({ item, index }) => this.renderUsersList(item)}
                        ListFooterComponent={this.renderLoaderMoreButton()}

                    />
                ) : null}
            </View>
        );
    }
}
const mapStateToProps = state => {
    return {
        // role: state.Auth.role,
        user: state.AuthReducer.user,
        Dark: state.AppReducer.darkmode,
        getFriendsListData: state.NetworkReducer.getFriendsListData,
        getFriendsListData_list: state.NetworkReducer.getFriendsListData_list,
        chatSessionData: state.ChatReducer.chatSessionData,
        FriendRemoveData: state.NetworkReducer.FriendRemoveData,
    };
};
const mapDispatchToProps = dispatch => ({
    // Login: data => dispatch(AuthMiddleware.Login(data)),
    // Login: data => dispatch(AuthMiddleware.Login(data)),

    getAllFriends: (payload) =>
        dispatch(NetworkMiddleware.getAllFriends(payload)),

    friendRemove: payload => dispatch(NetworkMiddleware.friendRemove(payload)),
    ChatSession: (payload) =>
        dispatch(ChatMiddleware.ChatSession(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FriendList);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        //   paddingHorizontal: 25,
        backgroundColor: "#fff",
    },

    ListContainer: {
        width: '100%',
        marginVertical: 10,
        elevation: 2,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        // backgroundColor: 'red',
    },
    ListImage: {
        width: 50,
        height: 50,
    },
    teamsListContainer: {
        justifyContent: 'space-between',
    },
    ListName: {
        marginLeft: 10,
        fontSize: 15,
        color: 'black',
        fontWeight: 'bold',
    },
    ListAddImage: {
        marginRight: 5,
    },
    loadMoreContainer: {
        paddingHorizontal: 10,
        backgroundColor: '#1D9CD9',
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 2,
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
})