import {
    HStack,
    ScrollView,
    Icon,
    Input
} from 'native-base';
import React, { Component } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, Modal, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
import MyHeader from '../../components/MyHeader';
import { imgURL } from '../../configs/AxiosConfig';
import { MarketPlaceMiddleware } from '../../redux/middleware/MarketPlaceMiddleware';
// import {Colors} from '../../Styles';
import Swiper from 'react-native-swiper';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather';
import { colors, SCREEN_WIDTH } from '../../Theme';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';

navigator.geolocation = require('@react-native-community/geolocation');
navigator.geolocation = require('react-native-geolocation-service');
const { width } = Dimensions.get('window');

class MarketPlace extends Component {

    state = {
        loader: true,
        notificationData: [],
        search: '',
        SponsorModal: false,
        byCategoryModal: false,
        locationText: ""
    };
    componentDidMount() {
        this.props.getAllMarketPlaceSponsored({ name: '' })
            .then((data) =>

                data ?

                    this.setState({
                        notificationData: data?.data,
                        SponsorModal: data?.data?.length == 0 ? false : true,
                        loader: false,
                    })
                    :
                    null,

            )
            .catch(() => this.setState({ loader: false }));
        this.props.getAllMarketPlaceProducts({ name: '' });
        // .then(() => this.setState({ loader: false }))
        // .catch(() => this.setState({ loader: false }));
        // if (this.props.getMarketPlaceSponsoredData_list) {
        //     this.setState({
        //      notificationData: this.props.getMarketPlaceSponsoredData_list[0],
        //     })
        // }
        Geocoder.init("AIzaSyBBVMEPDktEjcindc7_NjCpFWsSWVspyKI");
        Geolocation.getCurrentPosition((position) => {
            Geocoder.from(position.coords.latitude, position.coords.longitude)
                .then(json => {
                    let addressComponent = json.results[0].address_components;
                    let city, country;
                    addressComponent.forEach((value) => {
                        if (value.types.includes("administrative_area_level_2"))
                            city = value.long_name;
                        if (value.types.includes("country"))
                            country = value.long_name;
                    })
                    //.formatted_address.split(",");
                    this.setState({ locationText: city + ", " + country })
                })
                .catch(error => console.warn(error));
        })


    }

    onPressLoadMoreSponsored = () => {
        this.setState({ loader: true }, () => {
            const { getMarketPlaceSponsoredData } = this.props;
            this.props
                .getAllMarketPlaceSponsored({ next_page_url: getMarketPlaceSponsoredData.next_page_url })
                .then((data) => data ? this.setState({ loader: false }) : this.setState({ loader: false }))
                .catch(() => this.setState({ loader: false }));
        });
    };
    onPressLoadMoreProducts = () => {
        this.setState({ loader: true }, () => {
            const { getMarketPlaceProductsData } = this.props;
            this.props
                .getAllMarketPlaceProducts({ next_page_url: getMarketPlaceProductsData.next_page_url })
                .then((data) => data ? this.setState({ loader: false }) : this.setState({ loader: false }))
                .catch(() => this.setState({ loader: false }));
        });
    };

