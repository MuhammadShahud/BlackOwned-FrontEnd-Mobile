import { HStack, Icon, Input } from 'native-base';
import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';
import MyHeader from '../../components/MyHeader';
import { connect } from 'react-redux';
import { BanksMiddleware } from '../../redux/middleware/BanksMiddleware';
import { imgURL } from '../../configs/AxiosConfig';
import { colors } from '../../Theme';

class Banks extends Component {
    state = {
        loader: true,
        search: '',
    };
    componentDidMount() {
        this.props.getAllBanks({ name: '' })

    }

    onPressLoadMore = () => {
        this.setState({ loader: true }, () => {
            const { getBanksData } = this.props;
            this.props
                .getAllBanks({ next_page_url: getBanksData.next_page_url })
                .then((data) => data ? this.setState({ loader: false }) : this.setState({ loader: false }))
                .catch(() => this.setState({ loader: false }));
        });
    };

    renderLoaderMoreButton = () => {
        const { getBanksData } = this.props;
        const { loader } = this.state;
        return getBanksData.next_page_url ? (
            // loader ? (
            //     <ActivityIndicator
            //         size={'large'}
            //         color={'#1D9CD9'}
            //         style={styles.loadMoreContentContainer}
            //     />
            // ) : (
            <TouchableOpacity
                style={{ width: 110, alignSelf: 'center', marginVertical: 15 }}
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
            this.props.getAllBanks({ name: '' })
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
                    .getAllBanks({ name: text })

            });
        }, 500)

    };
    renderUsersList = item => (
        <TouchableOpacity onPress={() => this.props.navigation.navigate('BanksDetail', { data: item })} activeOpacity={0.7}
            style={[styles.ListContainer, { backgroundColor: this.props.Dark ? colors.black : colors.white }]}>
            <Image source={item.image ?
                {
                    uri: imgURL + item.image
                } : require('../../assets/user.png')
            } style={styles.ListImage} />
            <View>
                <Text style={[styles.ListName, { color: this.props.Dark ? colors.white : colors.black }]}>{item?.name}</Text>
                {item?.miles ? <Text style={[styles.ListDistances, { color: this.props.Dark ? colors.white : colors.black }]}>{item?.miles} miles</Text>
                    : null}
            </View>

        </TouchableOpacity>
    );

    render() {
        const { getBanksData, getBanksData_list, loader } = this.props;
        console.warn('Dataa', getBanksData_list, getBanksData);
        return (
            <View style={{ flex: 1, backgroundColor: this.props.Dark ? colors.black : colors.white }}>
                <MyHeader
                    back notify profile navigation={this.props.navigation}
                    title={'Blackowned Banks'}
                    onBackPress={() => this.props.navigation.goBack()}
                />

                <View style={{ paddingHorizontal: 20, flex: 1 }}>
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
                    {!getBanksData ? (
                        <ActivityIndicator
                            size={'large'}
                            color={'#1D9CD9'}
                            style={styles.loadMoreContentContainer}
                        />
                    ) : null}
                    {getBanksData_list && getBanksData_list?.length ? (
                        <FlatList
                            refreshControl={
                                <RefreshControl
                                    refreshing={loader}
                                    onRefresh={this.onRefreshServices}
                                />
                            }
                            // style={styles.flex1}
                            showsVerticalScrollIndicator={false}
                            data={getBanksData_list}
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
        getBanksData: state.BanksReducer.getBanksData,
        getBanksData_list: state.BanksReducer.getBanksData_list,
    };
};
const mapDispatchToProps = dispatch => ({
    // Login: data => dispatch(AuthMiddleware.Login(data)),
    // Login: data => dispatch(AuthMiddleware.Login(data)),

    getAllBanks: (payload) =>
        dispatch(BanksMiddleware.getAllBanks(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Banks);

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
        // justifyContent: 'space-between',
        // backgroundColor: 'red',
    },
    ListImage: {
        width: 55,
        height: 55,
    },
    teamsListContainer: {
        justifyContent: 'space-between',
    },
    ListName: {
        marginLeft: 12,
        fontSize: 16,
        color: 'black',
        fontWeight: 'bold',
    },
    ListDistances: {
        marginLeft: 12,
        fontSize: 13,
        fontWeight: 'normal',
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
        // marginLeft: 5,
        textAlign: 'center'
    },
    loadMoreContainer: {
        paddingHorizontal: 10,
        backgroundColor: '#1D9CD9',
        paddingVertical: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 2,
    },
})