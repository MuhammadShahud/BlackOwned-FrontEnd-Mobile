import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import RenderHTML from 'react-native-render-html';
import { connect } from 'react-redux';
import MyHeader from '../../components/MyHeader';
import { AppMiddleware } from '../../redux/middleware/AppMiddleware';
import { colors } from '../../Theme';

class PrivacyPolicy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            privacy: "",
        };
    }
    componentDidMount() {
        this.setState({ refreshing: true })
        this.Privacy()
    }
    Privacy = () => {
        this.props.DATA({
            callback: response => {

                if (response) {
                    console.warn("DATA,", response);
                    this.setState({
                        privacy: response?.data?.privacy,
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
                <MyHeader title={'Privacy Policy'} notify back onBackPress={() => this.props.navigation.goBack()} navigation={this.props.navigation} />
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.Privacy}
                        />
                    }
                    style={styles.body}>
                    <RenderHTML
                        style={styles.TextAll}
                        contentWidth={'100%'}
                        source={{ html: this.state.privacy }}
                        baseStyle={{
                            color: Dark ? colors.white : colors.black,
                        }}
                    />
                    {/* <Text style={styles.TextAll}>{this.state.privacy}</Text> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(PrivacyPolicy);

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