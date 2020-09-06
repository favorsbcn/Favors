import React from "react";
import styles from "../styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Feather, AntDesign } from "@expo/vector-icons";
import {
  Modal,
  SafeAreaView,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import { Camera } from "expo-camera";

import { NavigationEvents } from "react-navigation";
import { Image } from "react-native-expo-image-cache";
import RNPickerSelect from "react-native-picker-select";

import { uploadPhoto } from "../actions";
import { getUser } from "../actions/user";
import skills from "../data/skills";

import { compressImage } from "../utils";

import { addPost } from "../querysFirebase/querysPosts";

class Post extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: null,
      headerRight: (
        <TouchableOpacity
          style={[styles.postButton, { marginRight: 12 }]}
          onPress={navigation.getParam("post")}
        >
          <Text style={styles.secondaryButton}>Publicar</Text>
        </TouchableOpacity>
      ),
    };
  };

  state = {
    showModal: false,
    showModalTag: false,
    hasEnableLocation: true,
    location: {},
    skills: "",
    description: "",
    photo: "",
  };

  componentDidMount() {
    const { navigation } = this.props;
    this.getLocation();
    this.props.navigation.setParams({ post: this.post });
    navigation.addListener("willFocus", async () => {
      this.checkEnableLocation();
    });
  }

  async checkEnableLocation() {
    const hasEnableLocation = await Location.hasServicesEnabledAsync();
    this.setState({
      hasEnableLocation: hasEnableLocation,
    });
    if (!hasEnableLocation) {
      Alert.alert("GPS desactivado", "Es necesario que actives tu GPS", [
        {
          text: "OK",
          onPress: () => this.props.navigation.navigate("Home"),
        },
      ]);
    }
  }

  post = async () => {
    if (this.state.skills !== "") {
      if (this.state.description !== "") {
        this.props.getUser(this.props.user.uid, "LOGIN");
        await addPost(
          this.state.photo,
          this.state.description,
          this.state.location,
          this.state.skills,
          this.props.user
        );
        this.setState({
          description: "",
          photo: "",
          skills: "",
          location: {},
        });
        this.props.navigation.navigate("Home");
      } else {
        Alert.alert("La publicación está vacía");
      }
    } else {
      Alert.alert("Debes seleccionar una habilidad");
    }
  };

  openCameraRoll = () => {
    if (!this.props.post.photo) {
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
        this.setState({
          photo: url,
        });
      }
    }
  };

  getLocation = async () => {
    this.setState({
      location: this.props.user.location,
    });
  };

  snapPhoto = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status === "granted") {
      const image = await this.camera.takePictureAsync();
      this.setState({ showModal: false });
      if (!image.cancelled) {
        const resize = await compressImage(image);
        const url = await this.props.uploadPhoto(resize);
        this.setState({ photo: url });
      }
    }
  };

  deletePostPhoto = () => {
    this.setState({
      photo: " ",
    });
  };

  render() {
    const placeholder = {
      label: "Selecciona una habilidad",
      value: null,
    };

    return (
      <ScrollView style={[styles.container]}>
        <NavigationEvents onWillFocus={this.onWillFocus} />
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

        <View style={[styles.row, styles.maxWidth, { marginTop: 16 }]}>
          <Image
            style={styles.roundImage}
            uri={this.props.user ? this.props.user.photo : ""}
          />
          <View style={styles.postContent}>
            <View style={styles.column}>
              <View style={styles.inputBox}>
                <TextInput
                  style={{ fontSize: 17 }}
                  placeholderStyle={{ color: "#6E6E6E" }}
                  value={this.state.description}
                  onChangeText={(text) => this.setState({ description: text })}
                  placeholder="¿Qué necesitas?"
                  maxLength={240}
                  multiline={true}
                />
                {this.state.photo !== "" && this.state.photo !== " " ? (
                  <View>
                    <Image
                      style={styles.postPhotoInsideInput}
                      uri={this.props.user ? this.state.photo : ""}
                    />
                    <TouchableOpacity
                      style={{
                        position: "absolute",
                        marginLeft: 10,
                        marginTop: 24,
                      }}
                      onPress={() => this.deletePostPhoto()}
                    >
                      <Feather
                        style={[{ color: "#fff", zIndex: 1 }]}
                        name="x"
                        size={25}
                      />
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
              <View style={styles.row}>
                <TouchableOpacity onPress={() => this.openCameraRoll()}>
                  <Feather
                    style={[{ margin: 5 }, styles.darkGray]}
                    name="image"
                    size={25}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.openCamera()}>
                  <Feather
                    style={[{ margin: 5 }, styles.darkGray]}
                    name="camera"
                    size={25}
                  />
                </TouchableOpacity>
              </View>
              <Text style={[styles.gray, styles.skillsTitle]}>
                {"Habilidad requerida"}
              </Text>
              <View>
                <RNPickerSelect
                  placeholder={placeholder}
                  items={skills}
                  onValueChange={(value) => {
                    this.setState({
                      skills: value,
                    });
                  }}
                  style={pickerSelectStyles}
                  value={this.state.skills}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getUser,
      uploadPhoto,
    },
    dispatch
  );
};

const mapStateToProps = (state) => {
  return {
    post: state.post,
    user: state.user,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Post);

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#D8D8D8",
    borderRadius: 4,
    color: "#000",
    marginTop: 4,
    marginBottom: 18,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "#D8D8D8",
    borderRadius: 8,
    color: "#000",
    marginTop: 4,
    marginBottom: 18,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
