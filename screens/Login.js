import React, { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import * as AppleAuthentication from "expo-apple-authentication";
import { StyleSheet, View, Text, Image, Linking } from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import firebase from "firebase";

import LoadingIndicator from "../components/LoadingIndicator";
import Slides from "../components/Slides";
import Button from "../components/Button";

import { login, getUserById, getUser } from "../actions/user";
import { allowNotifications } from "../actions/index";

import { facebookLogin, appleLogin } from "../querysFirebase/querysUser";

import { slideData } from "../data/data";

import stylesGeneral from "../styles";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
  },
  containerMain: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 20,
  },
  logo: {
    marginRight: 10,
    width: 50,
    height: 50,
    resizeMode: "stretch",
  },
});

const LoginScreem = (props) => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          const userDataFull = await getUserById(user.uid);
          setUserData(userDataFull);
          props.getUser(user.uid, "LOGIN");
        } else {
          setLoading(false);
        }
      });
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (userData) {
      props.navigation.navigate("Home");
    }
  }, [userData]);

  const openConditions = () => {
    Linking.openURL(
      "https://drive.google.com/open?id=1NOQWXNUuSlp1bHjrOePYjHIjU-a5rSd6"
    );
  };

  const handleFacebookLogin = async () => {
    setLoading(true);
    await facebookLogin();
  };

  const handleAppleLogin = async () => {
    setLoading(true);
    await appleLogin();
  };

  const isAvailableLoginApple = async () => {
    const isAvailable = await AppleAuthentication.isAvailableAsync();
    return isAvailable;
  };

  const renderLogo = () => (
    <View style={styles.logoContainer}>
      <Image style={styles.logo} source={require("../assets/logo.png")} />
      <Text style={stylesGeneral.titleStyle}>Favors</Text>
    </View>
  );

  const renderContent = () => {
    return (
      <>
        {renderLogo()}
        <View style={styles.containerMain}>
          <Slides data={slideData} />
        </View>
        <View
          style={{
            alignItems: "center",
            padding: 20,
            alignSelf: "stretch",
          }}
        >
          <Button
            onPress={handleFacebookLogin}
            text={"Iniciar sesión con Facebook"}
            bgColor="#2851A3"
            textColor="white"
          />
          {Platform.OS === "ios" && isAvailableLoginApple() && (
            <Button
              onPress={handleAppleLogin}
              text={"Iniciar sesión con Apple"}
            />
          )}
          <Text style={[stylesGeneral.termsText]}>
            Nunca publicaremos nada en tu Facebook
          </Text>
          <Text style={[stylesGeneral.conditionsText]} onPress={openConditions}>
            Condiciones de uso
          </Text>
        </View>
      </>
    );
  };

  return (
    <LinearGradient colors={["#02EEC5", "#00CBA8"]} style={[styles.container]}>
      {loading ? (
        <View style={styles.containerMain}>
          <LoadingIndicator size="large" color="#fff" />
          {renderLogo()}
        </View>
      ) : (
        renderContent()
      )}
    </LinearGradient>
  );
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      allowNotifications,
      getUser,
      login,
    },
    dispatch
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreem);
