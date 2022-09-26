import { Box, Button, Heading, HStack, Input, Radio, VStack, Icon } from 'native-base';
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions, TouchableOpacity, Modal, Alert, FlatList } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import SelectDropdown from 'react-native-select-dropdown';
import { connect } from 'react-redux';
import MyHeader from '../../components/MyHeader';
import { IS_IOS, OpenImagePicker } from '../../configs';
import { imgURL } from '../../configs/AxiosConfig';
import { AppMiddleware } from '../../redux/middleware/AppMiddleware';
import Feather from 'react-native-vector-icons/Feather';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { colors } from '../../Theme';
import DateTimePickerModal from 'react-native-modal-datetime-picker';


const { width } = Dimensions.get('window');
class EditProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            f_name: this.props?.user?.user?.f_name ? this.props?.user?.user?.f_name : '',
            l_name: this.props?.user?.user?.l_name ? this.props?.user?.user?.l_name : '',
            name: this.props?.user?.user?.username ? this.props?.user?.user?.username : '',
            phone: this.props?.user?.user?.phone ? this.props?.user?.user?.phone : '',
            address: this.props?.user?.user?.address ? this.props?.user?.user?.address : '',
            country: [],
            selectedCountry: this.props.user.user?.country ? this.props.user.user?.country : "Country",
            selectedCity: this.props.user.user?.city ? this.props.user.user?.city : "City",
            selectedState: this.props.user.user?.state ? this.props.user.user?.state : "State",
            city: [],
            state: [],
            zip: this.props?.user?.user?.zip ? this.props?.user?.user?.zip : '',
            Profile_Image: this.props?.user?.user?.profile_pic ?
                { uri: imgURL + this.props?.user?.user?.profile_pic }
                : require('../../assets/user.png'),
            NewProfile_Image: '',
            gender: ['Male', 'Female'],
            selectedgender: this.props?.user?.user?.gender ? this.props?.user?.user?.gender : 'Gender',
            provider_as: this.props?.user?.user?.provider_as ? this.props?.user?.user?.provider_as : '',
            company_name: this.props?.user?.user?.company_name ? this.props?.user?.user?.company_name : '',
            modalVisible: false,
            geoLocationAddress: this.props?.user?.user?.company_address ? this.props?.user?.user?.company_address : '',
            geoLocationCoordinates: [],
            lat: this.props?.user?.user?.company_lat ? this.props?.user?.user?.company_lat : '',
            lng: this.props?.user?.user?.company_lng ? this.props?.user?.user?.company_lng : '',
            facebook: this.props?.user?.user?.facebook ? this.props?.user?.user?.facebook : '',
            youtube: this.props?.user?.user?.youtube ? this.props?.user?.user?.youtube : '',
            instagram: this.props?.user?.user?.instagram ? this.props?.user?.user?.instagram : '',

            searchCountry: '',
            countryModalVisible: false,

            cityModalVisible: false,

            stateModalVisible: false,

            searchCity: '',
            searchState: '',
            searchedStates: [],
            searchedCities: [],
            startTime: this.props?.user?.user?.start_time ? this.props?.user?.user?.start_time : '',
            endTime: this.props?.user?.user?.end_time ? this.props?.user?.user?.end_time : '',
            startTimeModal: false,
            endTimeModal: false,
        };
    }
    componentDidMount = () => {
        console.log('userData', this.props?.user?.user);
        // this.getCountry();
        this.props.getCountries({ name: '' })
            .then((data) => {
                this.OnALLReadySelectedCountryStateCity();
                this.setState({ loader: false })
            })
            .catch(() => this.setState({ loader: false }));
    }

    showStartTimePicker = () => {
        this.setState({ startTimeModal: true });
    };
    hideStartTimePicker = () => {
        this.setState({ startTimeModal: false });
    };
    handleStartTimeConfirm = (time) => {
        // console.warn("A date has been picked: ", time);
        // this.setState({ time: time })
        this.hideStartTimePicker();
        var hours = new Date(time).getHours(); //Current Hours
        var min = new Date(time).getMinutes(); //Current Minutes
        var sec = new Date(time).getSeconds(); //Current Seconds
        this.setState({
            startTime: hours + ':' + min
        });
    };
    showEndTimePicker = () => {
        this.setState({ endTimeModal: true });
    };
    hideEndTimePicker = () => {
        this.setState({ endTimeModal: false });
    };
    handleEndTimeConfirm = (time) => {
        // console.warn("A date has been picked: ", time);
        // this.setState({ time: time })
        this.hideEndTimePicker();
        var hours = new Date(time).getHours(); //Current Hours
        var min = new Date(time).getMinutes(); //Current Minutes
        var sec = new Date(time).getSeconds(); //Current Seconds
        this.setState({
            endTime: hours + ':' + min
        });
    };

    OnALLReadySelectedCountryStateCity = () => {
        let { selectedCountry, selectedState, selectedCity } = this.state
        console.warn("jeeee", selectedCountry);
        if (selectedCountry != 'Country') {
            let country_id = this.props?.countriesData?.filter((value) => value.name.toLowerCase() == selectedCountry.toLowerCase())
            // console.warn("ya", country_id[0]?.id);
            if (selectedState != 'State') {

                this.props.Get_State({
                    id: country_id[0]?.id,
                    callback: response => {
                        if (response) {
                            this.setState({ state: response?.data })
                            console.warn("this.State", this.state.state);

                            let State_id = response?.data?.filter((value) => value.name.toLowerCase() == selectedState.toLowerCase())
                            console.warn("Satte===>", State_id);
                            if (selectedCity != 'City') {
                                this.GetCity(State_id[0]?.id)
                            }

                        } else {
                            console.warn("Error:", response);
                            this.setState({ loading: false, refreshing: false, });

                        }
                    },

                })


                // console.warn("this.State", this.state.state);

                //  console.warn("yaaaa", State_id);
            }
        }

    }

    onChangeSearchCountryText = text => {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.setState({ loader: true, searchCountry: text }, () => {
                console.log(this.state.searchCountry, text, 'TEXT====>');
                this.props.getCountries({ name: text })
                    .then((data) => data ? this.setState({ loader: false }) : this.setState({ loader: false }))
                    .catch(() => this.setState({ loader: false }));
            });
        }, 120);
    };

    onChangeSearchStateText = searchState => {
        let searchedStates = this.state.state.filter((value) => value.name.toLowerCase().includes(searchState.toLowerCase()));
        this.setState({ loader: true, searchedStates });
    };

    onChangeSearchCityText = searchCity => {
        let searchedCities = this.state.city.filter((value) => value.name.toLowerCase().includes(searchCity.toLowerCase()));
        this.setState({ loader: true, searchedCities });
    };


    // getCountry = () => {
    //     this.props.Get_Country({
    //         callback: response => {

    //             if (response) {
    //                 console.warn("country:", response);
    //                 this.setState({ country: response?.data })

    //             } else {
    //                 console.warn("Error:", response);
    //                 this.setState({ loading: false, refreshing: false, });

    //             }
    //         },

    //     })
    // }

    renderCountriesList = item => (

        <TouchableOpacity onPress={() => this.selectCountry(item)} style={{ padding: 20, backgroundColor: '#eee', margin: 5, borderRadius: 10 }}>
            <Text style={{ fontSize: 12, }}>{item?.name}</Text>
        </TouchableOpacity>

    );

    renderStateList = item => (

        <TouchableOpacity onPress={() => this.selectState(item)} style={{ padding: 20, backgroundColor: '#eee', margin: 5, borderRadius: 10 }}>
            <Text style={{ fontSize: 12, }}>{item?.name}</Text>
        </TouchableOpacity>

    );

    renderCityList = item => (

        <TouchableOpacity onPress={() => this.selectCity(item)} style={{ padding: 20, backgroundColor: '#eee', margin: 5, borderRadius: 10 }}>
            <Text style={{ fontSize: 12, }}>{item?.name}</Text>
        </TouchableOpacity>

    );

    selectCountry = (item) => {
        console.warn(item.name);
        this.setState({ selectedCountry: item.name, countryModalVisible: false })
        this.GetState(item.id)
    }

    selectState = (item) => {
        this.setState({ selectedState: item.name, stateModalVisible: false })
        this.GetCity(item.id)
    }

    selectCity = (item) => {
        this.setState({ selectedCity: item.name, cityModalVisible: false })
        // this.GetState(item.id)
    }
    GetState = (id) => {
        console.warn("id", id);
        this.props.Get_State({
            id,
            callback: response => {

                if (response) {
                    console.warn("State=================>:", response.data);
                    this.setState({ state: response.data })

                } else {
                    console.warn("Error:", response);
                    this.setState({ loading: false, refreshing: false, });

                }
            },

        })
    }
    GetCity = (id) => {
        this.props.Get_City({
            id,
            callback: response => {

                if (response) {
                    console.warn("city:", response);
                    this.setState({ city: response?.data })

                } else {
                    console.warn("Error:", response);
                    this.setState({ loading: false, refreshing: false, });

                }
            },

        })
    }
    uploadImage = () => {
        OpenImagePicker(img => {
            let uri_script = img.path.split('/');
            let name = uri_script[uri_script.length - 1];

            let imgObj = {
                name,
                uri: img.path,
                size: img.size,
                type: img.mime,
            };

            this.setState({ Profile_Image: imgObj, NewProfile_Image: imgObj });
        });
    };
    UpdateProfile = () => {
        console.warn("Update Click");
        let { name, phone, address, zip,
            Profile_Image, selectedCountry,
            selectedCity, selectedState, selectedgender,
            company_name, geoLocationAddress,
            provider_as, lat, lng, NewProfile_Image,
            facebook, youtube, instagram, f_name, l_name,
            startTime, endTime,
        } = this.state
        if (this.props.user?.user?.role == 'provider') {

            if (f_name == '' || l_name == '' || phone == '' || address == '' || zip == '' || selectedCountry == '' || selectedCity == '' || selectedState == '' || selectedgender == '' || provider_as == '' || startTime == '' || endTime == '') {
                //     console.warn("name:", name, phone, address, zip, selectedCity, selectedState, selectedgender, provider_as);
                Alert.alert("Note", "Please fill all fields.")
                return
            }
            if (provider_as == 'business') {
                //  console.warn("provider_as == 'business'");
                if (company_name == '' || geoLocationAddress == '') {
                    //    console.warn("Company name:", company_name, 'location:', geoLocationAddress);
                    Alert.alert("Note", "Please fill company details.")
                    return

                }

            }
            // else {
            //    console.warn("hello Api");
            let userData = {
                f_name,
                l_name,
                username: f_name + ' ' + l_name,
                phone,
                address,
                provider_as,
                ...provider_as == 'business' ?
                    {
                        company_name,
                        company_address: geoLocationAddress,
                        lat, lng
                    } : {
                        company_name: '',
                        company_address: '',
                        lat: '',
                        lng: '',

                    },

                gender: selectedgender,
                country: selectedCountry,
                state: selectedState,
                city: selectedCity,
                zip,
                facebook,
                youtube,
                instagram,
                startTime,
                endTime,
                ...NewProfile_Image == '' ?
                    {} : { profile_pic: NewProfile_Image }
            }

            // console.warn("UserData================>: ", userData);


            this.props.UpdateProfileProvider({
                userData,
                callback: response => {

                    if (response) {
                        //  console.warn("DATAAAAAAA:", response);


                    } else {
                        console.warn("Error:", response);
                        this.setState({ loading: false, refreshing: false, });

                    }
                },

            })
            this.props.navigation.navigate('Dashboard')
            // }
        }
        if (this.props.user?.user?.role == 'customer') {

            if (f_name == '' || l_name == '' || phone == '' || address == '' || zip == '' || selectedCity == '' || selectedState == '' || selectedgender == '') {
                Alert.alert("Note", "Please fill all fields.")
            }
            else {

                let userData = {
                    f_name,
                    l_name,
                    username: f_name + ' ' + l_name,
                    phone,
                    address,
                    gender: selectedgender,
                    country: selectedCountry,
                    state: selectedState,
                    city: selectedCity,
                    zip,
                    ...NewProfile_Image == '' ?
                        {} : { profile_pic: NewProfile_Image }
                }

                // console.warn("UserDataCustomer: ", userData);


                this.props.UpdateProfileCustomer({
                    userData,
                    callback: response => {

                        if (response) {
                            //  console.warn("DATA:", response);
                            this.props.navigation.goBack()
                        } else {
                            this.setState({ loading: false, refreshing: false, });

                        }
                    },
                })
                this.props.navigation.navigate('Dashboard')
            }
        }



    }
    render() {
        const { countriesData, getChatsIndexData_list, loader } = this.props;
        // console.warn("countriesData", this.state.selectedCountry);
        let Dark = this.props.Dark;
        return (
            <View style={[styles.container, { backgroundColor: Dark ? colors.black : colors.white }]}>
                <MyHeader title={'Edit Profile'} notify back onBackPress={() => this.props.navigation.goBack()} navigation={this.props.navigation} />
                <KeyboardAwareScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={styles.body}>
                    <HStack
                        padding={5}
                        marginBottom={2}
                        backgroundColor={Dark ? colors.dark : colors.white}
                        space="md"
                        alignItems="center">
                        <Image
                            source={this.state.Profile_Image}
                            style={{
                                width: width * 0.3,
                                height: width * 0.3,
                                borderRadius: 3,
                            }}
                        />
                        <VStack space="lg">
                            <Box>
                                <Heading color={Dark ? colors.white : colors.black} fontSize="lg">{this.props?.user?.user?.username}</Heading>
                                <Text adjustsFontSizeToFit numberOfLines={1} style={{ width: '97%', fontSize: 13, color: Dark ? colors.white : colors.dark }}>{this.props?.user?.user?.email}</Text>
                            </Box>
                            <Button onPress={this.uploadImage} backgroundColor="primary.100" maxWidth={150}>
                                Change Photo
                            </Button>
                        </VStack>
                    </HStack>
                    {/* <View style={{ marginBottom: 5 }}>
                        <Input
                            placeholder="Username"
                            style={styles.input}
                            onChangeText={name => this.setState({ name })}
                            value={this.state.name}
                        />
                    </View> */}
                    <View style={{ marginBottom: 10, backgroundColor: colors.white }}>
                        <Input
                            placeholder="Frist Name"
                            style={[styles.input]}
                            onChangeText={f_name => this.setState({ f_name })}
                            value={this.state.f_name}
                        />
                    </View>
                    <View style={{ marginBottom: 10, backgroundColor: colors.white }}>
                        <Input
                            placeholder="Last Name"
                            style={styles.input}
                            value={this.state.l_name}
                            onChangeText={l_name => this.setState({ l_name })}
                        />
                    </View>
                    <View style={{ marginBottom: 5, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: '10%' }}>
                            <Text style={{ textAlign: 'center', color: Dark ? colors.white : colors.black }}>
                                +1
                            </Text>
                        </View>
                        <View style={{ width: '90%', backgroundColor: colors.white }}>
                            <Input
                                placeholder="Contact no"
                                style={styles.input}
                                onChangeText={phone => this.setState({ phone })}
                                maxLength={10}
                                value={this.state.phone}
                                keyboardType={'numeric'}
                            />
                        </View>
                    </View>
                    <View style={{ marginBottom: 5, backgroundColor: colors.white }}>
                        <Input
                            placeholder="Address"
                            style={styles.input}
                            onChangeText={address => this.setState({ address })}
                            value={this.state.address}
                        />
                    </View>
                    {/* <View style={{ marginBottom: 5, backgroundColor: colors.white }}>
                        <Input
                            placeholder="Start Time"
                            style={styles.input}
                            onChangeText={startTime => this.setState({ startTime })}
                            value={this.state.startTime}
                        />
                    </View>
                    <View style={{ marginBottom: 5, backgroundColor: colors.white }}>
                        <Input
                            placeholder="End Time"
                            style={styles.input}
                            onChangeText={endTime => this.setState({ endTime })}
                            value={this.state.endTime}
                        />
                    </View> */}
                    {
                        this.props.user?.user?.role == 'provider' ?
                            <View>
                                <TouchableOpacity onPress={this.showStartTimePicker} style={[styles.input, { padding: 15, alignItems: 'center' }]}>

                                    {this.state.startTime == '' ? (
                                        <Text>Start Time</Text>
                                    ) : (
                                        <Text>{this.state.startTime}</Text>
                                        // null
                                    )}
                                    <DateTimePickerModal

                                        isVisible={this.state.startTimeModal}
                                        mode="time"
                                        locale="en_GB"
                                        is24Hour={false}
                                        onConfirm={this.handleStartTimeConfirm}
                                        onCancel={this.hideStartTimePicker}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={this.showEndTimePicker} style={[styles.input, { padding: 15, alignItems: 'center' }]}>

                                    {this.state.endTime == '' ? (
                                        <Text>End Time</Text>
                                    ) : (
                                        <Text>{this.state.endTime}</Text>
                                        // null
                                    )}
                                    <DateTimePickerModal

                                        isVisible={this.state.endTimeModal}
                                        mode="time"
                                        locale="en_GB"
                                        is24Hour={false}
                                        onConfirm={this.handleEndTimeConfirm}
                                        onCancel={this.hideEndTimePicker}
                                    />
                                </TouchableOpacity>
                            </View>
                            : null
                    }

                    <View style={styles.selectContainer}>
                        <SelectDropdown
                            data={this.state.gender}
                            // defaultValue={'Gender'}
                            defaultButtonText={this.state.selectedgender}
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
                                this.setState({ selectedgender: selectedItem });
                                // this.props.getUsersByType({ role: selectedItem });
                            }}
                        />
                    </View>
                    {this.props.user?.user?.role == 'provider' ? (
                        <Radio.Group
                            name="myRadioGroup"
                            value={this.state.provider_as}
                            flexDirection="row"
                            // style={{ justifyContent: 'space-around', width: '100%' }}
                            style={styles.Radioinput}
                            marginBottom={3}
                            tintColor="#1872ea"
                            onChange={nextValue => {
                                this.setState({ provider_as: nextValue });
                            }}>
                            <Radio value="individual" >
                                <Text style={{ color: '#aaa', marginStart: 5 }}>
                                    Individual
                                </Text>
                            </Radio>
                            <Radio marginLeft={5} value="business">
                                <Text style={{ color: '#aaa', marginStart: 5 }}>
                                    Business
                                </Text>
                            </Radio>
                        </Radio.Group>



                    ) : null}

                    {this.state.provider_as == 'business' ? (
                        <View style={{ width: '100%', alignItems: 'center' }}>
                            <View style={{ width: '100%', marginVertical: 5, backgroundColor: colors.white }}>
                                <Input
                                    placeholder="Company Name"
                                    style={styles.input}
                                    value={this.state.company_name}
                                    onChangeText={company_name => this.setState({ company_name })}
                                />
                            </View>
                            <TouchableOpacity style={styles.inputAddress} onPress={() => this.setState({ modalVisible: true })}>
                                {this.state.geoLocationAddress == '' ?
                                    (
                                        <View style={{ height: 50, alignItems: 'flex-start', justifyContent: 'center' }}>
                                            <Text style={{ textAlign: 'center' }}>Select Location</Text>
                                        </View>
                                    ) : (
                                        <View style={{ height: 50, alignItems: 'flex-start', justifyContent: 'center' }}>
                                            <Text style={styles.dropDownBtnText} numberOfLines={1}>{this.state.geoLocationAddress}</Text>
                                        </View>
                                    )}
                            </TouchableOpacity>
                        </View>
                    ) : null}

                    <View style={styles.selectContainer}>

                        <TouchableOpacity onPress={() => this.setState({ countryModalVisible: true })}>
                            {this.state.selectedCountry == '' ?
                                (
                                    <View style={{ height: 50, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ textAlign: 'center', marginHorizontal: 15, color: '#000' }}>Select Country</Text>
                                    </View>
                                ) : (
                                    <View style={{ height: 50, alignItems: 'flex-start', justifyContent: 'center' }}>
                                        <Text numberOfLines={1} style={{ marginHorizontal: 15, color: '#000' }}>{this.state.selectedCountry}</Text>
                                    </View>
                                )}
                        </TouchableOpacity>
                    </View>
                    <View style={styles.selectContainer}>

                        <TouchableOpacity disabled={this.state.selectedCountry == 'Country' ? true : false} onPress={() => this.setState({ stateModalVisible: true })}>
                            {this.state.selectedState == '' ?
                                (
                                    <View style={{ height: 50, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ textAlign: 'center', marginHorizontal: 15, color: '#000' }}>Select State</Text>
                                    </View>
                                ) : (
                                    <View style={{ height: 50, alignItems: 'flex-start', justifyContent: 'center' }}>
                                        <Text numberOfLines={1} style={{ marginHorizontal: 15, color: '#000' }}>{this.state.selectedState}</Text>
                                    </View>
                                )}
                        </TouchableOpacity>
                    </View>
                    <View style={styles.selectContainer}>

                        <TouchableOpacity disabled={this.state.selectedState == 'State' ? true : false} onPress={() => this.setState({ cityModalVisible: true })}>
                            {this.state.selectedCity == '' ?
                                (
                                    <View style={{ height: 50, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ textAlign: 'center', marginHorizontal: 15, color: '#000' }}>Select City</Text>
                                    </View>
                                ) : (
                                    <View style={{ height: 50, alignItems: 'flex-start', justifyContent: 'center' }}>
                                        <Text numberOfLines={1} style={{ marginHorizontal: 15, color: '#000' }}>{this.state.selectedCity}</Text>
                                    </View>
                                )}
                        </TouchableOpacity>

                    </View>
                    <View style={{ marginVertical: 5, backgroundColor: colors.white }}>
                        <Input
                            placeholder="Zip code"
                            style={styles.input}
                            onChangeText={zip => this.setState({ zip })}
                            value={this.state.zip}
                            keyboardType={'numeric'}
                            maxLength={6}
                        />
                    </View>
                    {this.props.user?.user?.role == 'provider' ? (
                        <>
                            <Text style={{ marginVertical: 5, color: '#000' }}>Social media links:</Text>
                            <View style={{ marginBottom: 5, backgroundColor: colors.white }}>
                                <Input
                                    placeholder='www.facebook.com/xxxx'
                                    style={styles.input}
                                    onChangeText={facebook => this.setState({ facebook })}
                                    value={this.state.facebook}

                                />
                            </View>
                            <View style={{ marginBottom: 5, backgroundColor: colors.white }}>
                                <Input
                                    placeholder='www.instagram.com/xxxx'
                                    style={styles.input}
                                    onChangeText={instagram => this.setState({ instagram })}
                                    value={this.state.instagram}

                                />
                            </View>
                            <View style={{ marginBottom: 5, backgroundColor: colors.white }}>
                                <Input
                                    placeholder='www.youtube.com/xxxx'
                                    style={styles.input}
                                    onChangeText={youtube => this.setState({ youtube })}
                                    value={this.state.youtube}

                                />
                            </View>

                        </>
                    ) : null}
                    <TouchableOpacity
                        onPress={() => this.UpdateProfile()}
                        //backgroundColor="primary.100"
                        style={{
                            width: '100%',
                            borderRadius: 4,
                            marginVertical: 5,
                            height: 45,
                            marginVertical: 10,
                            backgroundColor: "#1872ea",
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 10,
                        }}>
                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Update</Text>
                    </TouchableOpacity>
                </KeyboardAwareScrollView>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setState({ modalVisible: false });
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Select Location</Text>
                            <GooglePlacesAutocomplete
                                placeholder='Search'
                                GooglePlacesDetailsQuery={{ fields: "geometry" }}
                                onPress={(data, details = null) => {

                                    this.setState(
                                        {
                                            geoLocationAddress: data.description, // selected address
                                            geoLocationCoordinates: `${details.geometry.location.lat},${details.geometry.location.lng}`, // selected coordinates,
                                            modalVisible: false,
                                            lat: details.geometry.location.lat,
                                            lng: details.geometry.location.lng,
                                        }
                                    );
                                    // console.warn(data, details);
                                }}
                                value={this.state.geoLocationAddress}
                                onChangeText={this.state.geoLocationAddress}
                                fetchDetails={true}
                                onBlur={() => console.warn(("ok"))}
                                styles={{
                                    container: {
                                        width: "100%",
                                    },
                                    textInputContainer: {
                                        elevation: 5,
                                        backgroundColor: "#fff",
                                        borderRadius: 5,
                                    },
                                }}
                                query={{
                                    key: 'AIzaSyBBVMEPDktEjcindc7_NjCpFWsSWVspyKI',
                                    language: 'en',
                                }}
                            />
                        </View>
                    </View>
                </Modal>
                {/* CountryModal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.countryModalVisible}
                    onRequestClose={() => {
                        this.setState({ countryModalVisible: false });
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={() => this.setState({ countryModalVisible: false })}>
                                <AntDesign name={'back'} size={25} color={'#000'} />
                            </TouchableOpacity>
                            <Text style={styles.modalText}>Select Country</Text>
                            <HStack
                                backgroundColor="#eee"
                                marginTop="2"
                                borderRadius={10}
                                alignItems="center"
                                paddingX="3">
                                <View style={{ flexDirection: 'column', width: '100%' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', width: '95%' }}>
                                        <Icon as={Feather} name="search" size="sm" color="#aaa" />
                                        <View style={{ width: '90%', }}>
                                            <Input fontSize={14} placeholder="Search" borderWidth={0} onChangeText={this.onChangeSearchCountryText} />
                                        </View>
                                    </View>
                                </View>
                            </HStack>
                            <View style={{ width: '100%', justifyContent: 'flex-start' }}>
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    data={this.props.countriesData}
                                    renderItem={({ item, index }) => this.renderCountriesList(item)}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>
                {/* CountryModal */}

                {/* CityModal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.cityModalVisible}
                    onRequestClose={() => {
                        this.setState({ cityModalVisible: false });
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={() => this.setState({ cityModalVisible: false })}>
                                <AntDesign name={'back'} size={25} color={'#000'} />
                            </TouchableOpacity>
                            <Text style={styles.modalText}>Select City</Text>

                            <HStack
                                backgroundColor="#eee"
                                marginTop="2"
                                borderRadius={10}
                                alignItems="center"
                                paddingX="3">
                                <View style={{ flexDirection: 'column', width: '100%' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%' }}>
                                        <Icon as={Feather} name="search" size="sm" color="#aaa" />
                                        <View style={{ width: '90%', }}>
                                            <Input fontSize={14} placeholder="Search" borderWidth={0} onChangeText={this.onChangeSearchCityText} />
                                        </View>
                                    </View>
                                </View>
                            </HStack>
                            <View style={{ width: '100%', justifyContent: 'flex-start' }}>
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    data={this.state.searchedCities.length > 0 ? this.state.searchedCities : this.state.city}
                                    renderItem={({ item, index }) => this.renderCityList(item)}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>
                {/* CityModal */}

                {/* StateModal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.stateModalVisible}
                    onRequestClose={() => {
                        this.setState({ stateModalVisible: false });
                    }}
                >

                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={() => this.setState({ stateModalVisible: false })}>
                                <AntDesign name={'back'} size={25} color={'#000'} />
                            </TouchableOpacity>
                            <Text style={styles.modalText}>Select State</Text>

                            <HStack
                                backgroundColor="#eee"
                                marginTop="2"
                                borderRadius={10}
                                alignItems="center"
                                paddingX="3">
                                <View style={{ flexDirection: 'column', width: '100%' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%' }}>
                                        <Icon as={Feather} name="search" size="sm" color="#aaa" />
                                        <View style={{ width: '90%', }}>
                                            <Input fontSize={14} placeholder="Search" borderWidth={0} onChangeText={this.onChangeSearchStateText} />
                                        </View>
                                    </View>
                                </View>
                            </HStack>
                            <View style={{ width: '100%', justifyContent: 'flex-start' }}>
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    data={this.state.searchedStates.length > 0 ? this.state.searchedStates : this.state.state}
                                    renderItem={({ item, index }) => this.renderStateList(item)}
                                />
                            </View>
                        </View>
                    </View>

                </Modal>
                {/* StateModal */}
            </View>
        );
    }
}
const mapStateToProps = state => ({
    user: state.AuthReducer.user,
    countriesData: state.AppReducer.countriesData,
    Dark: state.AppReducer.darkmode,
});
const mapDispatchToProps = dispatch => ({
    UpdateProfileProvider: paylaod => dispatch(AppMiddleware.UpdateProfileProvider(paylaod)),
    UpdateProfileCustomer: paylaod => dispatch(AppMiddleware.UpdateProfileCustomer(paylaod)),
    Get_Country: paylaod => dispatch(AppMiddleware.Get_Country(paylaod)),
    getCountries: paylaod => dispatch(AppMiddleware.getCountries(paylaod)),

    Get_State: paylaod => dispatch(AppMiddleware.Get_State(paylaod)),
    Get_City: paylaod => dispatch(AppMiddleware.Get_City(paylaod)),
});


