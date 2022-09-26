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
// import {Colors} from '../../Styles';
import Entypo from 'react-native-vector-icons/Entypo';
import Octicons from 'react-native-vector-icons/Octicons';
import { connect } from 'react-redux';
import { ServicesMiddleware } from '../../redux/middleware/ServicesMiddleware';
import { imgURL } from '../../configs/AxiosConfig';
import { colors } from '../../Theme';


const { width } = Dimensions.get('window');

class AddServices extends Component {

    state = {
        loader: true,
        search: '',
        getServicesData: null,
        getServicesDataCopy: [],
    };
    componentDidMount() {
        this.props.getAllServices({ name: '' })
            .then((data) => data ? this.setState({ loader: false }) : this.setState({ loader: false }))
            .catch(() => this.setState({ loader: false }));
    }

    storedService = item => {
        // console.warn('stored', item);
        let getServicesDataCopy = this.props.getServicesData_list;

        let index = getServicesDataCopy.findIndex(val => val.id === item.id);

        if (!getServicesDataCopy[index].stored) {
            let updateItem = { ...item, stored: true, };

            getServicesDataCopy.splice(index, 1, updateItem);
        } else {
            let index = getServicesDataCopy.findIndex(val => val.id === item.id);
            let updateItem = {
                ...item,
                stored: false,
            };

            getServicesDataCopy.splice(index, 1, updateItem);
        }
        this.setState({ getServicesDataCopy });
        this.props.storeService({ service_id: item.id });
    };

    removeService = item => {
        // console.warn('stored', item);
        let getServicesDataCopy = this.props.getServicesData_list;

        let index = getServicesDataCopy.findIndex(val => val.id === item.id);

        if (!getServicesDataCopy[index].stored) {
            let updateItem = { ...item, stored: true, };

            getServicesDataCopy.splice(index, 1, updateItem);
        } else {
            let index = getServicesDataCopy.findIndex(val => val.id === item.id);
            let updateItem = {
                ...item,
                stored: false,
            };

            getServicesDataCopy.splice(index, 1, updateItem);
        }
        this.setState({ getServicesDataCopy });
        this.props.removeService({ service_id: item.id });
    };

    // storedService = (item) => {
    //     let getServicesDataCopy = this.props.getServicesData_list

    //     let index = getServicesDataCopy.findIndex(val => val.id === item.id)

    //     if (!getServicesDataCopy[index].stored) {
    //       let updateItem = { ...item, stored: true, }


    //       getServicesDataCopy.splice(index, 1, updateItem)

    //     } else {
    //       let index = getServicesDataCopy.findIndex(val => val.id === item.id)
    //       let updateItem = { ...item, stored: false, }

    //       getServicesDataCopy.splice(index, 1, updateItem)

    //     }
    //     this.setState({ getServicesDataCopy })
    //     console.warn('getServicesDataCopy',getServicesDataCopy);
    //     this.props
    //       .storeService({ service_id: item.id })
    //   };



    //     storedService = (item) => {
    // console.warn(item.id);
    //         // this.props.storeService({ id: item.id });
    //         setTimeout(() => {
    //             this.props.storeService({ service_id: item.id });
    //         }, 3000);

    //     };

    onPressLoadMore = () => {
        this.setState({ loader: true }, () => {
            const { getServicesData } = this.props;
            this.props
                .getAllServices({ next_page_url: getServicesData.next_page_url })
                .then((data) => data ? this.setState({ loader: false }) : this.setState({ loader: false }))
                .catch(() => this.setState({ loader: false }));
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
            this.props.getAllServices({ name: '' })
                .then((data) => data ? this.setState({ loader: false }) : this.setState({ loader: false }))
                .catch(() => this.setState({ loader: false }));
        });
    };


    onChangeSearchText = text => {
        clearTimeout(this.searchTimeout)
        this.searchTimeout = setTimeout(() => {
            this.setState({ loader: true, search: text }, () => {
                console.log(this.state.search, text, 'TEXT====>');
                this.props
                    .getAllServices({ name: text })
                    .then((data) => data ? this.setState({ loader: false }) : this.setState({ loader: false }))
                    .catch(() => this.setState({ loader: false }));
            });
        }, 500)

    };

    renderUsersList = item => (
        <TouchableOpacity
            // onPress={() => this.props.navigation.navigate('ServicesFilter')}
            activeOpacity={0.7} style={styles.teamContainer}>
            <Image source={item.image ?
                {
                    uri: imgURL + item.image
                } : require('../../assets/user.png')
            } style={styles.teamImage} />
            <Text style={[styles.teamName, { color: this.props.Dark ? colors.white : colors.black }]}>{item.name}</Text>
            {item.stored == true ? (
                <TouchableOpacity
                    onPress={() => this.removeService(item)}
                    activeOpacity={0.7}
                    style={styles.fabBtn}>
                    <Entypo name="minus" size={18} color={'#fff'} />
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    onPress={() => this.storedService(item)}
                    activeOpacity={0.7}
                    style={styles.fabBtn}>
                    <Entypo name="plus" size={18} color={'#fff'} />
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );

    render() {
        let Dark = this.props.Dark;
        const { getServicesData, getServicesData_list, loader } = this.props;
        return (
            <ScrollView style={[styles.container, { backgroundColor: Dark ? colors.black : colors.white }]}>
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
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%' }}>
                                <Icon as={Feather} name="search" size="sm" color="#aaa" />
                                <View style={{ width: '90%' }}>
                                    <Input fontSize={14} placeholder="Search" borderWidth={0} onChangeText={this.onChangeSearchText} />

                                </View>
                            </View>
                            {/* <TouchableOpacity onPress={() => this.props.navigation.navigate('ServicesFilter')}>
                                <Icon as={Octicons} name="settings" size="sm" color="#aaa" />
                            </TouchableOpacity> */}
                        </View>
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
                            refreshControl={
                                <RefreshControl
                                    refreshing={loader}
                                    onRefresh={this.onRefreshServices}
                                />
                            }
                            style={styles.flex1}
                            numColumns={2}
                            columnWrapperStyle={styles.teamsListContainer}
                            showsVerticalScrollIndicator={false}
                            data={getServicesData_list}
                            renderItem={({ item, index }) => this.renderUsersList(item)}
                            ListFooterComponent={this.renderLoaderMoreButton()}
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
        storeServiceData: state.ServicesReducer.storeServiceData,
        removeServiceData: state.ServicesReducer.removeServiceData,
    };
};
const mapDispatchToProps = dispatch => ({
    // Login: data => dispatch(AuthMiddleware.Login(data)),
    // Login: data => dispatch(AuthMiddleware.Login(data)),

    getAllServices: (payload) =>
        dispatch(ServicesMiddleware.getAllServices(payload)),
    storeService: payload => dispatch(ServicesMiddleware.storeService(payload)),
    removeService: payload => dispatch(ServicesMiddleware.removeService(payload)),

});

export default connect(mapStateToProps, mapDispatchToProps)(AddServices);

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
        color: 'black',
        alignSelf: 'flex-start',
        fontWeight: '500',
    },
    fabBtn: {
        width: 30,
        height: 30,
        bottom: 40,
        right: 3,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#1D9CD9",
        position: 'absolute',
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