    renderLoaderMoreButtonSponosred = () => {
        const { getMarketPlaceSponsoredData } = this.props;
        const { loader } = this.state;
        return getMarketPlaceSponsoredData.next_page_url ? (
            loader ? (
                <ActivityIndicator
                    size={'large'}
                    color={'#1D9CD9'}
                    style={styles.loadMoreContentContainer}
                />
            ) : (
                <TouchableOpacity
                    style={{ width: 110, alignSelf: 'center', marginVertical: 13 }}
                    onPress={this.onPressLoadMoreSponsored}>
                    <View style={styles.loadMoreContainer}>
                        <Text style={styles.loadMoreText}>Load more</Text>
                    </View>
                </TouchableOpacity>
            )
        ) : null;
    };
    renderLoaderMoreButtonProducts = () => {
        const { getMarketPlaceProductsData } = this.props;
        const { loader } = this.state;
        return getMarketPlaceProductsData.next_page_url ? (
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

    onRefreshServicesSponsored = () => {
        this.setState({ loader: true }, () => {
            this.props.getAllMarketPlaceSponsored({ name: '' })
                .then((data) => data ? this.setState({ loader: false }) : this.setState({ loader: false }))
                .catch(() => this.setState({ loader: false }));
            // this.props.getAllMarketPlaceProducts({ name: '' })
        });
        this.setState({ loader: true }, () => {
            this.props.getAllMarketPlaceProducts({ name: '' })
                .then((data) => data ? this.setState({ loader: false }) : this.setState({ loader: false }))
                .catch(() => this.setState({ loader: false }));
        });
    };
    // onRefreshServicesNotSponsored = () => {
    //     this.setState({ loader: true }, () => {
    //         this.props.getAllMarketPlacesNotSponsored({ name: '' })
    //     });
    // };
    // onChangeSearchText = text => {
    //     let { search } = this.state
    //     this.setState({ loader: true, search: text }, () => {
    //         console.log(this.state.search, text, 'TEXT====>');
    //         this.props
    //             .getAllServices({ search })

    //     });
    // };

    // onChangeSearchText = text => {
    //     clearTimeout(this.searchTimeout)
    //     this.searchTimeout = setTimeout(() => {
    //         this.setState({ loader: true, search: text }, () => {
    //             console.log(this.state.search, text, 'TEXT====>');
    //             // this.props
    //             //     .getAllMarketPlacesSponsored({ name: text });
    //             // .then(() => this.setState({ loader: false }))
    //             // .catch(() => this.setState({ loader: false }));
    //             this.props
    //                 .getAllMarketPlacesProducts({ name: text })
    //         });
    //     }, 500)

    // };
    renderSponseredList = item => (
        <View>
            <TouchableOpacity onPress={() =>
                this.props.navigation.navigate('ProductDetails', { data: item })}
                style={styles.ListContainer}
            >
                <Image source={item?.image ?
                    {
                        uri: imgURL + item?.image
                    } : require('../../assets/user.png')
                } style={styles.teamImage} />
                <View style={{ position: 'absolute', right: 0, padding: 4, backgroundColor: '#fff', borderRadius: 8, margin: 5 }}>
                    {/* <TouchableOpacity onPress={() => console.warn('Touch')}> */}
                    <FontAwesome5 name={'crown'} size={15} color={'#1872ea'} />
                    {/* </TouchableOpacity> */}
                </View>
                <Text style={[styles.sponsorName, { color: this.props.Dark ? colors.white : colors.black }]}>{item?.name}</Text>
                <Text style={{ textAlign: 'center', color: this.props.Dark ? colors.white : colors.black }}>${item?.discounted_price}</Text>
                <Text style={{ textAlign: 'center', paddingBottom: 10, color: this.props.Dark ? colors.white : colors.black }}>{item?.category?.name}</Text>
            </TouchableOpacity>
        </View>

    );

    renderProductsList = item => (
        <View>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('ProductDetails', { data: item })} style={styles.ListContainer}>
                <Image source={item?.image ?
                    {
                        uri: imgURL + item?.image
                    } : require('../../assets/user.png')
                } style={styles.teamImage} />

                {/* <View style={{flexDirection:'column',}}> */}
                <Text style={[styles.sponsorName, { color: this.props.Dark ? colors.white : colors.black }]}>{item?.name}</Text>
                <Text style={{ textAlign: 'center', color: this.props.Dark ? colors.white : colors.black }}>${item?.discounted_price}</Text>
                <Text style={{ textAlign: 'center', paddingBottom: 10, color: this.props.Dark ? colors.white : colors.black }}>{item?.category?.name}</Text>
                {/* </View> */}
            </TouchableOpacity>
        </View>
    );

    // onChangeSearchText = text => {

    // };

    render() {
        const { getMarketPlaceSponsoredData, getMarketPlaceSponsoredData_list, getMarketPlaceProductsData, getMarketPlaceProductsData_list, loader } = this.props;
        console.warn('Dataa', getMarketPlaceProductsData_list);
        let Dark = this.props.Dark;
        return (
            <View style={{ flex: 1, backgroundColor: Dark ? colors.black : colors.white, }}>
                <MyHeader
                    back notify profile navigation={this.props.navigation}
                    // title={this.props.route.name}
                    title={'Market Place'}
                    onBackPress={() => this.props.navigation.goBack()}
                />
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            colors={["#1c1c1c", "#5c5c5c"]}
                            tintColor="#000"
                            refreshing={this.state.loader}
                            onRefresh={this.onRefreshServicesSponsored}
                        />
                    }
                // style={styles.container}
                >

                    <View style={{ paddingHorizontal: 20 }}>
                        <HStack
                            backgroundColor="#eee"
                            marginTop="2"
                            borderRadius={10}
                            alignItems="center"
                            paddingX="3">
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('ProductsByCategories')} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', height: 40 }}>
                                    <View style={{ width: '10%' }}>
                                        <Icon as={Feather} name="search" size="sm" color="#aaa" />
                                    </View>
                                    <View style={{ width: '80%' }}>
                                        {/* <Input  fontSize={14} placeholder="Search" borderWidth={0} onChangeText={this.onChangeSearchText} /> */}
                                        <Text style={{ color: colors.black }}>Search By Categories</Text>
                                    </View>

                                </View>
                            </TouchableOpacity>
                        </HStack>
                        <View style={{
                            height: 50,
                            width: '100%',
                            flexDirection: 'row',
                            backgroundColor: Dark ? colors.black : colors.white,
                            marginBottom: 7,
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: Dark ? colors.white : colors.black }}>Today's Picks</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Entypo name={'location-pin'} color={colors.primary_blue} size={20} />
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.navigation.navigate('ProductsByCategories')
                                    }}
                                >
                                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: Dark ? colors.white : colors.black }}>
                                        {this.state.locationText}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{ marginVertical: 10 }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: Dark ? colors.white : colors.black }}>Sponsored</Text>
                        </View>
                        {!getMarketPlaceSponsoredData ? (
                            <ActivityIndicator
                                size={'large'}
                                color={'#1D9CD9'}
                                style={styles.loadMoreContentContainer}
                            />
                        ) : null}
                        {getMarketPlaceSponsoredData_list && getMarketPlaceSponsoredData_list?.length ? (
                            <FlatList
                                // refreshControl={
                                //     <RefreshControl
                                //         refreshing={loader}
                                //         onRefresh={this.onRefreshServicesSponsored}
                                //     />
                                // }
                                numColumns={2}
                                columnWrapperStyle={styles.teamsListContainer}
                                style={styles.flex1}
                                showsVerticalScrollIndicator={false}
                                data={getMarketPlaceSponsoredData_list}
                                renderItem={({ item, index }) => this.renderSponseredList(item)}
                                ListFooterComponent={this.renderLoaderMoreButtonSponosred()}
                            // renderItem={({ item }) => this.renderList(item)}
                            />
                        ) : null}


                        <View style={{ marginVertical: 10 }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: Dark ? colors.white : colors.black }}>Products</Text>
                        </View>
                        {!getMarketPlaceProductsData ? (
                            <ActivityIndicator
                                size={'large'}
                                color={'#1D9CD9'}
                                style={styles.loadMoreContentContainer}
                            />
                        ) : null}
                        {getMarketPlaceProductsData_list && getMarketPlaceProductsData_list?.length ? (
                            <FlatList
                                // refreshControl={
                                //     <RefreshControl
                                //         refreshing={loader}
                                //         onRefresh={this.onRefreshServicesNotSponsored}
                                //     />
                                // }
                                numColumns={2}
                                columnWrapperStyle={styles.teamsListContainer}
                                // style={styles.flex1}
                                showsVerticalScrollIndicator={false}
                                data={getMarketPlaceProductsData_list}
                                renderItem={({ item, index }) => this.renderProductsList(item)}
                                ListFooterComponent={this.renderLoaderMoreButtonProducts()}
                            // renderItem={({ item }) => this.renderList(item)}
                            />
                        ) : null}

                        {/* <FlatList
                            numColumns={2}
                            columnWrapperStyle={styles.teamsListContainer}
                            style={styles.flex1}
                            showsVerticalScrollIndicator={false}
                            data={[
                                { name: 'Realtors', img: require('../../assets/realtor.jpg') },
                                { name: 'Artists', img: require('../../assets/c2.jpeg') },

                            ]}
                            renderItem={({ item }) => this.renderSponsorList(item)}
                        /> */}

                    </View>

                </ScrollView>
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('AddProduct')}
                    activeOpacity={0.7}
                    style={styles.fabBtn}>
                    <Entypo name="plus" size={28} color={'#fff'} />
                </TouchableOpacity>

                <Modal
                    animationType={'fade'}
                    transparent={true}
                    visible={this.state.SponsorModal}
                    onRequestClose={() => this.setState({ SponsorModal: false })}>
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(0,0,0,0.50)',

                        }}>
                        <View

                            style={{
                                height: 560,
                                width: '94%',
                                borderRadius: 14,
                                paddingVertical: 10,
                                //alignItems: 'center',
                                backgroundColor: Dark ? colors.dark : colors.white,
                                // justifyContent: 'center',
                            }}>

                            <View style={{ width: '100%', alignItems: 'center' }}>
                                <TouchableOpacity
                                    style={{ position: 'absolute', zIndex: 1, alignSelf: 'flex-end', right: 8 }}
                                    onPress={() => {
                                        this.setState({ SponsorModal: false });
                                    }}>
                                    <Entypo
                                        name={'circle-with-cross'}
                                        size={24}
                                        color={'#1872ea'}
                                        //color={'#fff'}
                                        style={{ marginLeft: 5, marginTop: 7 }}
                                    />
                                </TouchableOpacity>


                                <View style={{ alignItems: 'center', height: 560 }}>
                                    <Swiper
                                        index={0}
                                        autoplayTimeout={5}
                                        showsPagination={true}
                                        loop={true}
                                        autoplay={true}
                                    //showsButtons={true}
                                    >
                                        {

                                            this.state?.notificationData.map((v, key) => (
                                                <TouchableOpacity onPress={() => this.props.navigation.navigate('ProductDetails', { data: v })}>
                                                    <Image source={{ uri: imgURL + v?.image }} style={{
                                                        width: '100%',
                                                        height: '70%',
                                                        resizeMode: 'contain',
                                                        borderTopLeftRadius: 14,
                                                        borderTopRightRadius: 14,
                                                    }} />
                                                    <Text style={{ paddingHorizontal: 10, fontSize: 20, color: Dark ? colors.white : colors.black, fontWeight: 'bold', alignSelf: "center" }}>{v?.name}</Text>
                                                    <View style={{ alignSelf: "center", flexDirection: 'row' }}>
                                                        <Text style={styles.sponsorPrice}>
                                                            ${v?.discounted_price}
                                                        </Text>
                                                        <Text style={styles.discountPrice}>${v?.price}</Text>
                                                    </View>
                                                    {/* <Text style={{ paddingHorizontal: 10, fontSize: 16, color: '#000', fontWeight: 'bold', alignSelf: "center" }}>${v?.price} </Text> */}
                                                    <Text numberOfLines={3} style={{ paddingHorizontal: 10, fontSize: 13, color: Dark ? colors.white : colors.black, fontWeight: 'normal', textAlign: 'center' }}>
                                                        {v?.description}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))
                                        }
                                    </Swiper>
                                </View>





                            </View>

                        </View>
                    </View>
                </Modal>

                <Modal
                    animationType={'fade'}
                    transparent={true}
                    visible={this.state.byCategoryModal}
                    onRequestClose={() => this.setState({ byCategoryModal: false })}>
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(0,0,0,0.50)',

                        }}>
                        <View
                            style={{
                                // height: 560,
                                // width: '94%',
                                borderRadius: 14,
                                paddingVertical: 10,
                                //alignItems: 'center',
                                backgroundColor: Dark ? colors.dark : colors.white,
                                // justifyContent: 'center',
                            }}>
                            <View style={{ width: '100%', alignItems: 'center' }}>
                                {/* <TouchableOpacity
                                    style={{ position: 'absolute', zIndex: 1, alignSelf: 'flex-end', right: 8 }}
                                    onPress={() => {
                                        this.setState({ SponsorModal: false });
                                    }}>
                                    <Entypo
                                        name={'circle-with-cross'}
                                        size={24}
                                        color={'#1872ea'}
                                        //color={'#fff'}
                                        style={{ marginLeft: 5, marginTop: 7 }}
                                    />
                                </TouchableOpacity> */}
                            </View>
                        </View>
                    </View>
                </Modal >
            </View >
        );
    }
}
const mapStateToProps = state => {
    console.warn('state', state);
    return {
        // role: state.Auth.role,
        // user: state.Auth.user,
        Dark: state.AppReducer.darkmode,
        getMarketPlaceSponsoredData: state.MarketPlaceReducer.getMarketPlaceSponsoredData,
        getMarketPlaceSponsoredData_list: state.MarketPlaceReducer.getMarketPlaceSponsoredData_list,
        getMarketPlaceProductsData: state.MarketPlaceReducer.getMarketPlaceProductsData,
        getMarketPlaceProductsData_list: state.MarketPlaceReducer.getMarketPlaceProductsData_list,
    };
};
const mapDispatchToProps = dispatch => ({
    // Login: data => dispatch(AuthMiddleware.Login(data)),
    // Login: data => dispatch(AuthMiddleware.Login(data)),

    getAllMarketPlaceSponsored: (payload) =>
        dispatch(MarketPlaceMiddleware.getAllMarketPlacesSponsored(payload)),
    getAllMarketPlaceProducts: (payload) =>
        dispatch(MarketPlaceMiddleware.getAllMarketPlacesProducts(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MarketPlace);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //   paddingHorizontal: 25,
        backgroundColor: "#fff",
    },

    flex1: { flex: 1 },

    sponsorContainer: {
        marginVertical: 8,
        marginHorizontal: 5,
        flex: 1,

    },
    teamImage: {
        width: 150,
        height: 150,
        borderRadius: 5
    },
    teamsListContainer: {
        justifyContent: 'space-around',
    },
    ListContainer: {

    },
    sponsorName: {
        fontSize: 14,
        color: 'black',
        alignSelf: 'center',
        fontWeight: '500',
        textAlign: 'center',
        paddingTop: 5,
    },
    sponsorPrice: {
        fontSize: 14,
        color: '#1D9CD9',
        alignSelf: 'center',
        fontWeight: '500',
        textAlign: 'center',
        backgroundColor: 'yellow'
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
    loadMoreContainer: {
        paddingHorizontal: 10,
        backgroundColor: '#1D9CD9',
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 2,
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
});
