import { HStack, Icon, Input } from 'native-base';
import React, { Component } from 'react';
import { Image, Dimensions, View, Animated, TouchableOpacity, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Linking } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MyHeader from '../../components/MyHeader';
import Octicons from 'react-native-vector-icons/Octicons';
import { connect } from 'react-redux';
import { JobsMiddleware } from '../../redux/middleware/JobsMiddleware';
import { imgURL } from '../../configs/AxiosConfig';
import { ChatMiddleware } from '../../redux/middleware/ChatMiddleware';
import { colors } from '../../Theme';
class Jobs extends Component {

    state = {
        loader: true,
        search: '',
    };
    componentDidMount() {
        this.props.getEnrollServiceJobs({ name: '' })
        // .then(() => this.setState({ loader: false }))
        // .catch(() => this.setState({ loader: false }));
    }

    onPressLoadMore = () => {
        this.setState({ loader: true }, () => {
            const { getEnrollServiceData } = this.props;
            this.props
                .getEnrollServiceJobs({ next_page_url: getEnrollServiceData.next_page_url })
                .then(() => this.setState({ loader: false }))
                .catch(() => this.setState({ loader: false }));
        });
    };

    renderLoaderMoreButton = () => {
        const { getEnrollServiceData } = this.props;
        const { loader } = this.state;
        return getEnrollServiceData.next_page_url ? (
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
            this.props.getEnrollServiceJobs({ name: '' })
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
                    .getEnrollServiceJobs({ name: text })
                // .then(() => this.setState({ loader: false }))
                // .catch(() => this.setState({ loader: false }));
            });
        }, 500)

    };
    renderUsersList = item => (
        <TouchableOpacity
            onPress={() => this.props.navigation.navigate('JobsDetails', { data: item })}
            activeOpacity={0.7} style={styles.ListContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={item?.service?.image ?
                    {
                        uri: imgURL + item?.service?.image
                    } : require('../../assets/user.png')
                } style={styles.ListImage} />
                <View style={{ marginLeft: 10, }}>
                    <Text style={styles.ListName}>{item?.username}</Text>
                    <Text>Posted a job for</Text>
                    <Text >{item?.service?.name}</Text>

                </View>
            </View>

            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => this.OnCallPress(item)} style={styles.ListAddImage}>
                    <Image source={require('../../assets/callBlue.png')} style={{ width: 30, height: 30 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.ChatSession(item)} style={styles.ListAddImage}>
                    <Image source={require('../../assets/chatBlue.png')} style={{ width: 30, height: 30 }} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    OnCallPress = (item) => {
        console.warn('itemmm', item);
        // let data = this.props.route.params.data
        // let phoneNumber = '090078601'
        // Linking.openURL(`tel:${data?.phone}`)

        item?.phone ? (
            Linking.openURL(`tel:${'+1' + item?.phone}`)
        ) : (alert('User Number is not available.'))
    }

    ChatSession = (item) => {
        this.props.ChatSession({
            id: item?.user_id,
        })
            .then(request => {
                console.warn('dataaRequest', request);
                this.props.navigation.navigate('Chat', { item: { ...request, fromusername: request.user.username } })
            })
        // this.setState({ chatData: this.props.chatSessionData })
    }

    render() {
        let Dark = this.props.Dark;
        const { getEnrollServiceData, getEnrollServiceData_list, loader } = this.props;
        console.warn('Dataa', getEnrollServiceData_list, getEnrollServiceData);
        return (
            <View style={{ flex: 1, backgroundColor: Dark ? colors.black : colors.white }}>
                <MyHeader
                    back notify profile navigation={this.props.navigation}
                    title={'Job Openings'}
                    onBackPress={() => this.props.navigation.goBack()}
                />
                <View style={{ paddingHorizontal: 20, flex: 1, backgroundColor: Dark ? colors.black : colors.white }}>
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
                                    <Input fontSize={14} placeholder="Search Jobs" borderWidth={0} onChangeText={this.onChangeSearchText} />
                                </View>
                            </View>
                            {/* <TouchableOpacity onPress={() => this.props.navigation.navigate('ServicesFilter')}>
                                <Icon as={Octicons} name="settings" size="sm" color="#aaa" />
                            </TouchableOpacity> */}
                        </View>
                    </HStack>
                    {!getEnrollServiceData ? (
                        <ActivityIndicator
                            size={'large'}
                            color={'#1D9CD9'}
                            style={styles.loadMoreContentContainer}
                        />
                    ) : null}
                    {getEnrollServiceData_list && getEnrollServiceData_list?.length ? (
                        <FlatList
                            refreshControl={
                                <RefreshControl
                                    refreshing={loader}
                                    onRefresh={this.onRefreshServices}
                                />
                            }
                            showsVerticalScrollIndicator={false}
                            data={getEnrollServiceData_list}
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
        Dark: state.AppReducer.darkmode,
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

export default connect(mapStateToProps, mapDispatchToProps)(Jobs);
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
        width: 80,
        height: 80,
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
        fontSize: 16,
        marginLeft: 5,
    },
})