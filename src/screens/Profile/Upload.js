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
import { Image, Dimensions, View, Animated, TouchableOpacity, Text, FlatList, StyleSheet, TextInput, Alert } from 'react-native';
import MyHeader from '../../components/MyHeader';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { OpenImagePicker } from '../../configs';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { connect } from 'react-redux';
import { PostMiddleware } from '../../redux/middleware/PostMiddleware';
import { createThumbnail } from "react-native-create-thumbnail";
import { colors } from '../../Theme';
// import {Colors} from '../../Styles';



const { width } = Dimensions.get('window');

class Upload extends Component {
    state = {
        description: '',
        title: '',
        image: null,
        loader: false,
        file: null,
        mediaType: null,
        thumb: "",
    };
    componentDidMount() {

    }

    postCreate = async () => {

        let {
            image,
            mediaType,
        } = this.state;
        let thumb = null;
        if (!image) {
            Alert.alert('Warning', 'Please select image/video!');
        }
        else {

            if (image.type.includes("video")) {
                let thumbnail = await createThumbnail({
                    url: image.uri
                })
                let thumb_name_array = thumbnail.path.split("/");
                let thumb_name = thumb_name_array[thumb_name_array.length - 1]

                thumb = {
                    name: thumb_name,
                    type: thumbnail?.mime,
                    uri: thumbnail?.path,
                    size: thumbnail?.size
                }

            }


            let userData = {
                media: image,
                type: mediaType,
                ...thumb ? { thumbnail: thumb } : { thumbnail: null }
            }

            this.props.Store_Post({
                userData,
                uploading: (sent, total) => {
                    console.warn('sent', sent, 'total', total);
                },
                callback: () => {

                }
            })


            this.props.navigation.navigate('UserProfile', { type: 'upload' })
        }
    };

    uploadImage = () => {
        OpenImagePicker = (img => {
            let uri_script = img?.path?.split('/');
            let name = uri_script[uri_script.length - 1];

            let imgObj = {
                name,
                uri: img.path,
                size: img.size,
                type: img.mime,
            };

            this.setState({ image: imgObj });
        });
    };

