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
import {
  Image,
  Dimensions,
  View,
  Animated,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  KeyboardAvoidingView,
} from 'react-native';
import { IS_IOS } from '../../configs';
import MyHeader from '../../components/MyHeader';
import Feather from 'react-native-vector-icons/Feather';
import StarRating from 'react-native-star-rating-widget';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Pusher from 'pusher-js/react-native';
import { connect } from 'react-redux';
import { ChatMiddleware } from '../../redux/middleware/ChatMiddleware';
import { dummyImage, imgURL, ScreenHeight } from '../../configs/AxiosConfig';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { OpenImagePicker } from '../../configs';
import { createThumbnail } from 'react-native-create-thumbnail';
import ImageView from "react-native-image-viewing";
import VideoPlayer from 'react-native-video-player';
import DocumentPicker from "react-native-document-picker";
import { mode } from 'native-base/lib/typescript/theme/tools';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { colors } from '../../Theme';

export class Chat extends Component {
  state = {
    loader: false,
    sendMessageLoader: false,
    text: '',
    messages: [],
    next_Page_Url: 1,
    abc: null,
    image: null,
    file: null,
    mediaType: null,
    thumb: "",
    uploading: false,
    messageSent: false,
    openImage: [],
    visibleImage: false,
  };

  componentDidMount() {
    this.initializePusher();
    this.getUserMessages();
    this.fsPermission()

  }

  fsPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,

