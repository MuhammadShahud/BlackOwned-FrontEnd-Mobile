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
import { OpenImagePicker } from '../../configs';
import { connect } from 'react-redux';
import { MarketPlaceMiddleware } from '../../redux/middleware/MarketPlaceMiddleware';
import { imgURL } from '../../configs/AxiosConfig';
import SelectDropdown from 'react-native-select-dropdown';
import { colors } from '../../Theme';
// import {Colors} from '../../Styles';



const { width } = Dimensions.get('window');

class EditProduct extends Component {
    state = {
        name: '',
        price: '',
        discounted_price: '',
        description: '',
        image: null,
        categories: [],
        selectedCategory: '',
        category_id: '',
        productId: '',
    };
    componentDidMount() {
        let data = this.props.route.params.data;
        this.setState({
            name: data?.name,
            price: data?.price,
            discounted_price: data?.discounted_price,
            description: data?.description,
            image: data?.image,
            selectedCategory: data?.category.name,
            category_id: data?.category_id,
            productId: data?.id
        })
        this.props.getCategories()
            .then((data) => this.setState({ categories: data?.data }))
            .catch(() => this.setState({ loader: false }));
    }

    editProduct = () => {
        let {
            name,
            price,
            discounted_price,
            description,
            image,
            category_id,
            productId
        } = this.state;

        if (
            !name ||
            !price ||
            !discounted_price ||
            !description ||
            !image ||
            !category_id ||
            !productId
        ) {
            Alert.alert('Warning', 'Please enter all fields!');
        } else {
            // console.warn(
            //     name,
            //     price,
            //     discounted_price,
            //     description,
            //     image,
            // );
            this.props.updateProduct({
                name,
                price,
                discounted_price,
                description,
                image,
                category_id,
                productId
            })
                .then((data) => data ? this.props.navigation.goBack() : this.setState({ loader: false }))
                .catch(() => this.setState({ loader: false }));

        }
    };


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

            this.setState({ image: imgObj });
        });
    };

    render() {
        let Dark = this.props.Dark;
        const { loader, getCategories } = this.props;
        console.warn('DATAAAA', this.props.route.params.data);
        return (
            <View style={{ flex: 1, backgroundColor: Dark ? colors.black : colors.white }}>
                <MyHeader
                    back notify profile navigation={this.props.navigation}
                    // title={this.props.route.name}
                    title={'Update Product'}
                    onBackPress={() => this.props.navigation.goBack()}
                />
                <ScrollView style={[styles.container, { backgroundColor: Dark ? colors.black : colors.white }]}>

                    <View style={{ paddingHorizontal: 5 }}>
                        <View
                            style={{

                                alignItems: 'center',
                                // borderWidth: 1,
                                // borderColor: '#ccc',
                                // marginHorizontal: '10%',
                                marginVertical: 20,
                                borderRadius: 20,
                                // padding: 20,
                            }}>
                            <View style={{ width: '80%', marginBottom: 10, backgroundColor: colors.white }}>
                                <Input
                                    placeholder="Name"
                                    style={styles.input}
                                    onChangeText={name => this.setState({ name: name })}
                                    value={this.state.name}
                                />
                            </View>
                            <View style={{ width: '80%', marginBottom: 10, backgroundColor: colors.white }}>
                                <Input
                                    placeholder="Price"
                                    keyboardType='numeric'
                                    style={styles.input}
                                    onChangeText={price => this.setState({ price: price })}
                                    value={this.state.price}
                                />
                            </View>
                            <View style={{ width: '80%', marginBottom: 10, backgroundColor: colors.white }}>
                                <Input
                                    placeholder="Discount"
                                    keyboardType='numeric'
                                    style={styles.input}
                                    onChangeText={discount => this.setState({ discounted_price: discount })}
                                    value={this.state.discounted_price}
                                />
                            </View>

                            <View style={{ width: '80%', marginBottom: 10 }}>
                                <SelectDropdown
                                    data={this.state.categories}
                                    // defaultValue={this.state}
                                    defaultButtonText={this.state.selectedCategory}
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
                                        this.setState({ category_id: selectedItem.id });
                                        // this.props.getUsersByType({ role: selectedItem });
                                    }}
                                />
                            </View>

                            <TextInput
                                placeholder={'Description'}
                                multiline
                                style={styles.inputDescription}
                                onChangeText={text => {
                                    this.setState({ description: text });
                                }}
                                value={this.state.description}
                            />
                            <View style={styles.input}>
                                <View >
                                    {this.state.image?.uri ? (
                                        <TouchableOpacity
                                            onPress={this.uploadImage}
                                            style={{
                                                backgroundColor: '#fff',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                margin: 15,
                                                borderRadius: 20,
                                            }}>
                                            <Image
                                                source={{ uri: this.state.image?.uri }}
                                                style={{
                                                    width: 150,
                                                    height: 150,
                                                    borderRadius: 12,
                                                    elevation: 3,
                                                }}
                                            />
                                            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                                                Change Image
                                            </Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <View>
                                            <TouchableOpacity
                                                onPress={this.uploadImage}
                                                style={{
                                                    backgroundColor: "#fff",
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    margin: 15,
                                                    borderRadius: 20,
                                                    flexDirection: 'row'
                                                }}>
                                                <Image
                                                    source={require('../../assets/imageIcon.png')}
                                                    resizeMode="contain"
                                                    style={{ width: 20, height: 20, marginHorizontal: 10 }}
                                                />
                                                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                                                    Update Image
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            </View>
                            <Button
                                onPress={this.editProduct}
                                backgroundColor="primary.100"
                                style={{
                                    width: '80%',
                                    borderRadius: 10,
                                    marginVertical: 10,
                                    height: 45,
                                }}>
                                Update Product
                            </Button>

                        </View>
                    </View>

                </ScrollView >

            </View >
        );
    }
}
const mapStateToProps = state => {
    return {
        Dark: state.AppReducer.darkmode,
        updateProductData: state.MarketPlaceReducer.updateProductData,
        getCategories: state.MarketPlaceReducer.getCategories,
    };
};
const mapDispatchToProps = dispatch => ({

    updateProduct: payload => dispatch(MarketPlaceMiddleware.updateProduct(payload)),
    getCategories: payload => dispatch(MarketPlaceMiddleware.Get_Categories(payload)),

});

export default connect(mapStateToProps, mapDispatchToProps)(EditProduct);
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
        width: '100%',
        height: 100,
        borderRadius: 5
    },
    teamsListContainer: {
        justifyContent: 'space-between',
    },
    sponsorName: {
        paddingTop: 8,
        fontSize: 12,
        color: 'black',
        alignSelf: 'center',
        fontWeight: '500',
    },
    sponsorPrice: {
        fontSize: 12,
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
    selectContainer: {
        backgroundColor: '#fff',
        // paddingVertical: 10,
    },
    input: {
        width: '80%',
        borderRadius: 10,
        textAlign: 'center',
        marginBottom: 15,
        backgroundColor: '#fff',
        elevation: 3,
        borderWidth: 0,
    },
    inputDescription: {
        width: '80%',
        borderRadius: 10,
        textAlign: 'center',
        marginBottom: 15,
        backgroundColor: '#fff',
        elevation: 3,
        borderWidth: 0,
        height: 140,
        textAlignVertical: 'top',
        // multiline
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