export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    body: {
        width: '92%',
        alignSelf: 'center',
    },
    input: {
        width: '100%',
        height: 50,
        borderRadius: 3,
        textAlign: 'left',
        marginBottom: 5,
        backgroundColor: '#eee',
        elevation: 3,
        borderWidth: 0,
        alignSelf: 'center',
        marginVertical: 5,
        paddingLeft: 15,

    },
    Radioinput: {
        width: '100%',
        // justifyContent: 'space-around',
        height: 50,
        borderRadius: 3,
        textAlign: 'left',
        marginBottom: 5,
        backgroundColor: '#eee',
        elevation: 3,
        borderWidth: 0,
        alignItems: 'center',
        marginVertical: 5,
        paddingLeft: 15,
    },
    inputAddress: {
        width: '100%',
        // justifyContent: 'space-around',
        height: 50,
        borderRadius: 3,
        textAlign: 'left',
        marginBottom: 5,
        backgroundColor: '#eee',
        elevation: 3,
        borderWidth: 0,
        alignItems: 'center',
        marginVertical: 5,
        // paddingLeft: 15,
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
    selectContainer: {
        backgroundColor: '#eee',
        marginVertical: 5,
        elevation: 3,
        // paddingVertical: 10,
    },
    selectContainerHalf: {
        backgroundColor: '#eee',
        width: '40%'
        // paddingVertical: 10,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        // alignItems: "center",
    },
    modalView: {
        flex: 1,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 25,
        alignItems: "center",
        flexDirection: 'column',
        paddingTop: IS_IOS ? 40 : null,

    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
})