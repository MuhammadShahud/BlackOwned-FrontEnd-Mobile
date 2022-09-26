import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Button, HStack, Icon, Input } from 'native-base';
import { connect } from 'react-redux';
import MyHeader from '../../components/MyHeader';
import { AppMiddleware } from '../../redux/middleware/AppMiddleware';
import RenderHtml from 'react-native-render-html';
import { colors } from '../../Theme';
class TermsAndConditions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            Terms: null,
        };
    }
    componentDidMount() {
        this.setState({ refreshing: true })
        this.Terms()
    }
    Terms = () => {
        this.props.DATA({
            callback: response => {

                if (response) {
                    console.log("DATA,", response?.data?.terms);
                    this.setState({
                        Terms: response?.data?.terms,
                        refreshing: false,
                    })

                } else {
                    this.setState({ loading: false, refreshing: false, });
                }
            },
        });
    }
    render() {
        let Dark = this.props.Dark;
        return (
            <View style={[styles.container, { backgroundColor: Dark ? colors.black : colors.white }]}>
                <MyHeader title={'Terms & Condition'} notify back onBackPress={() => this.props.navigation.goBack()} navigation={this.props.navigation} />
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            colors={["#1c1c1c", "#5c5c5c"]}
                            tintColor="#000"
                            refreshing={this.state.refreshing}
                            onRefresh={this.Terms}
                        />
                    }
                    style={styles.body}>
                    <RenderHtml
                        style={styles.TextAll}
                        contentWidth={'100%'}
                        source={{ html: this.state.Terms }}
                        baseStyle={{
                            color: Dark ? colors.white : colors.black,
                        }}
                    />
                    {/* <Text style={styles.TextAll}>{this.state.Terms}</Text> */}
                </ScrollView>
            </View>
        );
    }
}
const mapStateToProps = state => ({
    Dark: state.AppReducer.darkmode,
})
const mapDispatchToProps = dispatch => ({
    DATA: paylaod => dispatch(AppMiddleware.Data(paylaod)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TermsAndConditions);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    body: {
        width: '94%',
        alignSelf: "center",

    },
    TextAll: {
        fontSize: 13,
        color: '#000',
        marginVertical: 10,


    },
})