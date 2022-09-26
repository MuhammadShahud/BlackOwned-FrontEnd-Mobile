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
import { Image, Dimensions, View, Animated, TouchableOpacity, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Modal } from 'react-native';
import MyHeader from '../../components/MyHeader';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import StarRating from 'react-native-star-rating-widget';
import { connect } from 'react-redux';
import { ServicesMiddleware } from '../../redux/middleware/ServicesMiddleware';
import { imgURL } from '../../configs/AxiosConfig';
// import {Colors} from '../../Styles';
import SelectDropdown from 'react-native-select-dropdown';
import CheckBox from '@react-native-community/checkbox';
import Slider from 'rn-range-slider';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { IS_IOS } from '../../configs';
import { colors } from '../../Theme';

const { width } = Dimensions.get('window');

class ServiceDetails extends Component {

    state = {
        loader: true,
        search: '',
        detailsData: [],
        modalVisible: false,
        distanceMin: '',
        distanceMax: '',
        ratingMin: '',
        ratingMax: '',
        dataID: '',
        selectedDataID: '',
        lng: '',
        lat: '',
    };


    onChangeDistance = (low, high) => {
        // console.warn(value);
        this.setState({ distanceMin: low, distanceMax: high });
    };

    onChangeRating = (low, high) => {
        // console.warn(value);
        this.setState({ ratingMin: low, ratingMax: high });
    };

    Search = () => {
        const { distanceMin, distanceMax, ratingMin, ratingMax, search, selectedDataID, lat, lng } = this.state;
        const { user } = this.props;
        console.warn('searchModal', selectedDataID, distanceMin, distanceMax, ratingMin, ratingMax, lat, lng);
        this.props.getAllProviders({
            name: search,
            serviceid: selectedDataID,
            min_distance: distanceMin,
            max_distance: distanceMax,
            min_rating: ratingMin,
            max_rating: ratingMax,
            lat: lat,
            lng: lng,
        })
        this.setState({ modalVisible: false })
    };

    componentDidMount() {
        let data = this.props.route.params?.data
        const { user } = this.props;
        this.setState({ lat: user?.user.lat, lng: user?.user.lng })
        this.props.getAllProviders({ name: '', serviceid: data?.id })

        this.props.getAllServices({ name: '' })
        // .then(() => this.setState({ loader: false }))
        // .catch(() => this.setState({ loader: false }));
    }

    onPressLoadMore = () => {
        this.setState({ loader: true }, () => {
            const { getProvidersData } = this.props;
            this.props
                .getAllProviders(getProvidersData.next_page_url, '')
                .then(() => this.setState({ loader: false }))
                .catch(() => this.setState({ loader: false }));
        });
    };

