import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { Input } from 'native-base';
import MyHeader from '../../components/MyHeader';
import { ScreenWidth } from '../../configs/AxiosConfig';
import OtpInputs from 'react-native-otp-inputs';
import { connect } from 'react-redux';
import { AuthMiddleware } from '../../redux/middleware/AuthMiddleware';
import { colors } from '../../Theme';
class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVerification: false,
            ModalNewPass: false,
            forgetPassword: true,
            email: '',
            NewPass: '',
            ConfrimPass: '',
            otp: '',

        };
    }

    SendMail = () => {
        let { email } = this.state;
        if (email) {
            this.props.SendMail({
                email,
            });
            this.setState({ modalVerification: true, forgetPassword: false })
        } else {
            alert('Please enter your email');
        }
    };

    SendOtp = () => {
        let { otp } = this.state;
        const { mailData, } = this.props;
        // console.warn(otp, mailData.confirmation_code);
        if (mailData?.confirmation_code == otp) {
            this.setState({
                modalVerification: false,
                ModalNewPass: true,
                forgetPassword: false,
            })
        } else {
            console.warn(otp, mailData.confirmation_code);
            alert('Please enter valid code');
        }
    };

    CreatePassword = () => {
        let { NewPass, ConfrimPass, email } = this.state;
        // const { NewPass,ConfrimPass } = this.props;
        // console.warn(otp, mailData.confirmation_code);
        if (NewPass === ConfrimPass) {
            this.props.ResetPassword({
                email,
                NewPass,
            });
            this.setState({
                modalVerification: false,
                ModalNewPass: false,
                forgetPassword: false,
            }),
                this.props.navigation.navigate('Login')
            // alert('Matched');
        } else {
            alert('Confirm Password is not same');
        }
    };

    render() {
        let Dark = this.props?.route?.params?.Dark
        console.warn("Dark", Dark);
        const { mailData, } = this.props;
        console.warn('Data', mailData);
        return (
            <View style={{ flex: 1, backgroundColor: Dark ? colors.black : colors.white }}>
                <View style={[styles.ListContainer, { backgroundColor: Dark ? colors.black : colors.white }]}>
                    <View style={styles.TopLineView}>
                        <View style={this.state.forgetPassword ? styles.TopBlueLine : styles.TopBlueLine}></View>
                        <View style={this.state.modalVerification ? styles.TopBlueLine : styles.TopGreyLine}></View>
                        <View style={this.state.ModalNewPass ? styles.TopBlueLine : styles.TopGreyLine}></View>
                    </View>
                    {/* {this.state.forgetPassword ? */}
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            // backgroundColor: 'rgba(0,0,0,0.50)',
                            marginTop: 30
                        }}>
                        <View
                            style={{
                                height: 50,
                                width: '90%',
                                // backgroundColor: '#f2f2f2',
                                borderRadius: 14,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>

                            <Text
                                style={{ fontSize: 24, color: Dark ? colors.white : colors.black, fontWeight: 'bold' }}>
                                Forgot Password
                            </Text>
                            <View style={styles.innerView}>
                                <Text style={{ marginBottom: 20, fontSize: 14, color: Dark ? colors.white : colors.black, textAlign: 'center' }}>Enter your email address associated with your account</Text>
                                <View style={{ backgroundColor: colors.white }}>

                                    <Input
                                        placeholder="Username"
                                        style={styles.input}
                                        value={this.state.email}
                                        onChangeText={email => this.setState({ email })}
                                    />
                                </View>
                                <TouchableOpacity onPress={this.SendMail} style={{
                                    width: '100%',
                                    height: 45,
                                    borderRadius: 10,
                                    backgroundColor: "#1872ea",
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginVertical: 20,
                                }}>
                                    <Text style={{ color: '#fff' }}>Continue</Text>
                                </TouchableOpacity>
                            </View>


                        </View>

                    </View>
                    {/* // : null} */}

                </View>
                <Modal
                    animationType={'fade'}
                    transparent={true}
                    visible={this.state.modalVerification}
                    onRequestClose={() => this.setState({ modalVerification: false })}>
                    <View
                        style={{

                            alignSelf: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: Dark ? colors.black : colors.white,
                            marginTop: 200,
                        }}>
                        <View
                            style={{
                                height: 450,
                                width: '100%',
                                // /backgroundColor: 'red',
                                borderRadius: 14,
                                alignItems: 'center',
                                //justifyContent: 'center',
                            }}>

                            <Text
                                style={{ fontSize: 24, color: Dark ? colors.white : colors.black, fontWeight: 'bold' }}>
                                Verification
                            </Text>
                            <View style={styles.innerView}>
                                {/* <Text style={{ marginBottom: 20, fontSize: 14, color: 'black', textAlign: 'center' }}>Enter your email address associated with your account</Text>
                                <Input
                                    placeholder="Username"
                                    style={styles.input}
                                    value={this.state.email}
                                    onChangeText={email => this.setState({ email })}
                                /> */}
                                {/* <View style={{}}> */}
                                <OtpInputs
                                    inputContainerStyles={{
                                        borderWidth: 1,
                                        borderColor: 'lightgrey',
                                        paddingHorizontal: 10,
                                        borderRadius: 10,
                                    }}
                                    clearTextOnFocus
                                    handleChange={(otp) => this.setState({ otp })}
                                    keyboardType='default'
                                    numberOfInputs={4}
                                    selectTextOnFocus={false}
                                />
                                {/* </View> */}
                                <TouchableOpacity
                                    // onPress={() => this.setState({
                                    //     modalVerification: false,
                                    //     ModalNewPass: true,
                                    //     forgetPassword: false,
                                    // })}
                                    onPress={this.SendOtp}
                                    style={{

                                        width: ScreenWidth - 80,
                                        height: 45,
                                        borderRadius: 10,
                                        backgroundColor: "#1872ea",
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginVertical: 20,
                                    }}>
                                    <Text style={{ color: '#fff' }}>Send</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.setState({
                                    modalVerification: false,
                                    // ModalNewPass: true,
                                    forgetPassword: true,
                                })}>
                                    <Text style={{
                                        marginBottom: 20,
                                        fontSize: 14,
                                        color: Dark ? colors.white : colors.black,
                                        textAlign: 'center'
                                    }}>Didn't receive a code? <Text style={{ color: "#1872ea" }}>Resend</Text></Text>
                                </TouchableOpacity>
                            </View>


                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType={'fade'}
                    transparent={true}
                    visible={this.state.ModalNewPass}
                    onRequestClose={() => this.setState({ ModalNewPass: false })}>
                    <View
                        style={{
                            flex: 0,
                            alignSelf: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: Dark ? colors.black : colors.white,
                            marginTop: 200,
                        }}>
                        <View
                            style={{
                                height: 450,
                                width: '90%',
                                // backgroundColor: 'red',
                                borderRadius: 14,
                                alignItems: 'center',
                                //justifyContent: 'center',
                            }}>

                            <Text
                                style={{ fontSize: 24, color: Dark ? colors.white : colors.black, fontWeight: 'bold' }}>
                                New Password
                            </Text>
                            <View style={styles.innerView}>
                                <Text style={{ marginBottom: 20, fontSize: 14, color: Dark ? colors.white : colors.black, textAlign: 'center' }}>Please create a new password</Text>
                                <View style={{
                                    marginBottom: 10,
                                    backgroundColor: colors.white,
                                }}>

                                    <Input
                                        placeholder="Create new password"
                                        style={styles.input}
                                        value={this.state.NewPass}
                                        onChangeText={NewPass => this.setState({ NewPass })}
                                    />
                                </View>
                                <View style={{ backgroundColor: colors.white }}>

                                    <Input
                                        placeholder="Confrim new password"
                                        style={styles.input}
                                        value={this.state.ConfrimPass}
                                        onChangeText={ConfrimPass => this.setState({ ConfrimPass })}
                                    />
                                </View>
                                <TouchableOpacity
                                    // onPress={() => {
                                    //     this.setState({
                                    //         modalVerification: false,
                                    //         ModalNewPass: false,
                                    //         forgetPassword: false,
                                    //     }), this.props.navigation.navigate('Login')
                                    // }}
                                    onPress={this.CreatePassword}
                                    style={{

                                        width: ScreenWidth - 80,
                                        height: 45,
                                        borderRadius: 10,
                                        backgroundColor: "#1872ea",
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginVertical: 20,
                                    }}>
                                    <Text style={{ color: '#fff' }}>Continue</Text>
                                </TouchableOpacity>

                            </View>


                        </View>
                    </View>
                </Modal>
            </View>

        );
    }
}

