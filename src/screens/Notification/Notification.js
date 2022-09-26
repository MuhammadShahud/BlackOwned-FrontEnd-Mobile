import { HStack, Icon, Input, Button } from 'native-base';
import React, { Component } from 'react';
import { Image, Dimensions, View, Animated, TouchableOpacity, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';
import MyHeader from '../../components/MyHeader';
import { connect } from 'react-redux';
import { NotificationMiddleware } from '../../redux/middleware/NotificationMiddleware';
import { imgURL } from '../../configs/AxiosConfig';
import { colors } from '../../Theme';

class Notification extends Component {

    state = {
        loader: true,
        search: '',
        getUserNotificationsDataCopy: [],
    };


    friendRequestApproved = item => {
        let { getUserNotificationsDataCopy } = this.state;

        getUserNotificationsDataCopy = this.props.getUserNotificationsData_list;
        let index = getUserNotificationsDataCopy.findIndex(val => val.id === item.id);

        let updateItem = {
            ...item,
            content_action: 'accept',
        };

        getUserNotificationsDataCopy.splice(index, 1, updateItem);
        this.setState({ getUserNotificationsDataCopy });

        this.props.friendRequestApproved({
            content_id: item.content_id,
            notification_id: item.id,
            status: 'accept',
        });
    };

    friendRequestRejected = item => {
        let { getUserNotificationsDataCopy } = this.state;

        getUserNotificationsDataCopy = this.props.getUserNotificationsData_list;
        let index = getUserNotificationsDataCopy.findIndex(val => val.id === item.id);

        let updateItem = {
            ...item,
            content_action: 'reject',
        };

        getUserNotificationsDataCopy.splice(index, 1, updateItem);
        this.setState({ getUserNotificationsDataCopy });

        this.props.friendRequestApproved({
            content_id: item.content_id,
            notification_id: item.id,
            status: 'reject',
        });
    };



    componentDidMount() {
        this.props.getNotificationByUser({ name: '' })
            .then((data) => data ? this.setState({ loader: false }) : this.setState({ loader: false }))
            .catch(() => this.setState({ loader: false }));
    }

    onPressLoadMore = () => {
        this.setState({ loader: true }, () => {
            const { getUserNotificationsData } = this.props;
            this.props
                .getNotificationByUser({ next_page_url: getUserNotificationsData.next_page_url })
                .then((data) => data ? this.setState({ loader: false }) : this.setState({ loader: false }))
                .catch(() => this.setState({ loader: false }));
        });
    };

    renderLoaderMoreButton = () => {
        const { getUserNotificationsData } = this.props;
        const { loader } = this.state;
        // console.warn(getUserNotificationsData.next_page_url);
        return getUserNotificationsData.next_page_url ? (
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
            this.props.getNotificationByUser({ name: '' })
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
                    .getNotificationByUser({ name: text })
                    .then((data) => data ? this.setState({ loader: false }) : this.setState({ loader: false }))
                    .catch(() => this.setState({ loader: false }));
            });
        }, 500)

    };
    renderUsersList = item => (
        <View style={[styles.ListContainer, { backgroundColor: this.props.Dark ? colors.dark : colors.white }]}>
            <Image source={item.profile_pic ?
                {
                    uri: imgURL + item.profile_pic
                } : require('../../assets/user.png')
            } style={styles.ListImage} />
            <View style={{ flex: 1, paddingHorizontal: 10 }}>
                <View style={styles.inviteRecipientNameContainer}>
                    <Text style={[styles.inviteRecipientName, { color: this.props.Dark ? colors.white : colors.black }]}>
                        {item.sendername}
                    </Text>
                    <Text style={[styles.fontSize16, { color: this.props.Dark ? colors.white : colors.black }]}>{item.title}</Text>
                    {/* <Text style={styles.inviteRecipientName}>
                        John Doe
                    </Text> */}
                </View>
                {item?.content_type !== 'message' ? (
                    <View>
                        {item.content_action == 'pending' ? (
                            <View style={styles.flexRow}>

                                <Button
                                    onPress={() => this.friendRequestApproved(item)}
                                    backgroundColor="primary.100"
                                    style={{
                                        width: 80,
                                        borderRadius: 5,
                                        marginHorizontal: 5,
                                        height: 40,
                                        elevation: 5,
                                    }}>
                                    Accept
                                </Button>
                                <Button
                                    onPress={() => this.friendRequestRejected(item)}
                                    backgroundColor="grey"
                                    style={{
                                        width: 80,
                                        borderRadius: 5,
                                        marginHorizontal: 5,
                                        height: 40,
                                        elevation: 5,
                                    }}>
                                    Decline
                                </Button>

                            </View>
                        ) : (
                            <Button
                                // onPress={this.friendRequestRejected}
                                disabled
                                backgroundColor="grey"
                                style={{
                                    // width: 80,
                                    borderRadius: 5,
                                    marginHorizontal: 5,
                                    height: 40,
                                    elevation: 5,
                                }}>
                                {item.content_action == 'accept' ? (<Text style={{ color: '#fff' }}>Accepted</Text>) : (<Text style={{ color: '#fff' }}>Rejected</Text>)}
                            </Button>
                        )}
                    </View>
                ) : (null)}
                <Text style={{ alignSelf: 'flex-end', fontSize: 10, fontWeight: 'bold', color: this.props.Dark ? colors.white : colors.black }}>
                    {new Date(item.created_at).toLocaleDateString()}
                </Text>

            </View>
        </View>
    );

    render() {
        const { getUserNotificationsData, getUserNotificationsData_list, loader } = this.props;
        console.warn('Dataa', getUserNotificationsData_list);
        let Dark = this.props.Dark;
        return (
            <View style={{ flex: 1, backgroundColor: Dark ? colors.black : colors.white }}>
                <MyHeader
                    back notify profile navigation={this.props.navigation}
                    title={this.props.route.name}
                    onBackPress={() => this.props.navigation.goBack()}
                />


                <View style={{ paddingHorizontal: 10, flex: 1 }}>
                    <HStack
                        backgroundColor="#eee"
                        marginTop="2"
                        borderRadius={10}
                        alignItems="center"
                        paddingX="3">
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            {/* <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%' }}>
                                <Icon as={Feather} name="search" size="sm" color="#aaa" />
                                <Input fontSize={14} placeholder="Search By User Name" borderWidth={0} onChangeText={this.onChangeSearchText} />
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
                    {!getUserNotificationsData ? (
                        <ActivityIndicator
                            size={'large'}
                            color={'#1D9CD9'}
                            style={styles.loadMoreContentContainer}
                        />
                    ) : null}
                    {getUserNotificationsData_list && getUserNotificationsData_list?.length ? (
                        <FlatList
                            refreshControl={
                                <RefreshControl
                                    refreshing={loader}
                                    onRefresh={this.onRefreshServices}
                                />
                            }
                            style={styles.flex1}
                            showsVerticalScrollIndicator={false}
                            data={getUserNotificationsData_list}
                            renderItem={({ item, index }) => this.renderUsersList(item)}
                            ListFooterComponent={this.renderLoaderMoreButton()}
                        />
                    ) : null}

                </View>
            </View>
        );
    }
}
const mapStateToProps = state => {
    return {
        // role: state.Auth.role,
        // user: state.Auth.user,
        getUserNotificationsData: state.NotificationReducer.getUserNotificationsData,
        getUserNotificationsData_list: state.NotificationReducer.getUserNotificationsData_list,
        Dark: state.AppReducer.darkmode,
        friendRequestApprovedData: state.NotificationReducer.friendRequestApprovedData,

    };
};
const mapDispatchToProps = dispatch => ({
    // Login: data => dispatch(AuthMiddleware.Login(data)),
    // Login: data => dispatch(AuthMiddleware.Login(data)),

    getNotificationByUser: (payload) =>
        dispatch(NotificationMiddleware.getNotificationByUser(payload)),

    friendRequestApproved: (payload) =>
        dispatch(NotificationMiddleware.friendRequestApproved(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        //   paddingHorizontal: 25,
        backgroundColor: "#fff",
    },
    avatarImage: {
        width: 60,
        height: 60,
    },
    ListContainer: {
        width: '92%',
        alignSelf: 'center',
        marginVertical: 5,
        elevation: 3,
        alignItems: 'center',
        flexDirection: 'row',
        // justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#eee',
    },
    ListImage: {
        width: 100,
        height: 100,
    },
    teamsListContainer: {
        justifyContent: 'space-between',
    },
    ListName: {
        fontSize: 15,
        color: 'black',
        fontWeight: 'bold',
    },
    ListAddImage: {
        marginRight: 5,
    },
    inviteRecipientNameContainer: {
        // flexDirection: 'row',
        // flexWrap: 'wrap',
        // flex: 1,
        // paddingHorizontal: 20,
        // alignItems: 'center',
    },
    inviteRecipientName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    flex1: {
        flex: 1,
    },
    fontSize16: {
        fontSize: 16,
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 15,
    },
    flexRow: { flexDirection: 'row', marginVertical: 5 },
    actionBtnLeft: {
        width: 80,
        height: 40,
        marginRight: 3,
    },
    actionBtnRight: {
        width: 80,
        height: 40,
        marginLeft: 3,
    },
    colorWhite: {
        fontSize: 12,
        color: '#fff',
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
        fontSize: 14,
        marginLeft: 5,
    },
})