    renderLoaderMoreButton = () => {
        const { getProvidersData } = this.props;
        const { loader } = this.state;
        return getProvidersData.next_page_url ? (
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
        let data = this.props.route.params?.data
        this.setState({ loader: true }, () => {
            this.props.getAllProviders({ name: '', serviceid: data?.id })
        });
    };


    onChangeSearchText = text => {
        let data = this.props.route.params.data
        clearTimeout(this.searchTimeout)
        this.searchTimeout = setTimeout(() => {
            this.setState({ loader: true, search: text }, () => {
                console.log(this.state.search, text, 'TEXT====>');
                this.props
                    .getAllProviders({ name: text, serviceid: data?.id })
                // .then(() => this.setState({ loader: false }))
                // .catch(() => this.setState({ loader: false }));
            });
        }, 500)

    };

    renderUsersList = item => (

        <TouchableOpacity onPress={() => this.props.navigation.navigate('OtherProfile', { data: item })}>
            <View style={{ flexDirection: 'row', backgroundColor: '#eee', padding: 10, marginVertical: 5, width: '100%' }}>
                <View style={{ flexDirection: 'row', width: '70%' }}>
                    <Image source={item?.profile_pic ?
                        {
                            uri: imgURL + item?.profile_pic
                        } : require('../../assets/user.png')
                    } style={styles.profileImg} />

                    <View style={{ paddingHorizontal: 10, justifyContent: 'center' }}>
                        <Text style={styles.ProfileName}>{item?.username}</Text>
                        {item?.miles ? <View style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center' }}>
                            <Image source={require('../../assets/blueMarker.png')} style={{ width: 15, height: 15 }} />
                            <Text style={{ fontSize: 11 }}>{item?.miles} miles away</Text>
                        </View>
                            : null}
                    </View>
                </View>

                <View style={{ width: '30%', justifyContent: 'center' }}>
                    <Text style={styles.Profile}>{item?.service_name?.name}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <View style={{ alignSelf: 'center', marginHorizontal: 5 }}>
                            <StarRating
                                rating={item?.rating?.rating}
                                onChange={() => null}
                                color={'#1D9CD9'}
                                starSize={13}
                                maxStars={5}
                                starStyle={{ width: 2 }}
                            />
                        </View>
                        <Text style={{ textAlignVertical: 'center', fontSize: 12 }}>{item?.rating?.rating}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>

    );

    render() {
        const { getProvidersData, getProvidersData_list, loader, getServicesData_list, user } = this.props;
        // console.warn('DataaUserrrr', user.user);
        // console.warn(this.state.distanceMin,this.state.distanceMax)
        let Dark = this.props.Dark;
        // const { detailsData } = this.state;
        console.warn('Dataaaa', getProvidersData_list);
        return (
            <View style={[styles.container, { backgroundColor: Dark ? colors.black : colors.white }]}>
                <MyHeader
                    back notify profile navigation={this.props.navigation}
                    title={'Service Details'}
                    onBackPress={() => this.props.navigation.goBack()}
                />
                <ScrollView>
                    <View style={{ paddingHorizontal: 20 }}>
                        <HStack
                            backgroundColor="#eee"
                            marginTop="2"
                            borderRadius={10}
                            alignItems="center"
                            paddingX="3">
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                {/* <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%' }}>
                                    <Icon as={Feather} name="search" size="sm" color="#aaa" />
                                    <Input fontSize={14} placeholder="Search Service Provider" borderWidth={0} onChangeText={this.onChangeSearchText} />
                                </View> */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                                    <View style={{ width: '10%' }}>
                                        <Icon as={Feather} name="search" size="sm" color="#aaa" />
                                    </View>
                                    <View style={{ width: '80%' }}>
                                        <Input fontSize={14} placeholder="Search" borderWidth={0} onChangeText={this.onChangeSearchText} />
                                    </View>
                                    <View style={{ width: '10%' }}>
                                        <TouchableOpacity
                                            onPress={() => this.setState({ modalVisible: true })}>
                                            <FontAwesome name={"filter"} size={20} color={"#000"} />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </View>
                        </HStack>
                        {!getProvidersData ? (
                            <ActivityIndicator
                                size={'large'}
                                color={'#1D9CD9'}
                                style={styles.loadMoreContentContainer}
                            />
                        ) : null}
                        {getProvidersData_list && getProvidersData_list?.length ? (
                            <FlatList
                                refreshControl={
                                    <RefreshControl
                                        refreshing={loader}
                                        onRefresh={this.onRefreshServices}
                                    />
                                }
                                style={styles.flex1}
                                showsVerticalScrollIndicator={false}
                                data={getProvidersData_list}
                                renderItem={({ item, index }) => this.renderUsersList(item)}
                                ListFooterComponent={this.renderLoaderMoreButton()}
                            />
                        ) : null}

                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={this.state.modalVisible}
                            onRequestClose={() => {
                                // Alert.alert("Modal has been closed.");
                                this.setState({ modalVisible: false });
                            }}
                        >
                            <View style={[styles.centeredView, { backgroundColor: Dark ? colors.black : colors.white }]}>
                                <View style={[styles.modalView, { backgroundColor: Dark ? colors.black : colors.white }]}>
                                    {/* <Text style={styles.modalText}>Hello World!</Text> */}

                                    {/* Modal Start */}
                                    <View style={{ padding: 20, backgroundColor: Dark ? colors.black : colors.white, margin: 10, flex: 1 }}>

                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={{ fontSize: 16, marginLeft: IS_IOS ? 20 : 0, color: Dark ? colors.white : colors.black }}>Filter by</Text>
                                            <TouchableOpacity onPress={() => this.setState({ modalVisible: false })}>
                                                <Text style={{ fontSize: 16, marginRight: IS_IOS ? 20 : 0, color: Dark ? colors.white : colors.black }}>close</Text>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={{ backgroundColor: '#fff', paddingVertical: 10, marginVertical: 20, backgroundColor: Dark ? colors.black : colors.white }}>
                                            <Text style={{ fontSize: 16, marginLeft: IS_IOS ? 20 : 0, color: Dark ? colors.white : colors.black }}>Distance</Text>

                                            <View style={styles.sliderContainer}>
                                                <View style={styles.milesContainer}>
                                                    <View>
                                                        <Text style={[styles.miles, { color: Dark ? colors.white : colors.black }]}>Miles</Text>
                                                        <Text style={[styles.miles, { color: Dark ? colors.white : colors.black }]}>0</Text>
                                                    </View>

                                                    <View>
                                                        <Text style={[styles.miles, { color: Dark ? colors.white : colors.black }]}>Miles</Text>
                                                        <Text style={[styles.miles, { color: Dark ? colors.white : colors.black }]}>10</Text>
                                                    </View>
                                                </View>

                                                <Slider
                                                    style={{
                                                        alignItems: 'stretch',
                                                        width: '100%',
                                                    }}
                                                    min={0}
                                                    max={10}
                                                    step={1}
                                                    allowLabelOverflow={false}
                                                    floatingLabel
                                                    renderThumb={() => <View style={styles.thumb} />}
                                                    renderRail={() => <View style={styles.rail} />}
                                                    renderRailSelected={() => <View style={styles.selectedRail} />}
                                                    renderNotch={() => <View style={styles.notch} />}
                                                    // onValueChanged={(low, high) => this.onChangeDistance(low, high)}
                                                    onValueChanged={this.onChangeDistance}

                                                />
                                            </View>

                                        </View>

                                        <View style={{ paddingVertical: 10 }}>
                                            <Text style={{ fontSize: 16, marginLeft: IS_IOS ? 20 : 0, color: Dark ? colors.white : colors.black }}>Categories</Text>
                                        </View>

                                        <View style={styles.selectContainer}>
                                            <SelectDropdown
                                                data={getServicesData_list}
                                                rowTextForSelection={(item) => <Text>{item?.name}</Text>}
                                                buttonTextAfterSelection={(selectedItem, index) => {
                                                    return selectedItem.name;
                                                }}
                                                // defaultValue={null}
                                                defaultButtonText="Select Category"
                                                dropdownIconPosition="right"
                                                renderDropdownIcon={() => {
                                                    return (
                                                        <Image
                                                            resizeMode="contain"
                                                            source={require('../../assets/dropdown.png')}
                                                            style={{ height: 15, width: 15 }}
                                                        />
                                                    );
                                                }}
                                                buttonTextStyle={styles.dropDownBtnText}
                                                buttonStyle={styles.btnStyle}
                                                onSelect={(selectedItem, index) => { this.setState({ selectedDataID: selectedItem.id }) }}
                                            // onSelect={(selectedItem, index) => {
                                            //     // this.setState({ selectedRole: selectedItem, selectedUsersIDs: [] });
                                            //     // this.props.getUsersByType({ role: selectedItem });
                                            // }}
                                            />
                                        </View>



                                        <View style={{ backgroundColor: Dark ? colors.black : colors.fff, paddingVertical: 10, marginVertical: 20 }}>
                                            <Text style={{ fontSize: 16, marginLeft: IS_IOS ? 20 : 0, color: Dark ? colors.white : colors.black }}>Ratings</Text>
                                            <View style={styles.sliderContainer}>
                                                <View style={styles.milesContainer}>
                                                    <View>
                                                        <Text style={[styles.miles, { color: Dark ? colors.white : colors.black }]}>1</Text>
                                                    </View>

                                                    <View>
                                                        <Text style={[styles.miles, { color: Dark ? colors.white : colors.black }]}>5</Text>
                                                    </View>
                                                </View>
                                                <Slider
                                                    style={{
                                                        alignItems: 'stretch',
                                                        width: '100%',
                                                    }}
                                                    min={1}
                                                    max={5}
                                                    step={1}
                                                    allowLabelOverflow={false}
                                                    floatingLabel
                                                    renderThumb={() => <View style={styles.thumb} />}
                                                    renderRail={() => <View style={styles.rail} />}
                                                    renderRailSelected={() => <View style={styles.selectedRail} />}
                                                    renderNotch={() => <View style={styles.notch} />}
                                                    onValueChanged={this.onChangeRating}
                                                />
                                            </View>
                                        </View>


                                        <View style={{ marginVertical: 20, alignItems: 'center' }}>
                                            <View style={{ width: '80%' }}>
                                                <TouchableOpacity
                                                    // onPress={() => this.Search
                                                    onPress={this.Search}
                                                    // }
                                                    style={{ borderRadius: 10, backgroundColor: '#1872ea', height: 50, alignItems: 'center', justifyContent: 'center' }}>
                                                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Search</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                    {/* Modal End */}
                                </View>
                            </View>
                        </Modal>

                    </View>
                </ScrollView>
            </View>
        );
    }
}
const mapStateToProps = state => {
    return {
        // role: state.Auth.role,
        user: state.AuthReducer.user,
        Dark: state.AppReducer.darkmode,
        getProvidersData: state.ServicesReducer.getProvidersData,
        getProvidersData_list: state.ServicesReducer.getProvidersData_list,
        getServicesData: state.ServicesReducer.getServicesData,
        getServicesData_list: state.ServicesReducer.getServicesData_list,
    };
};
const mapDispatchToProps = dispatch => ({
    // Login: data => dispatch(AuthMiddleware.Login(data)),
    // Login: data => dispatch(AuthMiddleware.Login(data)),

    getAllProviders: (payload) =>
        dispatch(ServicesMiddleware.getAllProviders(payload)),
    getAllServices: (payload) =>
        dispatch(ServicesMiddleware.getAllServices(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ServiceDetails);

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
        backgroundColor: '#eee',
        flex: 1,
        elevation: 2,
        alignItems: 'center',
        //   borderTopEndRadius: 20,
        //   borderTopLeftRadius: 20,
        overflow: 'hidden',
    },
    profileImg: {
        width: 80,
        height: 80,
    },
    teamsListContainer: {
        justifyContent: 'space-between',
    },
    ProfileName: {
        // padding: 8,
        fontSize: 14,
        color: 'black',
        alignSelf: 'flex-start',
        fontWeight: '500',
    },
    Profile: {
        // padding: 8,
        fontSize: 12,
        // color: 'black',
        alignSelf: 'flex-end',
        fontWeight: '500',
    },
    //Modal
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    //Filter
    sliderContainer: {
        width: '85%',
        alignSelf: 'center',
        marginVertical: 12,
        alignItems: 'flex-end',
    },
    thumb: {
        width: 14,
        height: 14,
        borderRadius: 16,
        borderColor: '#EFF8FD',
        backgroundColor: '#1D9CD9',
    },
    rail: {
        flex: 1,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#76C0E4',
    },
    selectedRail: {
        height: 4,
        backgroundColor: '#4499FF',
        borderRadius: 2,
    },
    notch: {
        width: 8,
        height: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#4499FF',
        borderLeftWidth: 4,
        borderRightWidth: 4,
        borderTopWidth: 8,
    },
    milesContainer: {
        width: '100%',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    miles: {
        fontSize: 12,
        color: 'black',
        // paddingLeft: 16,
        textAlign: 'center'
    },
    selectContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: IS_IOS ? 10 : 0,
    },
    selectContainerHalf: {
        backgroundColor: '#fff',
        width: '40%'
        // paddingVertical: 10,
    },
    dropDownBtnText: {
        color: '#636060',
        fontSize: 14,
        textAlign: 'left',
    },
    btnStyle: {
        backgroundColor: '#fff',
        alignSelf: 'center',
        width: '100%',
    },
});
