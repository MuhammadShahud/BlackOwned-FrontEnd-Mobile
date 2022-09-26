
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import MyHeader from '../../components/MyHeader';
import Feather from 'react-native-vector-icons/Feather';
import Tabs from './NetworkTabs';
import { connect } from 'react-redux';
import { colors } from '../../Theme';
class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: this.props.Dark ? colors.black : colors.white }}>
                <MyHeader
                    back notify navigation={this.props.navigation}
                    title={'Network'}
                    onBackPress={() => this.props.navigation.goBack()}
                />
                <Tabs />
                {/* <HStack
                    backgroundColor="#eee"
                    marginTop="2"
                    borderRadius={10}
                    alignItems="center"
                    paddingX="3">
                    <Icon as={Feather} name="search" size="sm" color="#aaa" />
                    <Input fontSize={14} placeholder="Search" borderWidth={0} />
                </HStack> */}

            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        Dark: state.AppReducer.darkmode,
    };
};
const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(index);