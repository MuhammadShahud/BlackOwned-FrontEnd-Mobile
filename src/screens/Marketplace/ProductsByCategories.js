import {
    HStack,
    ScrollView,
    Icon,
    Input
} from 'native-base';
import React, { Component } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, Modal, RefreshControl, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
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
import SelectDropdown from 'react-native-select-dropdown';
import { colors, SCREEN_HEIGHT, SCREEN_WIDTH } from '../../Theme';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import Slider from '@react-native-community/slider';


const { width } = Dimensions.get('window');

class ProductByCategory extends Component {

    state = {
        loader: true,
        notificationData: [],
        search: '',
        SponsorModal: false,
        byCategoryModal: false,
        categories: [],
        selectedCategory: '',
        category_id: '',
        CategoryModal: false,
        ModalDistance: false,
        locationText: "",
        minimumValue: 0,
        maximumValue: 100,
        selectedValue: 0
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
        this.props.getProductsByCategory({ id: '' })
        // .then(() => this.setState({ loader: false }))
        // .catch(() => this.setState({ loader: false }));
        // if (this.props.getMarketPlaceSponsoredData_list) {
        //     this.setState({
        //      notificationData: this.props.getMarketPlaceSponsoredData_list[0],
        //     })
        // }
        this.props.getCategories()
            .then((data) => this.setState({ categories: data?.data }))
            .catch(() => this.setState({ loader: false }));

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


    onPressLoadMoreProducts = () => {
        this.setState({ loader: true }, () => {
            const { getProductsByCategoryData } = this.props;
            this.props
                .getProductsByCategory({ next_page_url: getProductsByCategoryData.next_page_url })
                .then((data) => data ? this.setState({ loader: false }) : this.setState({ loader: false }))
                .catch(() => this.setState({ loader: false }));
        });
    };


    renderLoaderMoreButtonProducts = () => {
        const { getProductsByCategoryData } = this.props;
        const { loader } = this.state;
        return getProductsByCategoryData.next_page_url ? (
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
            this.props.getProductsByCategory({ id: '' })
                .then((data) => data ? this.setState({ loader: false }) : this.setState({ loader: false }))
                .catch(() => this.setState({ loader: false }));
        });
    };

    renderSponseredList = item => (
        <View>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('ProductDetails', { data: item })} style={styles.ListContainer}>
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
                <Text style={styles.sponsorName}>{item?.name}</Text>
                <Text style={styles.sponsorPrice}>${item?.discounted_price}</Text>
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

