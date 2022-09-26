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
import { Image, Dimensions, View, Animated, TouchableOpacity, Text, FlatList, StyleSheet } from 'react-native';
import MyHeader from '../../components/MyHeader';
import Feather from 'react-native-vector-icons/Feather';
import StarRating from 'react-native-star-rating-widget';
import Slider from 'rn-range-slider';
import SelectDropdown from 'react-native-select-dropdown';
import CheckBox from '@react-native-community/checkbox';

// import {Colors} from '../../Styles';



const { width } = Dimensions.get('window');

export default class ServiceDetails extends Component {
    state = {
        categories: ['Realtors', 'Artists', 'Musicians',],
        toggleCheckBox1: false, toggleCheckBox2: false, toggleCheckBox3: false,

    };

    componentDidMount() {
        // Animated.timing(this.rotation, {
        //   toValue: 1,
        //   duration: 1000,
        //   useNativeDriver: true,
        // }).start();
    }

    render() {

        return (
            <View style={styles.container}>
                <MyHeader
                    back notify profile navigation={this.props.navigation}
                    title={this.props.route.name}
                    onBackPress={() => this.props.navigation.goBack()}
                />
                <ScrollView>
                    <View style={{ padding: 20, backgroundColor: '#eee', margin: 10 }}>

                        <Text style={{ fontSize: 16, }}>Filter by</Text>

                        <View style={{ backgroundColor: '#fff', paddingVertical: 10, marginVertical: 20 }}>
                            <Text style={{ fontSize: 16, }}>Distance</Text>

                            {/* <View>
                                <Text></Text>
                            </View> */}

                            <View style={styles.sliderContainer}>
                                <View style={styles.milesContainer}>
                                    <View>
                                        <Text style={styles.miles}>Miles</Text>
                                        <Text style={styles.miles}>0</Text>
                                    </View>

                                    <View>
                                        <Text style={styles.miles}>Miles</Text>
                                        <Text style={styles.miles}>10</Text>
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
                                    onValueChanged={this.onChangePrice}
                                />
                            </View>

                        </View>

                        <View style={{ paddingVertical: 10 }}>
                            <Text style={{ fontSize: 16, }}>Categories</Text>
                        </View>

                        <View style={styles.selectContainer}>
                            <SelectDropdown
                                data={this.state.categories}
                                // defaultValue={this.state.categories[0]}
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
                                onSelect={(selectedItem, index) => {
                                    // this.setState({ selectedRole: selectedItem, selectedUsersIDs: [] });
                                    // this.props.getUsersByType({ role: selectedItem });
                                }}
                            />
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ width: '45%' }}>
                                <View style={{ paddingVertical: 10 }}>
                                    <Text style={{ fontSize: 16, }}>City</Text>
                                </View>
                                <View style={styles.selectContainer}>
                                    <SelectDropdown
                                        data={this.state.categories}
                                        // defaultValue={this.state.categories[0]}
                                        defaultButtonText="Select City"
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
                                        onSelect={(selectedItem, index) => {
                                            // this.setState({ selectedRole: selectedItem, selectedUsersIDs: [] });
                                            // this.props.getUsersByType({ role: selectedItem });
                                        }}
                                    />
                                </View>
                            </View>

                            <View style={{ width: '45%' }}>
                                <View style={{ paddingVertical: 10 }}>
                                    <Text style={{ fontSize: 16, }}>State</Text>
                                </View>
                                <View style={styles.selectContainer}>
                                    <SelectDropdown
                                        data={this.state.categories}
                                        // defaultValue={this.state.categories[0]}
                                        defaultButtonText="Select State"
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
                                        onSelect={(selectedItem, index) => {
                                            // this.setState({ selectedRole: selectedItem, selectedUsersIDs: [] });
                                            // this.props.getUsersByType({ role: selectedItem });
                                        }}
                                    />
                                </View>
                            </View>
                        </View>

                        <View style={{ backgroundColor: '#fff', paddingVertical: 10, marginVertical: 20 }}>
                            <Text style={{ fontSize: 16, }}>Ratings</Text>
                            <View style={styles.sliderContainer}>
                                <View style={styles.milesContainer}>
                                    <View>
                                        <Text style={styles.miles}>1</Text>
                                    </View>

                                    <View>
                                        <Text style={styles.miles}>5</Text>
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
                                    onValueChanged={this.onChangePrice}
                                />
                            </View>
                        </View>

                        <View>
                            <Text style={{ fontSize: 16, }}>Expertise</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <CheckBox
                                        disabled={false}
                                        value={this.state.toggleCheckBox1}
                                        onValueChange={(newValue) => this.setState({ toggleCheckBox1: newValue, toggleCheckBox2: false, toggleCheckBox3: false })}
                                    />
                                    <Text style={{ fontSize: 12.5 }}>Beginner</Text>
                                </View>


                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <CheckBox
                                        disabled={false}
                                        value={this.state.toggleCheckBox2}
                                        onValueChange={(newValue) => this.setState({ toggleCheckBox2: newValue, toggleCheckBox1: false, toggleCheckBox3: false })}
                                    />
                                    <Text style={{ fontSize: 12.5 }}>Intermediate</Text>
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <CheckBox
                                        disabled={false}
                                        value={this.state.toggleCheckBox3}
                                        onValueChange={(newValue) => this.setState({ toggleCheckBox3: newValue, toggleCheckBox1: false, toggleCheckBox2: false })}
                                    />
                                    <Text style={{ fontSize: 12.5 }}>Advanced</Text>
                                </View>
                            </View>
                        </View>

                        <View style={{ marginVertical: 20, alignItems: 'center' }}>
                            <View style={{ width: '80%' }}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('ServiceDetail')}
                                    style={{ borderRadius: 10, backgroundColor: '#1872ea', height: 50, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Search</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

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
        padding: 8,
        fontSize: 16,
        color: 'black',
        alignSelf: 'flex-start',
        fontWeight: '500',
    },
    Profile: {
        padding: 8,
        fontSize: 12,
        // color: 'black',
        alignSelf: 'flex-end',
        fontWeight: '500',
    },
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
        // paddingVertical: 10,
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
