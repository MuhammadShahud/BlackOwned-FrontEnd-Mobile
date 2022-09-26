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
import { Image, Dimensions, View, Animated, TouchableOpacity, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import MyHeader from '../../components/MyHeader';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';
// import {Colors} from '../../Styles';
import { connect } from 'react-redux';
import { ServicesMiddleware } from '../../redux/middleware/ServicesMiddleware';
import { imgURL } from '../../configs/AxiosConfig';
import { colors } from '../../Theme';


const { width } = Dimensions.get('window');

class Services extends Component {

    state = {
        loader: true,
        search: '',
    };
    componentDidMount() {
        this.props.getAllServices({ name: '' })
            .then((data) => data ? this.setState({ loader: false }) : this.setState({ loader: false }))
            .catch((error) => this.setState({ loader: false }));
    }

    onPressLoadMore = () => {
        this.setState({ loader: true }, () => {
            const { getServicesData } = this.props;
            this.props
                .getAllServices({ next_page_url: getServicesData.next_page_url })
                .then((data) => data ? this.setState({ loader: false }) : this.setState({ loader: false }))
                .catch((error) => this.setState({ loader: false }));
        });
    };

    renderLoaderMoreButton = () => {
        const { getServicesData } = this.props;
        const { loader } = this.state;
        return getServicesData.next_page_url ? (
            loader ? (
                <ActivityIndicator
                    size={'large'}
                    color={'#1D9CD9'}
                    style={styles.loadMoreContentContainer}
                />
            ) : (
                <TouchableOpacity
                    style={{ width: '40%', alignSelf: 'center', marginVertical: 13 }}
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
            this.props.getAllServices({ name: '' })
                .then((data) => data ? this.setState({ loader: false }) : this.setState({ loader: false }))
                .catch((error) => this.setState({ loader: false }));
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
                    .getAllServices({ name: text })
                    .then((data) => data ? this.setState({ loader: false }) : this.setState({ loader: false }))
                    .catch((error) => this.setState({ loader: false }));
            });
        }, 500)

    };

    renderUsersList = item => (
        <TouchableOpacity onPress={() => this.props.navigation.navigate('ServiceDetail', { data: item })} activeOpacity={0.7} style={styles.teamContainer}>
            <Image source={item.image ?
                {
                    uri: imgURL + item.image
                } : require('../../assets/user.png')
            } style={styles.teamImage} resizeMode="contain" />
            <Text style={[styles.teamName, { color: this.props.Dark ? colors.white : colors.black }]}>{item.name}</Text>
        </TouchableOpacity>
    );

    render() {
        const { getServicesData, getServicesData_list, loader } = this.props;
        // console.warn('Dataa', getServicesData_list, getServicesData);
        return (
            <ScrollView style={[styles.container, { backgroundColor: this.props.Dark ? colors.black : colors.white }]}
                refreshControl={
                    <RefreshControl
                        colors={["#1c1c1c", "#5c5c5c"]}
                        tintColor="#000"
                        refreshing={this.state.loader}
                        onRefresh={this.onRefreshServices}
                    />
                }
            >
                <MyHeader
                    back notify profile navigation={this.props.navigation}
                    title={'Services'}
                    onBackPress={() => this.props.navigation.goBack()}
                />
                <View style={{ paddingHorizontal: 20 }}>
                    <HStack
                        backgroundColor="#eee"
                        marginTop="2"
                        borderRadius={10}
                        alignItems="center"
                        paddingX="3">
                        {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}> */}
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
                        {/* </View> */}
                    </HStack>
                    {!getServicesData ? (
                        <ActivityIndicator
                            size={'large'}
                            color={'#1D9CD9'}
                            style={styles.loadMoreContentContainer}
                        />
                    ) : null}
                    {getServicesData_list && getServicesData_list?.length ? (
                        <FlatList
                            // refreshControl={
                            //     <RefreshControl
                            //         refreshing={this.state.loader}
                            //         onRefresh={this.onRefreshServices}
                            //     />
                            // }
                            style={styles.flex1}
                            numColumns={2}
                            columnWrapperStyle={styles.teamsListContainer}
                            showsVerticalScrollIndicator={false}
                            data={getServicesData_list}
                            renderItem={({ item, index }) => this.renderUsersList(item)}
                            ListFooterComponent={this.renderLoaderMoreButton()}
                        // refreshing={this.state.loader}
                        // onRefresh={this.onRefreshServices}
                        />
                    ) : null}

                </View>
            </ScrollView>
        );
    }
}
const mapStateToProps = state => {
    return {
        // role: state.Auth.role,
        // user: state.Auth.user,
        Dark: state.AppReducer.darkmode,
        getServicesData: state.ServicesReducer.getServicesData,
        getServicesData_list: state.ServicesReducer.getServicesData_list,
    };
};
const mapDispatchToProps = dispatch => ({
    // Login: data => dispatch(AuthMiddleware.Login(data)),
    // Login: data => dispatch(AuthMiddleware.Login(data)),

    getAllServices: (payload) =>
        dispatch(ServicesMiddleware.getAllServices(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Services);

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
        //   backgroundColor: 'grey',
        flex: 1,
        elevation: 2,
        alignItems: 'center',
        //   borderTopEndRadius: 20,
        //   borderTopLeftRadius: 20,
        overflow: 'hidden',
    },
    teamImage: {
        width: '100%',
        height: 100,
    },
    teamsListContainer: {
        justifyContent: 'space-between',
    },
    teamName: {
        padding: 8,
        fontSize: 12,
        color: colors.black,
        // alignSelf: 'flex-start',
        fontWeight: '500',
        textAlign: 'center'
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
});