        {
          title: "Cool Photo App Camera Permission",
          message:
            "Cool Photo App needs access to your camera " +
            "so you can take awesome pictures.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the camera");
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  }

  openImage = (uri) => {
    this.setState({ openImage: [{ uri: uri }], visibleImage: true })
  }

  sendAttachment = async () => {
    let { messages } = this.state;
    const chatListData = this.props.route.params?.item;

    let user_id = this.props.user.user.id == chatListData.to_user_id
      ? chatListData.from_user_id
      : chatListData.to_user_id


    let {
      image,
      mediaType,
    } = this.state;
    let thumb = null;
    if (!image) {
      Alert.alert('Warning', 'Please select image/video!');
    }
    else {

      if (image.type.includes("video")) {
        let thumbnail = await createThumbnail({
          url: image.uri
        })
        let thumb_name_array = thumbnail.path.split("/");
        let thumb_name = thumb_name_array[thumb_name_array.length - 1]

        thumb = {
          name: thumb_name,
          type: thumbnail?.mime,
          uri: thumbnail?.path,
          size: thumbnail?.size
        }

      }


      let userData = {
        media: image,
        type: mediaType,
        ...thumb ? { thumbnail: thumb } : { thumbnail: null }
      }
      this.setState({ uploading: true })
      this.props.SendAttachment({
        userId: user_id,
        userData,
        uploading: (sent, total) => {
          console.warn('sent', sent, 'total', total);
        },
        callback: (data) => {
          if (data) {

            this.setState({ uploading: false });
            this.getUserMessages();
          }
        }
      })
      // setTimeout(() => {
      //   this.getUserMessages();
      // }, 5000)
      // this.getUserMessages();
      // this.props.navigation.navigate('UserProfile', { type: 'upload' })
    }
  };

  uploadImage = () => {
    OpenImagePicker = (img => {
      let uri_script = img?.path?.split('/');
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

  selectImage = () => {
    Alert.alert("Select", "Please select an option", [
      {
        text: "Cancel",
      },
      {
        text: "Camera",
        onPress: () => {
          try {
            launchCamera({
              mediaType: 'mixed'
            }, (response) => {

              if (!response.errorCode && !response.didCancel) {
                let img = response.assets[0];
                let mediaType = img?.type
                if (mediaType.includes('image')) {
                  this.setState({
                    mediaType: 1,
                  })

                }
                if (mediaType.includes('video')) {
                  this.setState({
                    mediaType: 0,
                  })
                }
                this.setState({
                  image: {
                    uri: img.uri,
                    name: img.fileName,
                    size: img.fileSize,
                    type: img.type
                  },

                  fileDimension: {
                    height: img.height,
                    width: img.width
                  },
                }, () => {
                  this.sendAttachment()
                })
              } else if (response.didCancel) {
                console.warn("error", response);
              }
            })
          } catch (error) {
            console.warn("error", error);
          }
        }
      },
      {
        text: "Library",
        onPress: () => {
          try {
            launchImageLibrary({
              mediaType: 'mixed'
            }, (response) => {
              console.warn("Responce:", response);
              if (!response.errorCode && !response.didCancel) {
                let img = response.assets[0];

                let mediaType = img?.type
                if (mediaType.startsWith('image')) {
                  this.setState({
                    mediaType: 1,
                  })

                }
                if (mediaType.startsWith('video')) {
                  this.setState({
                    mediaType: 0,
                  })
                }

                this.setState({
                  image: {
                    uri: img.uri,
                    name: img.fileName,
                    size: img.fileSize,
                    type: img.type
                  },
                  filterModal: true,
                  fileDimension: {
                    height: img.height,
                    width: img.width
                  },
                }, () => {
                  this.sendAttachment()
                })

              } else if (response.didCancel) {
                console.warn('error', response);
              }
            })
          } catch (error) {
            console.warn('error', error);
          }
        }
      },
    ])
  }

  renderLoaderMoreButton = () => {
    const { next_Page_Url, abc } = this.state;
    const { loader } = this.state;
    return abc ? (
      loader ? (
        <ActivityIndicator
          size={'large'}
          color={'#1D9CD9'}
          style={styles.loadMoreContentContainer}
        />
      ) : (
        <TouchableOpacity
          style={{ width: 110, alignSelf: 'center', marginVertical: 13 }}
          onPress={this.onPressLoadMore}>
          <View style={styles.loadMoreContainer}>
            <Text style={styles.loadMoreText}>Load more</Text>
          </View>
        </TouchableOpacity>
      )
    ) : null;
  };

  onPressLoadMore = () => {
    this.setState({ loader: true }, () => {
      const chatListData = this.props.route.params?.item;
      const { next_Page_Url } = this.state;
      console.warn('next_Page_Url', next_Page_Url + 1);
      this.props
        .getMessage({ next_url: next_Page_Url + 1, id: chatListData.id, })
        .then((data) => this.setState({ messages: [...this.state.messages, ...data.data], next_Page_Url: next_Page_Url + 1, loader: false, abc: data.next_page_url }))
        .catch(() => this.setState({ loader: false }));
    });
  };

  initializePusher = () => {
    const chatListData = this.props.route.params?.item;
    const user = this.props.user.user;

    // console.warn(':dsada', chatListData.from_user.id);
    // this.pusher = new Pusher('86fbeb114d2c4782c8ce', { cluster: 'ap2' });
    this.pusher = new Pusher('ed1229efad5ef3004a84', { cluster: 'ap2' });
    this.channel = this.pusher.subscribe(`user.${user.id}`);

    this.channel.bind('App\\Events\\Message', data => {
      console.warn(
        'chatListData ===',
        chatListData.id,
        data.message.chatList_id,
      );
      console.warn('dataaaaaaaa ===', data.message);
      // return;
      if (chatListData.id == data.message.chatlist_id) {
        console.warn('iffffff =====');
        const oldMessages = [...this.state.messages];
        let message = {
          sent_to_id: user.id,
          sent_from_id: data.message.sent_from_id,
          ...data.message,
        };

        let updateMessage = [message, ...oldMessages];
        this.setState({ messages: updateMessage });
        // this.state.messages.push(message);
      }
    });
  };

  getUserMessages = () => {
    const chatListData = this.props.route.params?.item;
    if (!chatListData?.id)
      return;
    console.warn('Daataaa', chatListData);
    this.props
      .getMessage({
        next_url: this.state.next_Page_Url,
        id: chatListData.id,
      })
      .then(data => {
        console.warn('dasdasd', data);
        if (data) {
          this.setState({ messages: data.data, abc: data.next_page_url });
        }
      })
      .catch(err => { });
  };

  sendMessage = () => {
    let { text, messages } = this.state;
    if (text) {

      const chatListData = this.props.route.params?.item;
      let user_id = null;
      if (chatListData?.to_user_id) {
        user_id = this.props.user.user.id == chatListData.to_user_id
          ? chatListData.from_user_id
          : chatListData.to_user_id

      }
      else {
        user_id = chatListData.id;
      }
      this.setState({ messageSent: true })
      this.props
        .sendMessage({
          userId: user_id,
          message: this.state.text,
          type: 'text',
        })
        .then(data => {
          if (data) {
            let message = {
              sent_from_id: this.props.user.user.id,
              sent_to_id: user_id,
              ...data,
            };

            let updateMessage = [message, ...messages];
            console.warn('dateeeee====ppppp ', updateMessage);
            this.setState({ messages: updateMessage, text: '', messageSent: false });
            // this.setState({ uploading: false });
          }
        })
        .catch(err => console.warn('catch ===', err));
    }
  };

  downloadFile = (item) => {
    this.props.DownloadAttachment({
      selectedItem: item,
    })
    console.warn('file', imgURL + item)
  }

  renderMessages = ({ item }) => (
    // console.warn('item ====', item),
    <View
      style={{
        marginVertical: 12,
        flexDirection:
          item.sent_from_id == this.props.user.user.id ? 'row-reverse' : 'row',
        alignItems: 'center',
      }}>
      <View
        style={{
          paddingHorizontal: 10,
        }}>
        <Image
          source={{
            uri:
              item?.sent_from_id == this.props.user.user.id
                ? imgURL + this.props.user.user.profile_pic : this.props.user.user.profile_pic == null ? dummyImage
                  : imgURL + item?.sent_from.profile_pic
          }}
          style={styles.userImg}
        />
      </View>

      <View
        style={{
          width: '60%',
          backgroundColor:
            item.sent_from_id == this.props.user.user.id ? '#eeee' : '#ddd',
          padding: 20,
          borderRadius: 5,
        }}>
        <Text style={{ fontWeight: 'bold', color: 'black' }}>
          {/* {item.sent_from_id == this.props.user.user.id ? 'Me' : this.props.route.params?.item?.fromusername} : */}
          {item.sent_from_id == this.props.user.user.id ? 'Me' : this.props.route.params?.item?.from_user?.id == this.props.user.user.id ?
            this.props.route.params?.item?.to_user?.username : this.props.route.params?.item?.from_user?.username} :
        </Text>
        {item?.type == 'text' ? (
          <Text
            style={{
              textAlign:
                item.sent_from_id == this.props.user.user.id ? 'right' : 'left',
              color: '#636060',
            }}>
            {item.message}
          </Text>
        ) :
          (
            item?.image == '1' ?
              <TouchableOpacity
                onPress={() => this.openImage(imgURL + item?.media)}
              >
                <Image
                  source={{
                    uri:
                      imgURL + item?.media
                  }}
                  style={styles.chatImg} resizeMode='contain'
                />
              </TouchableOpacity>
              :
              item?.image == '0' ?
                <VideoPlayer
                  video={{ uri: imgURL + item?.media }}
                  //autoplay
                  videoWidth={500}
                  videoHeight={220}
                  resizeMode={'contain'}
                  // paused={!screenIsFocused}
                  style={{
                    height: 100,
                    width: '100%',
                    borderRadius: 6,
                    resizeMode: 'contain',
                    alignSelf: 'center',
                    justifyContent: 'center'
                  }}
                  // disableSeek
                  thumbnail={{ uri: imgURL + item?.thumbnail }}
                />
                :
                <>
                  {item?.image == '3' ?
                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text>{item?.media}</Text>
                      <TouchableOpacity onPress={() => this.downloadFile(item?.media)}>
                        <Entypo name={'download'} size={18} color={'#1872ea'} />
                      </TouchableOpacity>
                    </View>
                    : null}
                </>
          )
        }

        <Text
          style={{
            textAlign:
              item.sent_from_id == this.props.user.user.id ? 'right' : 'left',
            color: '#636060',
            fontSize: 9,
          }}>
          {new Date(item.created_at).toLocaleTimeString()}
        </Text>
      </View>
    </View>
  );

  pickDocument = async () => {
    let document = await DocumentPicker.pick({
      presentationStyle: 'fullScreen',
      transitionStyle: 'coverVertical',
      allowMultiSelection: false,
      type: IS_IOS ? "public.item" : "*/*"
      // type:"*/*"
    })
    let doc = document[0]
    this.setState({
      image: {
        uri: doc?.uri,
        name: doc?.name,
        size: doc?.size,
        type: doc?.type
      },
      mediaType: 3,
    }
      , () => {
        this.sendAttachment()
      }
    )
    console.warn(doc)
  }

  render() {
    console.warn('helllllo',
      // this.props.route.params?.item?.fromusername,
      this.props.route.params?.Screen
    );
    let Dark = this.props.Dark;
    return (
      <View style={[styles.container, { backgroundColor: Dark ? colors.black : colors.white }]}>
        <View style={{ paddingHorizontal: 14 }}>
          <MyHeader
            back
            notify
            profile
            navigation={this.props.navigation}
            // title={this.props.route.params?.item?.fromusername}
            title={
              this.props.route.params?.Screen == 'otherProfile' ?
                this.props.route.params?.item?.fromusername
                :
                this.props.route.params?.item?.from_user?.id == this.props.user.user.id ?
                  this.props.route.params?.item?.to_user?.username : this.props.route.params?.item?.from_user?.username
            }
            onBackPress={() => this.props.navigation.goBack()}
          />
        </View>

        <Text style={[styles.msgDay, { color: Dark ? colors.white : colors.black }]}>Today</Text>

        <FlatList
          inverted={true}
          data={this.state.messages}
          renderItem={this.renderMessages}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={this.renderLoaderMoreButton()}
        />
        <KeyboardAvoidingView behavior={IS_IOS ? 'padding' : null}>
          <View style={styles.footer}>
            {/* {this.state.image?.uri ? (
            // <TouchableOpacity onPress={this.selectImage} style={{ marginLeft: 10 }}>
            //   <Entypo name={'attachment'} size={22} color={'#1872ea'} />
            // </TouchableOpacity>
            <TouchableOpacity onPress={this.selectImage} style={{ marginLeft: 10 }}>
              <Image
                source={{ uri: this.state.image?.uri }}
                style={{
                  width: 40,
                  height: 40,
                  // borderRadius: 12,
                  // borderWidth: 1,
                  // borderColor: '#000'

                }}
              />
            </TouchableOpacity>
          ) : ( */}
            {this.state.uploading ?
              <ActivityIndicator
                size={'large'} color={'#1872ea'}
              /> : <TouchableOpacity onPress={this.selectImage} style={{ marginLeft: 10 }}>
                <Entypo name={'image'} size={22} color={'#1872ea'} />
              </TouchableOpacity>
            }
            {this.state.uploading ?
              <ActivityIndicator
                size={'large'} color={'#1872ea'}
              /> : <TouchableOpacity onPress={this.pickDocument} style={{ marginLeft: 10 }}>
                <Entypo name={'attachment'} size={22} color={'#1872ea'} />
              </TouchableOpacity>
            }
            {/* )} */}
            <TextInput
              value={this.state.text}
              onChangeText={text => this.setState({ text })}
              placeholder="Type something"
              placeholderTextColor={'#8D8D8D'}
              style={styles.input}
            />

            {this.state.messageSent ?
              <ActivityIndicator
                size={'large'} color={'#1872ea'}
              /> :
              <TouchableOpacity
                onPress={this.sendMessage}
                style={{ paddingHorizontal: 10 }}>
                {/* <Image
                source={require('../../assets/send.png')}
                style={{ width: 22, height: 22 }}
              /> */}
                <Ionicons name={'send'} size={22} color={'#1872ea'} />
              </TouchableOpacity>
            }
          </View>
        </KeyboardAvoidingView>
        {console.log(this.state.openImage)}
        <ImageView
          images={this.state.openImage}
          imageIndex={0}
          visible={this.state.visibleImage}
          onRequestClose={() => this.setState({ visibleImage: false, openImage: [] })}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user: state.AuthReducer.user,
  Dark: state.AppReducer.darkmode,
});
const mapDispatchToProps = dispatch => ({
  getMessage: payload => dispatch(ChatMiddleware.getAllUserMessages(payload)),
  sendMessage: payload => dispatch(ChatMiddleware.SendMessage(payload)),
  SendAttachment: payload => dispatch(ChatMiddleware.SendAttachment(payload)),
  DownloadAttachment: payload => dispatch(ChatMiddleware.DownloadAttachment(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  input: { flex: 1, paddingLeft: 14, color: '#636060', paddingVertical: IS_IOS ? 15 : 10 },
  userImg: { width: 55, height: 55, borderRadius: 50 },
  msgDay: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    fontSize: 16,
  },
  footer: {
    paddingVertical: 4,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#8D8D8D',
    alignItems: 'center',
    marginBottom: IS_IOS ? 10 : 0,

  },
  chatImg: { width: 100, height: 100, },
});
