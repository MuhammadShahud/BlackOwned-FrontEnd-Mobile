import { HStack, Icon, Input } from 'native-base';
import React, { Component } from 'react';
import { Image, Dimensions, View, Animated, TouchableOpacity, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Modal, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';
import MyHeader from '../../components/MyHeader';
import { connect } from 'react-redux';
import { SeminarsMiddleware } from '../../redux/middleware/SeminarsMiddleware';
import { imgURL } from '../../configs/AxiosConfig';
import { colors } from '../../Theme';
class Seminars extends Component {

    state = {
        loader: true,
        search: '',
    };
    componentDidMount() {
        this.props.getAllSeminars({ name: '' })
            .then((data) => data ? this.setState({ loader: false }) : this.setState({ loader: false }))
            .catch(() => this.setState({ loader: false }));
    }

    onPressLoadMore = () => {
        this.setState({ loader: true }, () => {
            const { getSeminarsData } = this.props;
            this.props
                .getAllSeminars({ next_page_url: getSeminarsData.next_page_url })
                .then((data) => data ? this.setState({ loader: false }) : this.setState({ loader: false }))
                .catch(() => this.setState({ loader: false }));
        });
    };

    renderLoaderMoreButton = () => {
        const { getSeminarsData } = this.props;
        const { loader } = this.state;
        return getSeminarsData.next_page_url ? (
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
            this.props.getAllSeminars({ name: '' })
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
                this.props.getAllSeminars({ name: text })
                    .then((data) => data ? this.setState({ loader: false }) : this.setState({ loader: false }))
                    .catch(() => this.setState({ loader: false }));
            });
        }, 500)

    };
    renderUsersList = item => (
        <TouchableOpacity onPress={() => this.props.navigation.navigate('SeminarsDetail', { data: item })} activeOpacity={0.7}
            style={[styles.ListContainer, { backgroundColor: this.props.Dark ? colors.black : colors.white }]}>
            <Image source={item.image ?
                {
                    uri: imgURL + item.image
                } : require('../../assets/user.png')
            } style={styles.ListImage} resizeMode="contain" />
            <View>
                <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.ListName, { color: this.props.Dark ? colors.white : colors.black }]}>{item.name}</Text>
                <View style={{ flexDirection: 'column', }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.ListDistances, { color: this.props.Dark ? colors.white : colors.black }]}>Date: </Text>
                        <Text style={[styles.ListDistances, { color: this.props.Dark ? colors.white : colors.black }]}>{new Date(item.date).toLocaleDateString()}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.ListDistances, { color: this.props.Dark ? colors.white : colors.black }]}>Address: </Text>
                        <Text style={[styles.ListDistances, { color: this.props.Dark ? colors.white : colors.black }]}>{item.address}</Text>
                    </View>
                </View>
                <Text numberOfLines={2} style={styles.ListDescription}>{item.description}</Text>
            </View>
        </TouchableOpacity>
    );

    render() {
        const { getSeminarsData, getSeminarsData_list, loader } = this.props;
        let Dark = this.props.Dark;
        console.warn('Dataa', getSeminarsData_list, getSeminarsData);
        return (
            <View style={{ flex: 1, backgroundColor: Dark ? colors.black : colors.white }}>
                <MyHeader
                    back notify profile navigation={this.props.navigation}
                    title={'Seminars'}
                    onBackPress={() => this.props.navigation.goBack()}
                />
                <ScrollView style={{ paddingHorizontal: 20, flex: 1, backgroundColor: Dark ? colors.black : colors.white }}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.loader}
                            onRefresh={this.onRefreshServices}
                        />
                    }>
                    <HStack
                        backgroundColor='#eee'
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
                    {!getSeminarsData ? (
                        <ActivityIndicator
                            size={'large'}
                            color={'#1D9CD9'}
                            style={styles.loadMoreContentContainer}
                        />
                    ) : null}
                    {getSeminarsData_list && getSeminarsData_list?.length ? (
                        <FlatList
                            refreshControl={
                                <RefreshControl
                                    refreshing={loader}
                                    onRefresh={this.onRefreshServices}
                                />
                            }
                            showsVerticalScrollIndicator={false}
                            data={getSeminarsData_list}
                            renderItem={({ item, index }) => this.renderUsersList(item)}
                            ListFooterComponent={this.renderLoaderMoreButton()}
                        />
                    ) : null}

                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        // role: state.Auth.role,
        // user: state.Auth.user,
        Dark: state.AppReducer.darkmode,
        getSeminarsData: state.SeminarsReducer.getSeminarsData,
        getSeminarsData_list: state.SeminarsReducer.getSeminarsData_list,
    };
};
const mapDispatchToProps = dispatch => ({
    // Login: data => dispatch(AuthMiddleware.Login(data)),
    // Login: data => dispatch(AuthMiddleware.Login(data)),

    getAllSeminars: (payload) =>
        dispatch(SeminarsMiddleware.getAllSeminars(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Seminars);
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
    },
    ListImage: {
        width: '100%',
        height: 180,
    },
    teamsListContainer: {
        justifyContent: 'space-between',
    },
    ListName: {
        marginTop: 5,
        fontSize: 18,
        color: 'black',
        fontWeight: 'bold',
    },
    ListDistances: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    ListDescription: {
        fontSize: 13,
        fontWeight: 'normal',
        color: 'black',
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