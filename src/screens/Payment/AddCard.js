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
import { Image, Dimensions, View, Animated, TouchableOpacity, Text, FlatList, StyleSheet, TextInput, ToastAndroid } from 'react-native';
import MyHeader from '../../components/MyHeader';
import Feather from 'react-native-vector-icons/Feather';
// import {Colors} from '../../Styles';
import Entypo from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux';
import { SubscriptionMiddleware } from '../../redux/middleware/SubscriptionMIddleware';
import { colors } from '../../Theme';



const { width } = Dimensions.get('window');

class AddCard extends Component {
    state = {
        cardName: '',
        cardNumber: '',
        // cardNumber: '4242424242424242',
        expiryDate: '',
        cvv: '',
        loading: false,
    };
    componentDidMount() {
        // Animated.timing(this.rotation, {
        //   toValue: 1,
        //   duration: 1000,
        //   useNativeDriver: true,
        // }).start();
    }

    addPaymentCard = () => {
        let { cardName, cardNumber, expiryDate, cvv } = this.state;

        let dateRegex = /^[0-9]{2}[\/][0-9]{4}$/g;

        let currentMonth = new Date().getMonth();
        let currentYear = new Date().getFullYear();

        let split_expiryDate = expiryDate.split('/');

        // console.warn(currentYear);

        if (
            currentMonth === Number(split_expiryDate[0]) &&
            currentYear === Number(split_expiryDate[1])
        ) {
            alert('Expiry date is invalid');
            return;
        }

        if (expiryDate && !dateRegex.test(expiryDate)) {
            ToastAndroid.show('Expiry date is invalid', 300);
            return;
        }
        if (cvv.length < 3) {
            ToastAndroid.show('CVV is invalid', 300);
            return;
        }

        if (cardName && cardNumber && expiryDate && cvv) {
            // let cardDetails = {cardName, cardNumber, expiryDate, cvv};
            this.setState({ loading: true });
            this.props
                .storePaymentCard({ cardName, cardNumber, expiryDate, cvv })
                .then(data => {
                    if (data) {
                        this.setState({ loading: false });
                        // console.warn("DETETE:", data);
                        //this.props.navigation.goBack();
                    }
                })
                .catch(err => {
                    this.setState({ loading: false });
                });
            this.props.navigation.navigate('Payment', { stripe_id: this.props?.route?.params?.stripe_id, Setting: this.props?.route?.params?.Setting ? this.props?.route?.params?.Setting : null })
        } else {
            ToastAndroid.show('All fields are required!', 300);
        }
    };

    render() {
        let Dark = this.props.Dark;
        return (
            <ScrollView style={[styles.container, { backgroundColor: Dark ? colors.black : colors.white }]}>
                <MyHeader
                    back notify profile navigation={this.props.navigation}
                    title={'Add Card'}
                    onBackPress={() => this.props.navigation.goBack()}
                />
                <View style={{ paddingHorizontal: 20 }}>
                    <View style={{ marginHorizontal: 30, marginVertical: 15 }}>
                        <Text style={{ color: Dark ? colors.white : colors.black, fontWeight: 'bold', fontSize: 20 }}>
                            Credit or debit card
                        </Text>
                    </View>

                    <TextInput
                        value={this.state.cardName}
                        placeholder="Card Holder Name"
                        placeholderTextColor={'#8D8D8D'}
                        onChangeText={text => this.setState({ cardName: text })}
                        style={styles.input}
                    />

                    <TextInput
                        value={this.state.cardNumber}
                        placeholder="Card Number"
                        keyboardType="numeric"
                        placeholderTextColor={'#8D8D8D'}
                        onChangeText={text => this.setState({ cardNumber: text })}
                        style={[styles.input, { marginVertical: 18 }]}
                        maxLength={16}
                    />

                    <View style={styles.inputContainer}>
                        <TextInput
                            value={this.state.expiryDate}
                            placeholder="Exp: 04/2050"
                            keyboardType="numeric"
                            maxLength={7}
                            placeholderTextColor={'#8D8D8D'}
                            onChangeText={text => {
                                this.setState({
                                    expiryDate: text.length == 2 ? text + '/' : text,
                                });
                            }}
                            style={[styles.input, { width: '50%' }]}
                        />
                        <TextInput
                            value={this.state.cvv}
                            placeholder="CVV"
                            keyboardType="numeric"
                            placeholderTextColor={'#8D8D8D'}
                            maxLength={4}
                            onChangeText={text => this.setState({ cvv: text })}
                            style={[styles.input, { width: '42%' }]}

                        />
                    </View>

                    <TouchableOpacity
                        onPress={this.addPaymentCard}
                        style={styles.addCardBtn}>
                        <Text style={styles.addCardText}>Add Card</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}
const mapStateToProps = state => ({
    Dark: state.AppReducer.darkmode,
})
const mapDispatchToProps = dispatch => ({
    storePaymentCard: paylaod => dispatch(SubscriptionMiddleware.addPaymentCard(paylaod)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddCard);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //   paddingHorizontal: 25,
        backgroundColor: "#fff",
    },

    addCardText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    title: {
        paddingVertical: 20,
        paddingHorizontal: 30,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    addCardBtn: {
        paddingVertical: 16,
        marginVertical: 18,
        width: '85%',
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#1D9CD9',
    },
    input: {
        width: '85%',
        alignSelf: 'center',
        paddingHorizontal: 10,
        color: '#000',
        backgroundColor: '#F8F8F8',
        paddingVertical: 16,
    },
    inputContainer: {
        width: '85%',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
