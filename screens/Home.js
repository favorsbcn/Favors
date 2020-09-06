import React, { useState, useEffect, useRef } from "react";
import stylesGeneral from "../styles";
import { connect } from "react-redux";
import * as Location from "expo-location";
import { bindActionCreators } from "redux";
import * as Permissions from "expo-permissions";
import { View, Text, FlatList, Alert } from "react-native";
import { NavigationActions } from "react-navigation";
import * as IntentLauncher from "expo-intent-launcher";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

import {
  getPosts,
  getFilteredPosts,
  likePost,
  unlikePost,
  sharePost,
} from "../actions/post";
import { followUser, unfollowUser, getUser } from "../actions/user";
import { allowNotifications } from "../actions/index";

import { hasNewMessages } from "../querysFirebase/querysChat";

import { sendPost } from "../querysFirebase/querysMessages";
import db from "../config/firebase";

import { getLocationCurrent } from "../services/locationService";

import Post from "../components/Post";
import ModalPhoto from "../components/ModalPhoto";
import ButtonSecondary from "../components/ButtonSecondary";
import LoadingIndicator from "../components/LoadingIndicator";
import { updateLocationUser } from "../querysFirebase/querysUser";

const HomeScreem = (props) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModalPhoto, setShowModalPhoto] = useState(false);
  const [hasEnableLocation, setHasEnableLocation] = useState(true);
  const [modalPhoto, setModalPhoto] = useState(null);
  const [user, setUser] = useState(null);
  const [page, setPage] = useState(0);

  const mountedRef = useRef(false);

  useEffect(() => {
    if (props.user.uid) {
      setUser(props.user);
    }
  }, [props.user]);

  // se garantiza que el estado user este actualizado
  useEffect(() => {
    const loadInitial = async () => {
      props.getPosts(true, null, user.location.city);
      await props.allowNotifications(props.user.uid);
      if (!mountedRef.current) {
        getLocation();
        checkMessages(); // subcribe listener
        mountedRef.current = true;
      }
      setLoading(false);
    };
    if (user) {
      loadInitial();
    }
  }, [user]);

  //this is the listener
  const checkMessages = () => {
    db.collection("conversations")
      .where("memberUids", "array-contains", user.uid)
      .onSnapshot((querySnapshot) => {
        checkNewMessages();
      });
  };

  const checkNewMessages = async () => {
    const { navigation } = props;
    const newMsg = await hasNewMessages(user.uid);

    const setParamAction = NavigationActions.setParams({
      params: { newMessages: newMsg },
      key: "Messages",
    });
    navigation.dispatch(setParamAction);
  };

  const getLocation = async () => {
    const isEnableLocation = await Location.hasServicesEnabledAsync();
    setHasEnableLocation(isEnableLocation);
    if (isEnableLocation) {
      const permissionLocation = await Permissions.askAsync(
        Permissions.LOCATION
      );
      if (permissionLocation.status === "granted") {
        const locationCurrent = await getLocationCurrent();
        if (user.location) {
          const { city, region, country } = user.location;
          if (
            city === locationCurrent.city &&
            region === locationCurrent.region &&
            country === locationCurrent.country
          ) {
            // carga inicial, lo hace en useEffect
          } else {
            await updateLocationUser(user, locationCurrent);
            props.getUser(user.uid, "LOGIN");
          }
        } else {
          await updateLocationUser(user, locationCurrent);
          props.getUser(user.uid, "LOGIN");
        }
      } else {
        Alert("Favors necesita permisos de localización");
      }
    }
  };

  const openSetting = () => {
    IntentLauncher.startActivityAsync(
      IntentLauncher.ACTION_LOCATION_SOURCE_SETTINGS
    );
  };

  const openPhoto = (photo) => {
    setModalPhoto(photo);
    setShowModalPhoto(true);
  };

  const closedPhoto = () => {
    setShowModalPhoto(false);
    setModalPhoto(null);
  };

  const sendPostToConversation = async (item) => {
    const post = {
      id: item.id,
      photo: item.postPhoto,
      date: item.date,
      description: item.postDescription,
    };
    const conversation = await sendPost(
      user.uid,
      user.username,
      user.photo,
      item.uid,
      item.username,
      item.photo,
      post
    );
    props.navigation.navigate("Chat", {
      conversation: conversation.getId(),
      who: conversation.getUsername(),
      photo: conversation.getPhoto(),
      otherUser: conversation.getOtherUserUID(),
      user: conversation,
    });
  };

  const handleGetPost = async () => {
    props.getPosts(false, props.post.reference, user.location.city);
  };

  const handleRefresh = () => {
    setRefreshing(false);
    props.getPosts(true, null, user.location.city);
  };

  const goToUser = (user) => {
    props.navigation.navigate("Profile", { user });
  };

  const renderLoading = () => {
    return (
      <View style={[stylesGeneral.container, stylesGeneral.center]}>
        <LoadingIndicator size="large" color="#00CBA8" />
      </View>
    );
  };

  const renderHasNotLocation = () => (
    <View style={[stylesGeneral.center, stylesGeneral.container]}>
      <MaterialIcons
        name="gps-off"
        size={80}
        style={{ opacity: 0.2, color: "#00CBA8" }}
      />
      <Text style={{ marginTop: 25, marginBottom: 25 }}>
        Es necesario que actives tu GPS
      </Text>
      <ButtonSecondary text="Actualizar" onPress={getLocation} />
      <ButtonSecondary text="Activar GPS" onPress={openSetting} />
    </View>
  );

  const renderWithoutPosts = () => (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <MaterialCommunityIcons
        name="playlist-remove"
        size={80}
        style={{ opacity: 0.2, color: "#00CBA8" }}
      />
      <Text style={{ marginTop: 25 }}>
        Eres el primero en escribir en tu ciudad
      </Text>
    </View>
  );

  const renderPost = (post) => (
    <Post
      post={post}
      user={user}
      openPhoto={openPhoto}
      goToUser={goToUser}
      onSendPostToConversation={sendPostToConversation}
    />
  );

  const renderView = () => {
    let render = null;
    if (!hasEnableLocation) {
      render = renderHasNotLocation();
    } else if (props.post === null || props.post.feed.length === 0) {
      render = renderWithoutPosts();
    } else {
      render = (
        <>
          {modalPhoto && (
            <ModalPhoto
              show={showModalPhoto}
              image={modalPhoto}
              onClose={closedPhoto}
            />
          )}
          <FlatList
            refreshing={refreshing}
            onRefresh={handleRefresh}
            data={props.post ? props.post.feed : []}
            keyExtractor={(item) => item.key}
            onEndReached={() => handleGetPost()}
            onEndReachedThreshold={0.8}
            renderItem={({ item }) => renderPost(item)}
          />
        </>
      );
    }
    return render;
  };

  return loading ? (
    renderLoading()
  ) : (
    <View style={[stylesGeneral.container, stylesGeneral.bgLightGray]}>
      {renderView()}
    </View>
  );
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getPosts,
      getFilteredPosts,
      likePost,
      unlikePost,
      sharePost,
      getUser,
      followUser,
      unfollowUser,
      allowNotifications,
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreem);
