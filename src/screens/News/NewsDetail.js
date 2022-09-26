import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import MyHeader from '../../components/MyHeader';
import { imgURL } from '../../configs/AxiosConfig';
import Swiper from 'react-native-swiper';
import moment from "moment";
import { connect } from 'react-redux';
import { colors } from '../../Theme';
import RenderHtml from 'react-native-render-html';

class NewsDetail extends Component {
    state = {
        loader: true,
        detailsData: '',
    };

    componentDidMount() {
        let data = this.props.route.params.data
        this.setState({ detailsData: data })

    }

    render() {
        const { detailsData } = this.state;
        let Dark = this.props.Dark;
        console.warn("je==========================>", this.props.route.params.data);
        return (
            <View style={{ flex: 1, backgroundColor: Dark ? colors.black : colors.white }}>
                <MyHeader
                    back notify profile navigation={this.props.navigation}
                    title={'News'}
                    onBackPress={() => this.props.navigation.goBack()}
                />
                <View style={[styles.ListContainer, Dark ? colors.black : colors.white]}>

                    <ScrollView style={{ backgroundColor: Dark ? colors.black : colors.white }}>
                        <View style={{ alignItems: 'center', height: 260, backgroundColor: Dark ? colors.black : colors.white }}>
                            <Swiper
                                index={0}
                                autoplayTimeout={5}
                                showsPagination={true}
                                loop={true}
                                autoplay={true}
                            //showsButtons={true}
                            >
                                {detailsData ?

                                    detailsData?.sliderImages?.map((v, key) => (
                                        <>
                                            <Image source={v.images ?
                                                {
                                                    uri: imgURL + v.images
                                                } : require('../../assets/user.png')
                                            } style={styles.ListImage} />

                                        </>
                                    ))
                                    :
                                    <View></View>}
                            </Swiper>
                        </View>
                        {/* <Image source={detailsData.image ?
                            {
                                uri: imgURL + detailsData.image
                            } : require('../../assets/user.png')
                        } style={styles.ListImage} /> */}
                        <View style={{ backgroundColor: Dark ? colors.black : colors.white }}>
                            <Text style={[styles.ListName, { color: Dark ? colors.white : colors.black }]}>{detailsData.name}</Text>
                            <Text style={[styles.ListDistances, { color: Dark ? colors.white : colors.black }]}>{new Date(detailsData?.date).toLocaleDateString()} | {moment(new Date().toISOString().substring(0, 11) + detailsData?.time + "Z").format("hh:mm A")}</Text>
                            {/* <Text style={[styles.ListDescription, { color: Dark ? colors.white : colors.black }]}>{detailsData.description}</Text> */}

                            <RenderHtml
                                style={styles.ListDescription}
                                contentWidth={'100%'}
                                source={{ html: detailsData?.description }}
                                contentHeight={100}
                                baseStyle={{
                                    color: Dark ? colors.white : colors.black,
                                }}
                            />
                        </View>
                    </ScrollView>

                </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(NewsDetail);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        //   paddingHorizontal: 25,
        backgroundColor: "#fff",
    },

    ListContainer: {
        flex: 1,
        width: '93%',
        marginVertical: 10,
        alignSelf: 'center',
        backgroundColor: '#fff'
    },
    ListImage: {
        width: '100%',
        height: 240,
        resizeMode: 'contain'
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
        fontSize: 15,
        fontWeight: 'bold',
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

})