const mapStateToProps = state => {
    return {
        mailData: state.AuthReducer.mailData,
        Dark: state.AppReducer.darkmode,
    };
};
const mapDispatchToProps = dispatch => ({
    // Login: data => dispatch(AuthMiddleware.Login(data)),
    SendMail: data => dispatch(AuthMiddleware.SendMail(data)),

    ResetPassword: data => dispatch(AuthMiddleware.ResetPassword(data)),


});

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        //   paddingHorizontal: 25,
        backgroundColor: "#fff",
    },

    ListContainer: {
        flex: 1,
        width: '92%',
        marginVertical: 10,
        alignSelf: 'center',
        backgroundColor: '#fff'
    },
    ListImage: {
        width: '100%',
        height: 240,
        resizeMode: 'cover'
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
        marginVertical: 5,
        fontSize: 13,
        fontWeight: 'normal',
        color: 'black',
    },
    ListAddImage: {
        marginRight: 5,
    },
    TopLineView: {
        height: 10,
        width: '100%',
        alignSelf: 'center',
        justifyContent: 'space-evenly',
        marginTop: 20,
        flexDirection: "row",
        alignItems: 'center'

    },
    TopBlueLine: {
        borderTopColor: '#1872ea',
        borderTopWidth: 5,
        width: '30%',
        margin: 10,
        borderRadius: 10,

    },
    TopGreyLine: {
        borderTopColor: 'lightgrey',
        borderTopWidth: 5,
        width: '30%',
        margin: 10,
        borderRadius: 10,
    },
    innerView: {
        marginTop: 30,
        width: "100%",
        height: 300,
        paddingVertical: 20,
        paddingHorizontal: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'lightgrey',
        justifyContent: 'center',
    },
    input: {
        width: '95%',
        borderRadius: 10,
        textAlign: 'center',
        marginBottom: 15,
        backgroundColor: '#fff',
        elevation: 3,
        borderWidth: 0,
        justifyContent: 'center',
    },

})