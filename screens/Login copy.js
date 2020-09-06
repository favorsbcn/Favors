import React from "react";
import styles from "../styles";
import firebase from "firebase";
import * as AppleAuthentication from "expo-apple-authentication";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
} from "react-native";
import { updateEmail, updatePassword, login, getUser } from "../actions/user";
import { allowNotifications } from "../actions/index";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getPosts } from "../actions/post";

import { LinearGradient } from "expo-linear-gradient";
import Slides from "../components/Slides";
import { SafeAreaView } from "react-navigation";
import LoadingIndicator from "../components/LoadingIndicator";
import { facebookLogin, appleLogin } from "../querysFirebase/querysUser";

const SLIDE_DATA = [
  { title: "", text: "" },
  {
    title: "Nuestra moneda \nes el tiempo",
    text: "Gánalo y gástalo \ncomo si fuera dinero",
  },
  { title: "Comparte", text: "Comparte tus habilidades \ny pasiones" },
  { title: "Cobra", text: "Cobra tiempo y recoge \nevaluaciones positivas" },
  { title: "Gasta", text: "Con el tiempo ganado \nsatisface tus necesidades" },
];

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: {},
      preloading: true,
    };
  }

  componentDidMount() {
    this.checkAuth();
  }

  checkAuth = async () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ preloading: true });
        if (this.props.user !== null && this.props.user !== undefined) {
          console.log("pass login");
          this.props.navigation.navigate("Home", { user: user });
        }
      } else {
        this.setState({
          preloading: false,
        });
      }
    });
  };

  _handlePress = () => {
    Linking.openURL(
      "https://drive.google.com/open?id=1NOQWXNUuSlp1bHjrOePYjHIjU-a5rSd6"
    );
  };

  loginAppleAvailable = async () => {
    const isAvailable = await AppleAuthentication.isAvailableAsync();
    return isAvailable;
  };

  render() {
    return (
      <LinearGradient
        colors={["#02EEC5", "#00CBA8"]}
        style={[styles.container, styles.center]}
      >
        <Slides data={SLIDE_DATA} onComplete={this.onSlidesComplete} />

        <SafeAreaView style={[styles.center]}>
          {this.state.preloading ? (
            <LoadingIndicator size="large" color="#ffffff" />
          ) : null}

          <MaterialCommunityIcons
            style={[{ color: "#fff" }]}
            name="hand-pointing-right"
            size={30}
          />
          {this.state.preloading ? (
            <Text
              style={[styles.termsText, { marginBottom: 150, fontSize: 15 }]}
            >
              Desliza par saber más
            </Text>
          ) : (
            <View>
              <Text
                style={[
                  styles.termsText,
                  { marginBottom: 30, fontSize: 15, textAlign: "center" },
                ]}
              >
                Desliza par saber más
              </Text>
              <TouchableOpacity
                style={styles.facebookButton}
                onPress={async () => {
                  this.setState({
                    preloading: true,
                  });
                  await facebookLogin();
                }}
              >
                <MaterialCommunityIcons
                  name="facebook"
                  size={25}
                  style={{ marginRight: 15 }}
                />
                <Text style={[styles.white, styles.facebookButtonText]}>
                  Conectarse con Facebook
                </Text>
              </TouchableOpacity>
              {Platform.OS === "ios" && this.loginAppleAvailable() && (
                <TouchableOpacity
                  style={styles.facebookButton}
                  onPress={async () => {
                    this.setState({
                      preloading: true,
                    });
                    await appleLogin();
                  }}
                >
                  <MaterialCommunityIcons
                    name="apple"
                    size={25}
                    style={{ marginRight: 15 }}
                  />
                  <Text style={[styles.white, styles.facebookButtonText]}>
                    Iniciar sesión con Apple
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          <Text style={[styles.termsText]}>
            Nunca publicaremos nada en tu Facebook
          </Text>
          <Text style={[styles.conditionsText]} onPress={this._handlePress}>
            Condiciones de uso
          </Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      allowNotifications,
      getPosts,
      updateEmail,
      updatePassword,
      login,
      getUser,
    },
    dispatch
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    post: state.post,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