    selectImage = () => {
        Alert.alert("Select", "Please selection an option", [
            {
                text: "Cancel",
            },
            {
                text: "Camera",
                onPress: () => {
                    try {
                        launchCamera({
                            mediaType: 'mixed'
                        }, (response) => {

                            if (!response.errorCode && !response.didCancel) {
                                let img = response.assets[0];
                                let mediaType = img?.type
                                if (mediaType.includes('image')) {
                                    this.setState({
                                        mediaType: 1,
                                    })

                                }
                                if (mediaType.includes('video')) {
                                    this.setState({
                                        mediaType: 0,
                                    })
                                }
                                this.setState({
                                    image: {
                                        uri: img.uri,
                                        name: img.fileName,
                                        size: img.fileSize,
                                        type: img.type
                                    },

                                    fileDimension: {
                                        height: img.height,
                                        width: img.width
                                    },
                                })
                            } else if (response.didCancel) {
                                console.warn("error", response);
                            }
                        })
                    } catch (error) {
                        console.warn("error", error);
                    }
                }
            },
            {
                text: "Library",
                onPress: () => {
                    try {
                        launchImageLibrary({
                            mediaType: 'mixed'
                        }, (response) => {
                            console.warn("Responce:", response);
                            if (!response.errorCode && !response.didCancel) {
                                let img = response.assets[0];

                                let mediaType = img?.type
                                if (mediaType.startsWith('image')) {
                                    this.setState({
                                        mediaType: 1,
                                    })

                                }
                                if (mediaType.startsWith('video')) {
                                    this.setState({
                                        mediaType: 0,
                                    })
                                }

                                this.setState({
                                    image: {
                                        uri: img.uri,
                                        name: img.fileName,
                                        size: img.fileSize,
                                        type: img.type
                                    },
                                    filterModal: true,
                                    fileDimension: {
                                        height: img.height,
                                        width: img.width
                                    },
                                })
                            } else if (response.didCancel) {
                                console.warn('error', response);
                            }
                        })
                    } catch (error) {
                        console.warn('error', error);
                    }
                }
            },
        ])
    }
    render() {
        let Dark = this.props.Dark;
        // console.warn("mediaType:", this.state.mediaType);
        return (
            <View style={{ flex: 1, backgroundColor: Dark ? colors.black : colors.white }}>
                <MyHeader
                    back notify profile navigation={this.props.navigation}
                    title={this.props.route.name}
                    onBackPress={() => this.props.navigation.goBack()}
                />
                <View
                    style={{
                        backgroundColor: Dark ? colors.black : '#EEEBEB',
                        borderRadius: 20,
                        padding: 10,
                        flex: 0.99,
                        marginVertical: 10,
                    }}>
                    <ScrollView showsVerticalScrollIndicator={false}>

                        <View >
                            {this.state.image?.uri ? (
                                <TouchableOpacity
                                    onPress={this.selectImage}
                                    style={{
                                        backgroundColor: Dark ? colors.dark : '#fff',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: 300,
                                        margin: 15,
                                        borderRadius: 20,
                                    }}>
                                    <Image
                                        source={{ uri: this.state.image?.uri }}
                                        style={{
                                            width: 150,
                                            height: 150,
                                            borderRadius: 12,
                                            // borderWidth: 1,
                                            // borderColor: '#000'

                                        }}
                                    />
                                    <Text style={{ fontWeight: 'bold', fontSize: 18, color: Dark ? colors.white : colors.black }}>
                                        Change Image/Video
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                <View>
                                    <TouchableOpacity
                                        onPress={this.selectImage}
                                        style={{
                                            backgroundColor: Dark ? colors.dark : '#fff',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            height: 300,
                                            margin: 15,
                                            borderRadius: 20,
                                        }}>
                                        <Image
                                            source={require('../../assets/imageIcon.png')}
                                            resizeMode="contain"
                                            style={{ width: 20, height: 20, marginHorizontal: 10 }}
                                        />
                                        <Text style={{ fontWeight: 'bold', fontSize: 18, color: Dark ? colors.white : colors.black }}>
                                            Select Image/Video
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>



                        {/* <View
                            style={{
                                backgroundColor: '#fff',
                                margin: 15,
                                borderRadius: 20,
                            }}>
                            <TextInput
                                style={{ height: 60, textAlignVertical: 'top', padding: 20 }}
                                placeholder="Title...."
                                value={this.state.title}
                                onChangeText={text => this.setState({ title: text })}
                                multiline
                            />
                        </View>

                        <View
                            style={{
                                backgroundColor: '#fff',
                                margin: 15,
                                borderRadius: 20,
                            }}>
                            <TextInput
                                style={{ height: 120, textAlignVertical: 'top', padding: 20 }}
                                placeholder="Give your description here...."
                                value={this.state.description}
                                onChangeText={text => this.setState({ description: text })}
                                multiline
                            />
                        </View> */}

                        <View style={{ marginVertical: 0, marginHorizontal: 20, alignItems: 'center' }}>
                            <Button
                                onPress={this.postCreate}
                                backgroundColor="primary.100"
                                bgColor="#fff"
                                color="primary.100"
                                borderRadius={10}
                                borderWidth={1}
                                borderColor="primary.100"
                                style={{
                                    marginVertical: 10,
                                    width: '50%',
                                    height: 45,
                                }}>
                                <Text style={{ color: '#1872ea' }}>Upload</Text>
                            </Button>
                            {/* onPress={this.postCreate} */}
                        </View>
                    </ScrollView>
                </View>

            </View>
        );
    }
}
const mapStateToProps = state => ({
    Dark: state.AppReducer.darkmode,
})
const mapDispatchToProps = dispatch => ({
    Store_Post: paylaod => dispatch(PostMiddleware.Store_Post(paylaod)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Upload);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        //   paddingHorizontal: 25,
        backgroundColor: "#fff",
    },

    flex1: { flex: 1 },

    tagsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginVertical: 10,
    },
    isSelectedView: {
        backgroundColor: 'green',
        width: 100,
        height: 80,
        padding: 10,
        justifyContent: 'center',
        marginHorizontal: 5,
        borderRadius: 10,
    },
    isNotSelectedView: {
        backgroundColor: '#F8F8F8',
        width: 100,
        height: 80,
        padding: 10,
        justifyContent: 'center',
        marginHorizontal: 5,
        borderRadius: 10,
    },
    confirmationSheetContainer: {
        backgroundColor: '#EFF8FD',
        height: 280,
        paddingHorizontal: 35,
        paddingTop: 20,
    },
    sheetBody: {
        marginVertical: 20,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    closeImage: { width: 60, height: 20 },
});
