import React from "react";
import styles from "../styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  View,
  Text,
  FlatList,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  SafeAreaView,
} from "react-native";
import { StackActions } from "react-navigation";
import { Image } from "react-native-expo-image-cache";
import MessageSendText from "../components/MessageSendText";
import moment from "moment";
import "moment/locale/es";
import { Ionicons, Feather, AntDesign } from "@expo/vector-icons";
import { Image as CachedImage } from "react-native-expo-image-cache";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { Camera } from "expo-camera";

import { uploadPhoto } from "../actions";

import { compressImage } from "../utils";

import { updateLastReading } from "../querysFirebase/querysChat";
import {
  getMessages,
  addMessage,
  addPhotoMessage,
} from "../querysFirebase/querysMessages";

class Chat extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: null,
      headerLeft: (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => {
              if (navigation.getParam("rName") === "pending") {
                navigation.dispatch(StackActions.pop({ n: 2 }));
              } else {
                navigation.goBack();
              }
            }}
          >
            <Ionicons
              style={[styles.icon, { marginHorizontal: 12 }]}
              name={"ios-arrow-back"}
              size={30}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Profile", {
                user: { uid: navigation.getParam("otherUser") },
              })
            }
            style={{ flexDirection: "row" }}
          >
            <CachedImage
              uri={navigation.getParam("photo")}
              style={[
                styles.roundImage,
                { width: 32, height: 32, borderRadius: 16 },
              ]}
            />
            <Text numberOfLines={1} style={styles.screenTitle}>
              {navigation.getParam("who", "Direct")}
            </Text>
          </TouchableOpacity>
        </View>
      ),
      headerRight: (
        <TouchableOpacity
          style={[styles.postButton, { marginHorizontal: 12 }]}
          onPress={() =>
            navigation.navigate("Donate", { user: navigation.getParam("user") })
          }
        >
          <Text style={styles.secondaryButton}>Enviar tiempo</Text>
        </TouchableOpacity>
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      showModalPhoto: false,
      showModal: false,
      message: "",
      date: "",
      initialFecth: true,
      reference: null,
      messages: [],
    };
    this.getMessagesComversation = this.getMessagesComversation.bind(this);
  }

  _getConversation() {
    return this.props.navigation.getParam("conversation");
  }

  _initialData() {
    this.getMessagesComversation();
    const conversation = this._getConversation();
    setTimeout(() => {
      updateLastReading(conversation, this.props.user.uid);
    }, 50);
  }

  componentDidMount() {
    //this._initialData()
    this.props.navigation.addListener("willFocus", () => {
      this.setState(
        {
          initialFecth: true,
          reference: null,
          messages: [],
        },
        () => this._initialData()
      );
    });
  }

  async getMessagesComversation() {
    const { messages, ref } = await getMessages(
      this._getConversation(),
      this.state.initialFecth,
      this.state.reference
    );
    messages.map((m) => {
      this.setState({
        reference: ref,
        initialFecth: false,
        messages: [...this.state.messages, m],
      });
    });
  }

  sendMessage = async (message) => {
    const conversation = this._getConversation();
    const dataMessage = await addMessage(
      conversation,
      this.props.user.username,
      this.props.user.uid,
      message
    );
    this.setState({
      messages: [dataMessage, ...this.state.messages],
    });
    setTimeout(() => {
      updateLastReading(conversation, this.props.user.uid);
    }, 50);
  };

  sendPhotoMessage = async (message) => {
    const conversation = this._getConversation();
    const dataMessage = await addPhotoMessage(
      conversation,
      this.props.user.username,
      this.props.user.uid,
      message
    );
    this.setState({
      messages: [dataMessage, ...this.state.messages],
    });
    setTimeout(() => {
      updateLastReading(conversation, this.props.user.uid);
    }, 50);
  };

  openCameraRoll = () => {
    if (!this.state.messages.photo) {
      this.openLibrary();
    }
  };

  openCamera = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status === "granted") {
      this.setState({ showModal: true });
    }
  };

  openLibrary = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      const image = await ImagePicker.launchImageLibraryAsync();
      if (!image.cancelled) {
        const imageManipulate = await compressImage(image);
        const url = await this.props.uploadPhoto(imageManipulate);
        this.sendPhotoMessage(url);
      }
    }
  };

  snapPhoto = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status === "granted") {
      const image = await this.camera.takePictureAsync();
      this.setState({ showModal: false });
      if (!image.cancelled) {
        const resize = await compressImage(image);
        const url = await this.props.uploadPhoto(resize);
        this.sendPhotoMessage(url);
      }
    }
  };

  openPhoto = (photo) => {
    this.setState({ showModalPhoto: true, modalPhoto: photo });
  };

  closePhoto = () => {
    this.setState({ showModalPhoto: false, modalPhoto: "" });
  };

  renderPost(item, uid) {
    const { username } = this.props.user;
    return (
      <View
        style={[
          styles.row,
          styles.space,
          styles.center,
          { marginHorizontal: 12, marginVertical: 26 },
        ]}
      >
        <View style={[styles.postContent, styles.center]}>
          <View style={[styles.column, styles.center]}>
            {item.uid == uid ? (
              <Text
                style={[styles.gray, { fontSize: 14, textAlign: "center" }]}
              >
                Has respondido a un post
              </Text>
            ) : (
              <Text
                style={[styles.gray, { fontSize: 14, textAlign: "center" }]}
              >
                {username} ha respondido tu post
              </Text>
            )}
            <Text style={[styles.postDescription, { textAlign: "center" }]}>
              {item.post.description}
            </Text>
            {item.post.photo !== " " ? (
              <TouchableOpacity onPress={() => this.openPhoto(item.post.photo)}>
                <Image
                  style={[styles.photoMessage, { textAlign: "center" }]}
                  uri={item.post.photo}
                />
              </TouchableOpacity>
            ) : null}
            {this.state.date == "" ? (
              <Text style={styles.dateMessage}>
                {moment(item.date).fromNow()}
              </Text>
            ) : (
              this.setState({ date: "" })
            )}
          </View>
        </View>
      </View>
    );
  }

  renderMessage(item, uid) {
    return (
      <View
        style={[
          styles.row,
          styles.space,
          { marginHorizontal: 12, marginVertical: 6 },
        ]}
      >
        {item.uid !== uid ? (
          <Image
            style={styles.roundSmallImage}
            uri={this.props.navigation.getParam("photo")}
          />
        ) : null}
        <View
          style={[
            styles.container,
            item.uid === uid ? styles.right : styles.left,
          ]}
        >
          {item.message ? (
            <View
              style={[
                styles.chatBox,
                item.uid === uid ? styles.bgLightGray : styles.bgWhite,
              ]}
            >
              <Text style={styles.message}>{item.message}</Text>
            </View>
          ) : null}
          {item.photo ? (
            <TouchableOpacity onPress={() => this.openPhoto(item.photo)}>
              <Image style={styles.photoMessage} uri={item.photo} />
            </TouchableOpacity>
          ) : null}
          {this.state.date == "" ? (
            <Text style={styles.dateMessage}>
              {moment(item.date).fromNow()}
            </Text>
          ) : (
            this.setState({ date: "" })
          )}
        </View>
      </View>
    );
  }

  renderTime(item, uid) {
    return (
      <View
        style={[
          styles.row,
          styles.space,
          styles.center,
          { marginHorizontal: 12, marginVertical: 26 },
        ]}
      >
        <View style={[styles.column, styles.center]}>
          {item.uid == uid ? (
            <Text style={[styles.gray, { fontSize: 14, textAlign: "center" }]}>
              Has enviado{" "}
              <Text style={{ fontWeight: "bold" }}>{item.time}</Text> minutos.
            </Text>
          ) : (
            <Text style={[styles.gray, { fontSize: 14, textAlign: "center" }]}>
              {this.props.navigation.getParam("who", "Direct")} te ha enviado{" "}
              <Text style={{ fontWeight: "bold" }}>{item.time}</Text> minutos
            </Text>
          )}
          {this.state.date == "" ? (
            <Text style={styles.dateMessage}>
              {moment(item.date).fromNow()}
            </Text>
          ) : (
            this.setState({ date: "" })
          )}
        </View>
      </View>
    );
  }

  renderRequestTime = (item, uid) => (
    <View
      style={[
        styles.row,
        styles.space,
        styles.center,
        { marginHorizontal: 12, marginVertical: 26 },
      ]}
    >
      <View style={[styles.column, styles.center]}>
        {item.uid == uid ? (
          <Text style={[styles.gray, { fontSize: 14, textAlign: "center" }]}>
            Has pedido{" "}
            <Text style={{ fontWeight: "bold" }}>{item.requestTime}</Text>{" "}
            minutos.
          </Text>
        ) : (
          <Text style={[styles.gray, { fontSize: 14, textAlign: "center" }]}>
            {this.props.navigation.getParam("who", "Direct")} te han pedido{" "}
            <Text style={{ fontWeight: "bold" }}>{item.requestTime}</Text>{" "}
            minutos
          </Text>
        )}
        {this.state.date == "" ? (
          <Text style={styles.dateMessage}>{moment(item.date).fromNow()}</Text>
        ) : (
          this.setState({ date: "" })
        )}
      </View>
    </View>
  );

  _renderItem = ({ item }) => {
    const { uid } = this.props.user;
    if (item.post) {
      return this.renderPost(item, uid);
    } else if (item.time) {
      return this.renderTime(item, uid);
    } else if (item.requestTime) {
      return this.renderRequestTime(item, uid);
    } else {
      return this.renderMessage(item, uid);
    }
  };

  _renderModalPhoto() {
    return this.state.modalPhoto !== "" ? (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.showModalPhoto}
      >
        <SafeAreaView style={[{ flex: 1, backgroundColor: "#000000" }]}>
          <TouchableOpacity
            style={{ paddingLeft: 24 }}
            onPress={() => this.setState({ showModalPhoto: false })}
          >
            <AntDesign color={"#fff"} name={"close"} size={32} />
          </TouchableOpacity>
          <View
            style={[
              styles.container,
              styles.center,
              { backgroundColor: "#000000" },
            ]}
          >
            <Image style={styles.postPhoto} uri={this.state.modalPhoto} />
          </View>
        </SafeAreaView>
      </Modal>
    ) : null;
  }

  _renderModal() {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.showModal}
      >
        <Camera
          style={{ flex: 1 }}
          ref={(ref) => {
            this.camera = ref;
          }}
          type={Camera.Constants.Type.back}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <TouchableOpacity
              style={{ paddingLeft: 24 }}
              onPress={() => this.setState({ showModal: false })}
            >
              <AntDesign color={"white"} name={"close"} size={32} />
            </TouchableOpacity>
          </SafeAreaView>
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={() => this.snapPhoto()}
          />
        </Camera>
      </Modal>
    );
  }

  render() {
    if (!this.state.messages)
      return <ActivityIndicator style={styles.container} />;
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView
          enabled
          behavior="padding"
          style={styles.container}
        >
          {this._renderModalPhoto()}
          {this._renderModal()}
          <FlatList
            inverted
            keyExtractor={(item) => String(item.date)}
            data={this.state.messages}
            onEndReached={() => this.getMessagesComversation()}
            onEndReachedThreshold={0.8}
            renderItem={this._renderItem}
          />
          <SafeAreaView style={{ justifyContent: "space-between" }}>
            <View style={[styles.row, { marginHorizontal: 12 }]}>
              <TouchableOpacity onPress={() => this.openCameraRoll()}>
                <Feather
                  style={[{ marginRight: 5, marginTop: 10 }, styles.darkGray]}
                  name="image"
                  size={25}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.openCamera()}>
                <Feather
                  style={[{ marginLeft: 5, marginTop: 10 }, styles.darkGray]}
                  name="camera"
                  size={25}
                />
              </TouchableOpacity>
            </View>
            <MessageSendText
              sendMessage={(message) => this.sendMessage(message)}
            />
          </SafeAreaView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ uploadPhoto }, dispatch);
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