                <Text style={[styles.sponsorName, { color: this.props.Dark ? colors.white : colors.black }]}>{item?.name}</Text>
                <Text style={{ textAlign: 'center', color: this.props.Dark ? colors.white : colors.black }}>${item?.discounted_price}</Text>
                <Text style={{ textAlign: 'center', paddingBottom: 10, color: this.props.Dark ? colors.white : colors.black }}>{item?.category?.name}</Text>
            </TouchableOpacity>
        </View>
    );
    _rendercategories = item => (

        <TouchableOpacity
            onPress={() => {
                this.props.getProductsByCategory({ id: item.id,distance:this.state.selectedValue });
                this.setState({ CategoryModal: false, category_id: item.id })
            }}
            style={{
                alignItems: 'center',
                width: SCREEN_WIDTH - 50,
                marginVertical: 20,
                alignItems: 'center',
                borderBottomColor: colors.black,
                borderBottomWidth: 1,
                justifyContent: 'center',
            }}>
            <Text style={{ marginHorizontal: 20, fontSize: 18, alignItems: "center", fontWeight: "bold", width: '100%' }}>{item?.name}</Text>
        </TouchableOpacity>
    );

    // onChangeSearchText = text => {

    // };

    render() {
        const { getProductsByCategoryData, getProductsByCategoryData_list, loader } = this.props;
        let Dark = this.props.Dark;
        return (
            <View style={{ flex: 1, backgroundColor: Dark ? colors.black : colors.white, }}>
                <MyHeader
                    back notify profile navigation={this.props.navigation}
                    // title={this.props.route.name}
                    title={'Products'}
                    onBackPress={() => this.props.navigation.goBack()}
                />
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.loader}
                            onRefresh={this.onRefreshServicesSponsored}
                        />
                    }
                // style={styles.container}
                >

                    <View style={{ paddingHorizontal: 20 }}>
                        {/* <HStack
                            backgroundColor="#eee"
                            marginTop="2"
                            borderRadius={10}
                            alignItems="center"
                            paddingX="3">
                            <TouchableOpacity onPress={() => this.setState({ byCategoryModal: true })} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', height: 40 }}>
                                    <View style={{ width: '10%' }}>
                                    </View>
                                    <View style={{ width: '80%' }}>
                                        <Text>By Categories</Text>
                                    </View>

                                </View>
                            </TouchableOpacity>
                        </HStack> */}
                        {/* <View style={{ width: '100%', marginBottom: 10 }}>
                            <SelectDropdown
                                data={this.state.categories}
                                // defaultValue={'Gender'}
                                defaultButtonText='Select Category'
                                rowTextForSelection={(item) => <Text>{item?.name}</Text>}
                                buttonTextAfterSelection={(selectedItem, index) => {
                                    return selectedItem.name;
                                }}
                                dropdownIconPosition="right"
                                renderDropdownIcon={() => {
                                    return (
                                        <Image
                                            resizeMode="contain"
                                            source={require('../../assets/dropdown.png')}
                                            style={{ height: 15, width: 15, tintColor: 'rgb(160, 160, 160)' }}
                                        />
                                    );
                                }}
                                buttonTextStyle={styles.dropDownBtnText}
                                buttonStyle={styles.btnStyle}
                                onSelect={(selectedItem, index) => {
                                    // this.setState({ category_id: selectedItem.id });
                                    this.props.getProductsByCategory({ id: selectedItem.id });
                                }}
                            />
                        </View> */}
                        <TouchableOpacity onPress={() => this.setState({ CategoryModal: true })} style={{
                            flexDirection: 'row',
                            height: 45,
                            width: '50%',
                            backgroundColor: '#f2f2f2',
                            borderRadius: 20,
                            marginBottom: 10,
                            justifyContent: "center",
                            alignItems: 'center',
                        }}>
                            <Entypo name={'menu'} size={22} color={colors.black} />
                            <Text style={{ color: colors.black, fontSize: 14, fontWeight: 'normal', }}> Select Category</Text>
                        </TouchableOpacity>
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
                            <View style={{ alignItems: "flex-end" }}>
                                <TouchableOpacity onPress={() => this.setState({ ModalDistance: true })}>
                                    <Text style={{ fontSize: 13, fontWeight: 'bold', color: Dark ? colors.white : colors.black }}> {this.state.selectedValue} miles</Text>
                                </TouchableOpacity>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Entypo name={'location-pin'} color={colors.primary_blue} size={20} />
                                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: Dark ? colors.white : colors.black }}>
                                        {this.state.locationText}
                                    </Text>
                                </View>
                            </View>
                        </View>



                        {/* <View style={{ marginVertical: 10 }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Products</Text>
                        </View> */}
                        {!getProductsByCategoryData ? (
                            <ActivityIndicator
                                size={'large'}
                                color={'#1D9CD9'}
                                style={styles.loadMoreContentContainer}
                            />
                        ) : null}
                        {getProductsByCategoryData_list && getProductsByCategoryData_list?.length ? (
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
                                data={getProductsByCategoryData_list}
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

                <Modal
                    animationType={'fade'}
                    transparent={true}
                    visible={this.state.CategoryModal}
                    onRequestClose={() => this.setState({ CategoryModal: false })}>
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(0,0,0,0.50)',

                        }}>
                        <View

                            style={{
                                height: SCREEN_HEIGHT,
                                width: '94%',
                                borderRadius: 14,
                                paddingVertical: 20,
                                //alignItems: 'center',
                                backgroundColor: Dark ? colors.dark : colors.white,
                                // justifyContent: 'center',
                            }}>

                            <View style={{ width: '100%', alignItems: 'center' }}>
                                <TouchableOpacity
                                    style={{ position: 'absolute', zIndex: 1, alignSelf: 'flex-end', right: 8 }}
                                    onPress={() => {
                                        this.setState({ CategoryModal: false });
                                    }}>
                                    <Entypo
                                        name={'circle-with-cross'}
                                        size={24}
                                        color={'#1872ea'}
                                        //color={'#fff'}
                                        style={{ marginLeft: 5, marginTop: 7 }}
                                    />
                                </TouchableOpacity>


                                <FlatList
                                    data={this.state.categories}
                                    renderItem={({ item, index }) => this._rendercategories(item)}
                                // renderItem={({ item, index }) => this._renderFriend(item)}
                                />




                            </View>

                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType={'fade'}
                    transparent={true}
                    visible={this.state.ModalDistance}
                    onRequestClose={() => this.setState({ ModalDistance: false })}>
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(0,0,0,0.50)',

                        }}>
                        <View

                            style={{
                                height: 200,
                                width: '94%',
                                borderRadius: 14,
                                paddingVertical: 20,
                                //alignItems: 'center',
                                backgroundColor: Dark ? colors.dark : colors.white,
                                // justifyContent: 'center',
                            }}>

                            <View style={{ width: '100%', alignItems: 'center' }}>
                                <TouchableOpacity
                                    style={{ position: 'absolute', zIndex: 1, alignSelf: 'flex-end', right: 8 }}
                                    onPress={() => {
                                        this.setState({ ModalDistance: false });
                                    }}>
                                    <Entypo
                                        name={'circle-with-cross'}
                                        size={24}
                                        color={'#1872ea'}
                                        //color={'#fff'}
                                        style={{ marginLeft: 5, marginTop: 7 }}
                                    />
                                </TouchableOpacity>


                                <Text style={{ color: Dark?colors.white:colors.black, paddingTop: 30 }}>{this.state.selectedValue} miles</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                                    <Text style={{ color: Dark?colors.white:colors.black }}>0 miles</Text>
                                    <Slider
                                        style={{ width: 200, height: 40 }}
                                        minimumValue={this.state.minimumValue}
                                        maximumValue={this.state.maximumValue}
                                        minimumTrackTintColor="#1872ea"
                                        maximumTrackTintColor="#000000"
                                        onValueChange={val => {
                                            this.props.getProductsByCategory({ id: this.state.category_id, distance: val });
                                            this.setState({ selectedValue: parseInt(val) })
                                        }}
                                    />
                                    <Text style={{ color: Dark?colors.white:colors.black }}>100 miles</Text>
                                </View>



                                {/* <TouchableOpacity
                                    style={{ backgroundColor: '#1872ea', padding: 10, borderRadius: 10 }}
                                >
                                    <Text style={{ color: colors.white }}>Apply Filter</Text>
                                </TouchableOpacity> */}

                            </View>

                        </View>
                    </View>
                </Modal>

            </View>
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
        getProductsByCategoryData: state.MarketPlaceReducer.getProductsByCategoryData,
        getProductsByCategoryData_list: state.MarketPlaceReducer.getProductsByCategoryData_list,
        getCategories: state.MarketPlaceReducer.getCategories,
    };
};
const mapDispatchToProps = dispatch => ({
    // Login: data => dispatch(AuthMiddleware.Login(data)),
    // Login: data => dispatch(AuthMiddleware.Login(data)),

    getAllMarketPlaceSponsored: (payload) =>
        dispatch(MarketPlaceMiddleware.getAllMarketPlacesSponsored(payload)),
    getAllMarketPlaceProducts: (payload) =>
        dispatch(MarketPlaceMiddleware.getAllMarketPlacesProducts(payload)),
    getProductsByCategory: (payload) =>
        dispatch(MarketPlaceMiddleware.getProductsByCategory(payload)),
    getCategories: payload => dispatch(MarketPlaceMiddleware.Get_Categories(payload)),

});

export default connect(mapStateToProps, mapDispatchToProps)(ProductByCategory);

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
    sponsorName: {
        paddingTop: 5,
        fontSize: 14,
        color: 'black',
        alignSelf: 'center',
        fontWeight: '500',
        textAlign: 'center',
    },
    sponsorPrice: {
        fontSize: 14,
        color: '#1D9CD9',
        alignSelf: 'center',
        fontWeight: '500',
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
        fontSize: 14,
        marginLeft: 5,
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
    dropDownBtnText: {
        //  color: 'rgb(160,160,160)',
        color: '#000',
        fontSize: 14,
        textAlign: 'left',
    },
    btnStyle: {
        backgroundColor: '#eee',
        alignSelf: 'center',
        width: '100%',
    },
});
