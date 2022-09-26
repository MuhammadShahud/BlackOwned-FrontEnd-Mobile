import { HStack, Icon, Input } from 'native-base';
import React, { Component } from 'react';
import { Image, Dimensions, View, Animated, TouchableOpacity, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MyHeader from '../../components/MyHeader';
import Entypo from 'react-native-vector-icons/Entypo';
import Octicons from 'react-native-vector-icons/Octicons';
import { connect } from 'react-redux';
import { JobsMiddleware } from '../../redux/middleware/JobsMiddleware';
import { imgURL } from '../../configs/AxiosConfig';
import { colors } from '../../Theme';

class AddJobCustomer extends Component {

    state = {
        loader: true,
        search: '',
    };
    componentDidMount() {
        this.props.getUserJobs({ name: '' })
        // .then(() => this.setState({ loader: false }))
        // .catch(() => this.setState({ loader: false }));
    }

    onPressLoadMore = () => {
        this.setState({ loader: true }, () => {
            const { getUserJobsData } = this.props;
            this.props
                .getUserJobs({ next_page_url: getUserJobsData.next_page_url })
                .then(() => this.setState({ loader: false }))
                .catch(() => this.setState({ loader: false }));
        });
    };

    renderLoaderMoreButton = () => {
        const { getUserJobsData } = this.props;
        const { loader } = this.state;
        return getUserJobsData.next_page_url ? (
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
            this.props.getUserJobs({ name: '' })
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
                    .getUserJobs({ name: text })
                // .then(() => this.setState({ loader: false }))
                // .catch(() => this.setState({ loader: false }));
            });
        }, 500)

    };
    renderUsersList = item => (
        <TouchableOpacity activeOpacity={0.7} style={styles.ListContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={item?.service?.image ?
                    {
                        uri: imgURL + item?.service?.image
                    } : require('../../assets/user.png')
                } style={[styles.ListImage, { tintColor: !item?.service?.image && this.props.Dark ? colors.white : null }]} />
                <View style={{ marginLeft: 10, }}>
                    <Text style={[styles.ListName, { color: this.props.Dark ? colors.white : colors.black }]}>{item?.service?.name}</Text>
                    <Text style={{ color: this.props.Dark ? colors.white : colors.black }} >{item?.note}</Text>
                    <Text style={{ color: this.props.Dark ? colors.white : colors.black }}>{new Date(item.date).toLocaleDateString()}</Text>
                </View>
            </View>

            {/* <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={styles.ListAddImage}>
                    <Image source={require('../../assets/callBlue.png')} style={{ width: 30, height: 30 }} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.ListAddImage}>
                    <Image source={require('../../assets/chatBlue.png')} style={{ width: 30, height: 30 }} />
                </TouchableOpacity>
            </View> */}
        </TouchableOpacity>
    );

    render() {
        const { getUserJobsData, getUserJobsData_list, loader } = this.props;
        console.warn('Dataa', getUserJobsData_list, getUserJobsData);
        let Dark = this.props.Dark;
        return (
            <View style={{ flex: 1, backgroundColor: Dark ? colors.black : colors.white }}>
                <MyHeader
                    back notify profile navigation={this.props.navigation}
                    title={'My Jobs'}
                    onBackPress={() => this.props.navigation.goBack()}
                />
                <View style={{ paddingHorizontal: 20, flex: 1, }}>
                    {/* <HStack
                        backgroundColor="#eee"
                        marginTop="2"
                        borderRadius={10}
                        alignItems="center"
                        paddingX="3">
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%' }}>
                                <Icon as={Feather} name="search" size="sm" color="#aaa" />
                                <Input fontSize={14} placeholder="Search" borderWidth={0} onChangeText={this.onChangeSearchText} />
                            </View>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('ServicesFilter')}>
                                <Icon as={Octicons} name="settings" size="sm" color="#aaa" />
                            </TouchableOpacity>
                        </View>
                    </HStack> */}
                    {!getUserJobsData ? (
                        <ActivityIndicator
                            size={'large'}
                            color={'#1D9CD9'}
                            style={styles.loadMoreContentContainer}
                        />
                    ) : null}
                    {getUserJobsData_list && getUserJobsData_list?.length ? (
                        <FlatList
                            refreshControl={
                                <RefreshControl
                                    refreshing={loader}
                                    onRefresh={this.onRefreshServices}
                                />
                            }
                            showsVerticalScrollIndicator={false}
                            data={getUserJobsData_list}
                            renderItem={({ item, index }) => this.renderUsersList(item)}
                            ListFooterComponent={this.renderLoaderMoreButton()}
                        />
                    ) : null}

                </View>
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('PostJobCustomer')}
                    activeOpacity={0.7}
                    style={styles.fabBtn}>
                    <Entypo name="plus" size={28} color={'#fff'} />
                </TouchableOpacity>
            </View>
        );
    }
}
const mapStateToProps = state => {
    return {
        // role: state.Auth.role,
        // user: state.Auth.user,
        Dark: state.AppReducer.darkmode,
        getUserJobsData: state.JobsReducer.getUserJobsData,
        getUserJobsData_list: state.JobsReducer.getUserJobsData_list,
    };
};
const mapDispatchToProps = dispatch => ({
    // Login: data => dispatch(AuthMiddleware.Login(data)),
    // Login: data => dispatch(AuthMiddleware.Login(data)),

    getUserJobs: (payload) =>
        dispatch(JobsMiddleware.getUserJobs(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddJobCustomer);
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
})