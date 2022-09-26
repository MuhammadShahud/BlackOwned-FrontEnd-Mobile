import React, { Component } from 'react';
import { Image, Dimensions, View, Animated, TouchableOpacity, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Modal, Alert } from 'react-native';
import MyHeader from '../../components/MyHeader';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { connect } from 'react-redux';
import { MarketPlaceMiddleware } from '../../redux/middleware/MarketPlaceMiddleware';
import { imgURL } from '../../configs/AxiosConfig';
import { colors } from '../../Theme';


class MyProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [1, 1, 1, 1, 1, 1, 1],
            refreshing: false,
            loader: true,
            search: '',

        };
    }

    componentDidMount() {
        this.props.getAllUserProducts({ name: '' })
            .then((data) => data ? this.setState({ loader: false }) : this.setState({ loader: false }))
            .catch(() => this.setState({ loader: false }));
    }

    onPressLoadMoreProducts = () => {
        this.setState({ loader: true }, () => {
            const { getUserProductsData } = this.props;
            this.props
                .getAllUserProducts({ next_page_url: getUserProductsData.next_page_url })
                .then((data) => data ? this.setState({ loader: false }) : this.setState({ loader: false }))
                .catch(() => this.setState({ loader: false }));
        });
    };

    onRefreshProducts = () => {
        this.setState({ loader: true }, () => {
            this.props.getAllUserProducts({ name: '' })
                .then((data) => data ? this.setState({ loader: false }) : this.setState({ loader: false }))
                .catch(() => this.setState({ loader: false }));
        });
    };

    deleteProduct = (item) => {
        this.props.deleteProduct({
            id: item?.id
        })
            .then((data) =>
                data ? this.setState({ loader: false }, () => {
                    this.onRefreshProducts()
                }) : this.setState({ loader: false })
            )
            .catch(() => this.setState({ loader: false }));

    }

    renderLoaderMoreButtonProducts = () => {
        const { getUserProductsData } = this.props;
        const { loader } = this.state;
        return getUserProductsData.next_page_url ? (
            loader ? (
                <ActivityIndicator
                    size={'large'}
                    color={'#1D9CD9'}
                    style={styles.loadMoreContentContainer}
                />
            ) : (
                <TouchableOpacity
                    style={{ width: 110, alignSelf: 'center', marginVertical: 13 }}
                    onPress={this.onPressLoadMoreProducts}>
                    <View style={styles.loadMoreContainer}>
                        <Text style={styles.loadMoreText}>Load more</Text>
                    </View>
                </TouchableOpacity>
            )
        ) : null;
    };

    _renderItem = item => (
        <View style={{
            width: '98%',
            paddingVertical: 20,
            paddingHorizontal: 10,
            backgroundColor: this.props.Dark ? colors.dark : "#f2f2f2",
            marginBottom: 10,
            flexDirection: 'row',
            alignItems: 'center',
        }}>
            <Image source={item.image ?
                {
                    uri: imgURL + item.image
                } : require('../../assets/user.png')
            }
                style={{ borderRadius: 4, width: 70, height: 70, resizeMode: 'cover', }} />
            <View style={{

                marginLeft: 5,
                width: '66%',
            }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: this.props.Dark ? colors.white : "#000" }}>{item?.name}</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: this.props.Dark ? colors.white : "#000" }}>Price: </Text>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: "#1872ea", textDecorationLine: 'line-through' }}>${item?.price}</Text>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: "#1872ea" }}>{' $' + item?.discounted_price}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: this.props.Dark ? colors.white : "#000" }}>Date: </Text>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', top: 2, color: this.props.Dark ? colors.white : "#000" }}>{new Date(item?.created_at).toDateString()}</Text>
                </View>

                <Text numberOfLines={3} style={{ fontSize: 12, color: this.props.Dark ? colors.white : "#000" }}>{item?.description}</Text>
            </View>
            <View style={{
                width: '8%',
                marginLeft: 2,
                alignItems: "flex-end",
            }}>
                <View style={{ flexDirection: 'column' }}>
                    <View style={{ borderColor: this.props.Dark ? colors.white : "#000", borderWidth: 1, padding: 5, borderRadius: 50, width: 35, marginVertical: 5, height: 35, alignItems: 'center', justifyContent: 'center' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('EditProduct', { data: item })}>
                            <AntDesign name={'edit'} size={20} color={this.props.Dark ? colors.white : "#000"} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ borderColor: this.props.Dark ? colors.white : "#000", borderWidth: 1, padding: 5, borderRadius: 50, width: 35, marginVertical: 5, height: 35, alignItems: 'center', justifyContent: 'center' }}>
                        <TouchableOpacity onPress={() => this.deleteProduct(item)}>
                            <AntDesign name={'delete'} size={20} color={this.props.Dark ? colors.white : "#000"} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
    GetProduct = () => {

    }
    render() {
        let Dark = this.props.Dark;
        const { getUserProductsData, getUserProductsData_list, loader } = this.props;
        console.warn('Dataa', getUserProductsData_list);
        return (
            <View style={[styles.container, { backgroundColor: Dark ? colors.black : colors.white }]}>
                <MyHeader
                    back notify profile navigation={this.props.navigation}
                    size={'md'}
                    title={'My Products'}
                    onBackPress={() => this.props.navigation.goBack()}
                />
                <View style={{ marginHorizontal: 15, flex: 1 }}>
                    {!getUserProductsData ? (
                        <ActivityIndicator
                            size={'large'}
                            color={'#1D9CD9'}
                            style={styles.loadMoreContentContainer}
                        />
                    ) : null}
                    {getUserProductsData_list && getUserProductsData_list?.length ? (
                        <FlatList

                            refreshControl={
                                <RefreshControl
                                    refreshing={loader}
                                    onRefresh={this.onRefreshProducts}
                                />
                            }
                            // style={styles.flex1}
                            showsVerticalScrollIndicator={false}
                            data={getUserProductsData_list}
                            renderItem={({ item }) => this._renderItem(item)}
                            ListFooterComponent={this.renderLoaderMoreButtonProducts()}
                            ListEmptyComponent={() =>
                                <View>
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            marginTop: 20,
                                            color: 'black',
                                            fontSize: 14,
                                            fontWeight: 'bold',
                                        }}>
                                        Products not found
                                    </Text>
                                </View>}
                        />
                    ) : null}
                </View>

            </View>
        );
    }
}
const mapStateToProps = state => {
    return {
        Dark: state.AppReducer.darkmode,
        user: state.AuthReducer.user,
        getUserProductsData: state.MarketPlaceReducer.getUserProductsData,
        getUserProductsData_list: state.MarketPlaceReducer.getUserProductsData_list,

    };
};
const mapDispatchToProps = dispatch => ({

    getAllUserProducts: (payload) =>
        dispatch(MarketPlaceMiddleware.getAllUserProducts(payload)),

    deleteProduct: payload => dispatch(MarketPlaceMiddleware.deleteProduct(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyProduct);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    ListContainer: {
        width: '100%',
        marginVertical: 5,
        elevation: 2,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eee',
        paddingVertical: 10,
    },
    ListImage: {
        width: 80,
        height: 80,
        resizeMode: 'cover',
        marginLeft: 10,
        marginRight: 5,
        borderRadius: 4,
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
        fontSize: 13,
        fontWeight: 'normal',
    },
    ListDescription: {
        width: '98%',
        fontSize: 10,
        fontWeight: 'normal',
        color: 'black',
        marginTop: 5,
        // backgroundColor: 'red',
    },
    ListAddImage: {
        marginRight: 5,
    },
    FlexRow: {
        width: '98%',
        // backgroundColor: 'red',
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    promoteButton: {
        width: 80,
        height: 35,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#1872ea",
    },
    promotedButton: {
        width: 80,
        height: 35,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#ABABAB",
    },
    promoteText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold'
    },
    flex1: {
        flex: 1,
    },
    sponsorPrice: {
        fontSize: 14,
        color: '#1D9CD9',
        alignSelf: 'flex-start',
        // fontWeight: 'bold',
        marginHorizontal: 5,
    },
    discountPrice: {
        fontSize: 14,
        color: '#1D9CD9',
        alignSelf: 'flex-start',
        // fontWeight: 'bold',
        textDecorationLine: 'line-through',
        marginHorizontal: 5,
    },
})