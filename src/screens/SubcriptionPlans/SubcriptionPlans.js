import { Button, HStack, Icon, Input } from 'native-base';
import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MyHeader from '../../components/MyHeader';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { connect } from 'react-redux';
import { SubscriptionMiddleware } from '../../redux/middleware/SubscriptionMIddleware';
import RenderHtml from 'react-native-render-html';
import { colors } from '../../Theme';

class SubcriptionPlans extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            refreshing: false,
        };
    }

    componentDidMount = () => {
        this.GetSubscription()
    }
    GetSubscription = () => {
        this.props.GetSubscription({
            callback: response => {
                if (response) {
                    console.warn("API Res,", response.data);
                    this.setState({
                        data: response.data,
                        refreshing: false,
                    })

                } else {
                    this.setState({ loading: false, refreshing: false, });
                }
            },
        });
    }

    _renderItem = (item, index) => (
        // console.warn("item", item),
        < View
            activeOpacity={0.7} style={[styles.ListContainer, { backgroundColor: this.props.Dark ? colors.dark : colors.white }]} >
            <Button
                backgroundColor="primary.100"
                style={{
                    width: '40%',
                    borderRadius: 4,
                    height: 45,
                    top: -43,
                }}>
                {item?.name}
            </Button>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{
                    fontSize: 20,
                    color: this.props.Dark ? colors.white : colors.black,
                    fontWeight: 'bold',
                    top: 6,
                }}>$</Text>
                <Text style={{
                    fontSize: 35,
                    color: "#1872ea",
                    fontWeight: 'bold',
                }}>{item?.stripe_price}</Text>
                <Text style={{
                    fontSize: 20,
                    color: this.props.Dark ? colors.white : colors.black,
                    fontWeight: 'bold',
                    top: 6,
                }}>/{item?.type}</Text>
            </View>
            <RenderHtml
                contentWidth={'90%'}
                baseStyle={{
                    color: this.props.Dark ? colors.white : colors.black,
                }}
                source={{ html: item?.description }}
            />
            {/* <Text style={{ fontSize: 13, marginLeft: 10 }}>{item?.description}</Text> */}
            {/*  console.warn("heeh", item.stripe_id)  */}
            {item?.is_purchased ?
                <Button
                    _disabled={true}
                    style={{
                        width: '90%',
                        borderRadius: 8,
                        height: 45,
                        marginTop: 10,
                        backgroundColor: 'grey'
                    }}>
                    Purchased
                </Button>
                :
                <Button
                    onPress={() => this.props.navigation.navigate('Payment', { stripe_id: item?.stripe_id })}
                    backgroundColor="primary.100"
                    style={{
                        width: '90%',
                        borderRadius: 8,
                        height: 45,
                        marginTop: 10,
                    }}>
                    Buy Plan
                </Button>

            }

        </View >
    );

    render() {
        let Dark = this.props.Dark;
        // console.warn("SUB USER====================>>>>>:", this.props.user);
        return (
            <View style={{ flex: 1, backgroundColor: Dark ? colors.black : colors.white }}>
                <MyHeader
                    back notify profile navigation={this.props.navigation}
                    size={'md'}
                    title={'Subscription Plan'}
                    onBackPress={() => this.props.navigation.goBack()}
                />
                <View style={{ marginHorizontal: 15 }}>
                    <FlatList
                        style={styles.flex1}
                        showsVerticalScrollIndicator={false}
                        data={this.state.data}
                        renderItem={({ item, index }) => this._renderItem(item, index)}
                        ListFooterComponent={<View style={{ marginTop: 30 }}><Text></Text></View>}
                        refreshing={this.state.refreshing}
                        onRefresh={this.GetSubscription}
                        ListEmptyComponent={() =>
                            <View>
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        marginTop: 20,
                                        color: Dark ? colors.black : colors.white,
                                        fontSize: 14,
                                        fontWeight: 'bold',
                                    }}>
                                    Subscription plan not found
                                </Text>
                            </View>}

                    />
                </View>
            </View>
        );
    }
}
const mapStateToProps = state => ({

    user: state.AuthReducer.user,
    Dark: state.AppReducer.darkmode,
});

const mapDispatchToProps = dispatch => ({

    GetSubscription: paylaod => dispatch(SubscriptionMiddleware.GetSubscription(paylaod))
});

export default connect(mapStateToProps, mapDispatchToProps)(SubcriptionPlans);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //   paddingHorizontal: 25,
        backgroundColor: "#fff",
    },

    ListContainer: {
        width: '100%',
        paddingVertical: 20,
        marginVertical: 25,
        elevation: 4,
        backgroundColor: '#eee',
        alignItems: 'center',

    },
    ListImage: {
        width: '100%',
        height: 180,
    },
    teamsListContainer: {
        justifyContent: 'space-between',
    },
    ListName: {
        marginTop: 5,
        fontSize: 18,
        color: 'black',
        fontWeight: 'bold',
    },
    ListDistances: {
        fontSize: 13,
        fontWeight: 'normal',
    },
    ListDescription: {
        fontSize: 13,
        fontWeight: 'normal',
        color: 'black',
    },
    ListAddImage: {
        marginRight: 5,
    },
})