
import { Button } from 'native-base';
import React, { Component } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import { connect } from 'react-redux';
import MyHeader from '../../components/MyHeader';
import { AppMiddleware } from '../../redux/middleware/AppMiddleware';
import { colors } from '../../Theme';

class ContactUs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            option: ['Queries', 'Suggestions', 'Claims', 'Complaints'],
            description: '',
            selectedOption: '',
        };
    }
    handleChangeDescription = value => {
        this.setState({ description: value });
    };
    OnClickSubmit = () => {

        let { selectedOption, description } = this.state
        console.warn("Hello", selectedOption, "description", description);
        if (selectedOption == '' || description == '') {
            Alert.alert('Note', 'Please fill all fields.')
        }
        else {
            let userData = {
                option: selectedOption,
                description
            }
            this.props.Contact_us({
                userData,
            })
            this.props.navigation.goBack()
        }


    }
    render() {
        let Dark = this.props.Dark;
        return (
            <View style={[styles.container, { backgroundColor: Dark ? colors.black : colors.white }]}>
                <MyHeader title={'Contact Us'} notify back profile onBackPress={() => this.props.navigation.goBack()} navigation={this.props.navigation} />
                <View style={styles.body}>
                    <View style={styles.selectContainer}>
                        <SelectDropdown
                            data={this.state.option}
                            // defaultValue={this.state.country[0]}
                            defaultButtonText="Select an option"
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
                                this.setState({ selectedOption: selectedItem });
                                // this.props.getUsersByType({ role: selectedItem });
                            }}
                        />
                    </View>
                    <TextInput
                        placeholder="Description"
                        style={[styles.input, { height: 235, textAlignVertical: 'top' }]}
                        value={this.state.description}
                        onChangeText={this.handleChangeDescription}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Button
                            onPress={() => this.OnClickSubmit()}
                            backgroundColor="primary.100"
                            style={{
                                width: '50%',
                                borderRadius: 4,
                                marginVertical: 5,
                                height: 45,
                                marginVertical: 10,
                                marginHorizontal: 10,
                            }}>
                            Submit
                        </Button>
                        <Button
                            onPress={() => this.props.navigation.goBack()}
                            backgroundColor="primary.100"
                            style={{
                                width: '40%',
                                borderRadius: 4,
                                marginVertical: 5,
                                height: 45,
                                marginVertical: 10,
                                marginHorizontal: 10,
                                backgroundColor: 'rgb(180,180,180)'
                            }}>
                            Cancel
                        </Button>
                    </View>
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
    Contact_us: paylaod => dispatch(AppMiddleware.Contact_us(paylaod)),

});

export default connect(mapStateToProps, mapDispatchToProps)(ContactUs);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    body: {
        width: '92%',
        alignSelf: "center",
        paddingTop: 30,
    },
    TextAll: {
        fontSize: 13,
        color: '#000',
        marginBottom: 10,


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
    dropDownBtnText: {
        color: 'rgb(160,160,160)',
        fontSize: 14,
        textAlign: 'left',
    },
    btnStyle: {
        backgroundColor: '#eee',
        alignSelf: 'center',
        width: '100%',
    },
    input: {
        width: '100%',
        marginVertical: 25,
        paddingLeft: 12,
        alignSelf: 'center',
        backgroundColor: '#eee',
    },
})