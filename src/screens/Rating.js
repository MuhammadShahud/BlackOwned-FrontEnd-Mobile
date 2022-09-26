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
import { Image, Dimensions, View, Animated, TouchableOpacity, TextInput, Text, FlatList, StyleSheet, Alert } from 'react-native';
import MyHeader from '../components/MyHeader';
import Feather from 'react-native-vector-icons/Feather';
import StarRating from 'react-native-star-rating-widget';
import { imgURL } from '../configs/AxiosConfig';
import { connect } from 'react-redux';
import { AppMiddleware } from '../redux/middleware/AppMiddleware';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { colors } from '../Theme';


// import {Colors} from '../../Styles';



const { width } = Dimensions.get('window');

class Rating extends Component {
    state = {
        rate: 0,
        description: '',
    };

    componentDidMount() {

    }

    handleChangeDescription = value => {
        this.setState({ description: value });
    };
    OnSubmit = () => {
        let { rate, description } = this.state
        if (rate == 0 || description == '') {
            Alert.alert("Note", 'Please fill all fields.')
        }
        else {
            let userData = {
                rate,
                comments: description,
                provider_id: this.props.route?.params?.provider_id,
            }
            this.props.Submit_Rating({
                userData,
            })
            this.props.navigation.goBack()

        }
    }

    render() {
        let Dark = this.props.Dark;
        console.warn('hello:', this.props?.route?.params?.UserImage)
        let USER_IMAGE = this.props?.route?.params?.UserImage
        let USER_NAME = this.props?.route?.params?.UserName
        return (
            <View style={[styles.container, { backgroundColor: Dark ? colors.black : colors.white }]}>
                <MyHeader
                    back notify profile navigation={this.props.navigation}
                    title={'Rating'}
                    onBackPress={() => this.props.navigation.goBack()}
                />
                <KeyboardAwareScrollView style={{ height: '100%', padding: 20, backgroundColor: Dark ? colors.black : colors.white }}>
                    <View style={{ backgroundColor: Dark ? colors.black : colors.white, alignItems: 'center' }}>
                        <Image
                            source={USER_IMAGE ? { uri: imgURL + USER_IMAGE }
                                : require('../assets/user.png')}
                            style={[styles.profileImg, { tintColor: !USER_IMAGE && Dark ? colors.white : null }]} />
                        <View style={{ alignItems: 'center' }}>
                            <View>
                                <Text style={[styles.ProfileName, { color: Dark ? colors.white : colors.black }]}>{USER_NAME}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ alignSelf: 'center' }}>
                                    <StarRating
                                        rating={this.state.rate}
                                        onChange={(value) => this.setState({ rate: value })}
                                        color={'#1D9CD9'}
                                        starSize={30}
                                        maxStars={5}
                                        starStyle={{}}
                                    />
                                </View>
                            </View>
                        </View>
                        <TextInput
                            placeholder="Description"
                            style={[styles.input, { height: 235, textAlignVertical: 'top' }]}
                            value={this.state.description}
                            onChangeText={this.handleChangeDescription}
                        />
                        <View>
                            <View style={{ marginVertical: 20 }}>
                                <TouchableOpacity onPress={() => this.OnSubmit()}
                                    style={{ borderRadius: 2, backgroundColor: '#1872ea', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 50 }}>
                                    <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>Submit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        );
    }
}
const mapStateToProps = state => ({
    user: state.AuthReducer.user,
    Dark: state.AppReducer.darkmode,
});
const mapDispatchToProps = dispatch => ({
    Submit_Rating: paylaod => dispatch(AppMiddleware.Submit_Rating(paylaod)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Rating);
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
        backgroundColor: '#fff',
        flex: 1,
        elevation: 2,
        alignItems: 'center',
        //   borderTopEndRadius: 20,
        //   borderTopLeftRadius: 20,
        overflow: 'hidden',
    },
    profileImg: {
        width: 120,
        height: 120,
    },
    teamsListContainer: {
        justifyContent: 'space-between',
    },
    ProfileName: {
        padding: 8,
        fontSize: 20,
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
    input: {
        width: '100%',
        marginVertical: 25,
        paddingLeft: 12,
        alignSelf: 'center',
        backgroundColor: '#eee',
        borderWidth: 0.5,
        borderColor: 'black',


    },
});
