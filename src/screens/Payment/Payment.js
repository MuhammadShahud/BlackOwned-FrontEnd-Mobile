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
import { Image, Dimensions, View, Animated, TouchableOpacity, Text, FlatList, StyleSheet, Alert } from 'react-native';
import MyHeader from '../../components/MyHeader';
import Feather from 'react-native-vector-icons/Feather';
// import {Colors} from '../../Styles';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { connect } from 'react-redux';
import { SubscriptionMiddleware } from '../../redux/middleware/SubscriptionMIddleware';
import { colors } from '../../Theme';


const { width } = Dimensions.get('window');

class Payment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cards: [],
            isActive: true,
            selectedCardId: undefined,
            loading: true,
        };
    }
    componentDidMount() {
        this.onRefresh()
    }
    onRefresh = () => {
        this.props.showMethod()
            .then(() => {
                this.setState({ loading: false })
            })
            .catch(() => this.setState({ loading: false }));
    }
    PayNow = () => {
        if (this.props.paymentCards.length == 0) {

            Alert.alert('Note', 'Please add card or select defual card.')
        }
        else {

            this.props.BUY_SUBSCRIPTION({ stripe_id: this.props?.route?.params?.stripe_id })
                .then(() => {
                    this.props.navigation.navigate('Dashboard')
                })
                .catch(() => this.setState({ loading: false }));
        }




        // console.warn("PAYNOW");
    }

    renderPaymentCards = ({ item, index }) => (
        //  console.warn("item---->", item.default_card),
        <View style={styles.cardsContainer}>
            <TouchableOpacity
                onPress={() => this.SetDefaultCard(item.id)}
                style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <MaterialIcons
                    color={'#636060'}
                    size={16}
                    name={
                        item.default_card == 1
                            ? 'radio-button-checked'
                            : 'radio-button-off'
                    }
                />

                {item?.card_brand == 'Visa' ?
                    <FontAwesome
                        name="cc-visa"
                        size={22}
                        color={'#1D9CD9'}
                        style={{ paddingLeft: 5 }}
                    /> :
                    <FontAwesome
                        name="cc-mastercard"
                        size={22}
                        color={'#1D9CD9'}
                        style={{ paddingLeft: 5 }}
                    />}

                <Text style={{ paddingHorizontal: 22, color: '#000' }}>
                    ************{item.card_end_number}
                </Text>
            </TouchableOpacity>

            {/* <TouchableOpacity>
            <MaterialIcons name="edit" size={22} color={Colors.GRAY_3} />
          </TouchableOpacity> */}

            <TouchableOpacity
                onPress={() => this.removeCard(item?.stripe_source_id)}
                style={{ marginHorizontal: 4 }}>
                <MaterialIcons name="delete" size={22} />
            </TouchableOpacity>
        </View>
    );
    SetDefaultCard = (id) => {
        // console.warn("ID", id);
        this.props.UpdateDefaultCard({ id })
    }
    removeCard = (stripe_source_id) => {
        this.props.deletePaymentCard({ stripe_source_id });
    };

    render() {
        let Dark = this.props.Dark;
        console.warn("Payment Props=========>", this.props.paymentCards?.length);
        return (
            <ScrollView style={[styles.container, { backgroundColor: Dark ? colors.black : colors.white }]}>
                <MyHeader
                    back notify profile navigation={this.props.navigation}
                    title={this.props.route.name}
                    onBackPress={() => this.props.navigation.goBack()}
                />
                <View style={{ paddingHorizontal: 20 }}>
                    <View style={{ marginHorizontal: 30, marginVertical: 15 }}>
                        <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 20 }}>
                            Credit or debit card
                        </Text>
                    </View>

                    <View>
                        <FlatList
                            refreshing={this.state.loading}
                            onRefresh={this.onRefresh}
                            data={this.props.paymentCards}
                            renderItem={this.renderPaymentCards}
                        // keyExtractor={(item, index) => index.toString()}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('AddCard', { stripe_id: this.props?.route?.params?.stripe_id, Setting: this.props?.route?.params?.Setting ? this.props?.route?.params?.Setting : '' })}
                        style={styles.addCardBtn}>
                        <AntDesign
                            name="pluscircleo"
                            size={16}
                            color={'#8D8D8D'}
                            style={{ paddingRight: 22 }}
                        />
                        <Text style={styles.addCardText}>Add new card</Text>
                    </TouchableOpacity>

                    {this.props?.route?.params?.Setting ?
                        null
                        :
                        <TouchableOpacity
                            // disabled={this.props.PaymentCard.length < 1}
                            onPress={() => this.PayNow()}
                            style={{
                                // bottom: 12,
                                // position: 'absolute',
                                width: '90%',
                                alignSelf: 'center',
                                paddingVertical: 12,
                                backgroundColor: '#1D9CD9',
                            }}>
                            <Text
                                style={{ textAlign: 'center', fontSize: 18, color: '#fff' }}>
                                Pay Now
                            </Text>
                        </TouchableOpacity>
                    }
                </View>
            </ScrollView>
        );
    }
}
const mapStateToProps = state => ({
    paymentCards: state.PaymentReducer.PaymentCards,
    Dark: state.AppReducer.darkmode,
});

const mapDispatchToProps = dispatch => ({
    showMethod: paylaod => dispatch(SubscriptionMiddleware.showMethod(paylaod)),
    UpdateDefaultCard: paylaod => dispatch(SubscriptionMiddleware.UpdateDefaultCard(paylaod)),
    deletePaymentCard: paylaod => dispatch(SubscriptionMiddleware.Delete_Card(paylaod)),
    BUY_SUBSCRIPTION: paylaod => dispatch(SubscriptionMiddleware.BUY_SUBSCRIPTION(paylaod)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Payment);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        //   paddingHorizontal: 25,
        backgroundColor: "#fff",
    },
    addCardBtn: {
        paddingVertical: 16,
        marginVertical: 10,
        width: '90%',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EEEBEB',
        flexDirection: 'row',
    },
    cardsContainer: {
        flexDirection: 'row',
        width: '90%',
        alignSelf: 'center',
        paddingVertical: 16,
        paddingHorizontal: 8,
        backgroundColor: '#F8F8F8',
        marginVertical: 8,
    },
    //   container: {flex: 1, backgroundColor: Colors.backgroundColor},
    addCardText: { textAlign: 'center', fontSize: 16, color: 'black' },
});
