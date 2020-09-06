import React from "react";
import styles from "../styles";
import moment from "moment";
import firebase from "firebase";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Feather, AntDesign } from "@expo/vector-icons";
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  SafeAreaView,
  FlatList,
} from "react-native";
import { Image } from "react-native-expo-image-cache";

import AppBadge from "../components/AppBadge";
import Post from "../components/Post";
import ModalPhoto from "../components/ModalPhoto";

import { getUser } from "../actions/user";
import { initialiseConversation } from "../actions/chats";

import { getUserById } from "../querysFirebase/querysUser";
import { getUserPosts } from "../querysFirebase/querysPosts";

import "moment/locale/es";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModalPhoto: false,
      modalPhoto: "",
      initialFetch: true,
      reference: null,
      myPosts: [],
      userProfile: null, //stateNav.routeName === 'Profile' ? props.profile : props.user,
      minutesCoins: 0,
      hoursCoins: 0,
      preload: false,
    };
    this.calculateTimeCoins = this.calculateTimeCoins.bind(this);
    this.getPosts = this.getPosts.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
  }

  componentDidMount() {
    this.getUserData();
  }

  async getUserData() {
    const dataPost = this.props.navigation.getParam("user");
    const data = await getUserById(dataPost.uid);
    this.setState(
      {
        userProfile: data,
      },
      () => {
        this.calculateTimeCoins();
        this.getPosts();
      }
    );
  }

  async getPosts() {
    const { posts, ref } = await getUserPosts(
      this.state.initialFetch,
      this.state.reference,
      this.state.userProfile.uid
    );
    posts.map((p) => {
      this.setState({
        myPosts: [...this.state.myPosts, p],
        reference: ref,
        initialFetch: false,
      });
    });
  }

  calculateTimeCoins() {
    const { userProfile } = this.state;
    let minutesCoins = 0;
    let hoursCoins = 0;
    if (userProfile) {
      minutesCoins = userProfile.timeCoins % 60;
      minutesCoins = (minutesCoins < 10 ? "0" : "") + minutesCoins;
      hoursCoins = (userProfile.timeCoins - minutesCoins) / 60;
      this.setState({
        minutesCoins,
        hoursCoins,
      });
    }
  }

  follow = (user) => {
    if (user.followers.indexOf(this.props.user.uid) >= 0) {
      this.props.unfollowUser(user);
    } else {
      this.props.followUser(user);
    }
  };

  goToUser = (user) => {
    this.props.getUser(user.uid);
    this.props.navigation.navigate("Donate", { user });
  };

  onSignout = () => {
    firebase.auth().signOut();
    this.props.navigation.navigate("Login");
  };

  openPhoto = (photo) => {
    this.setState({ showModalPhoto: true, modalPhoto: photo });
  };

  closePhoto = () => {
    this.setState({ showModalPhoto: false, modalPhoto: "" });
  };

  renderPreloading = () => {
    setTimeout(() => {
      this.setState({
        preload: false,
      });
    }, 2000);
    return this.state.preload ? (
      <LoadingIndicator size="large" color="#00CBA8" />
    ) : null;
  };

  sendPostToConversation = async (item) => {
    const post = {
      id: item.id,
      photo: item.postPhoto,
      date: item.date,
      description: item.postDescription,
    };
    const conversation = await sendPost(
      this.state.userProfile.uid,
      this.state.userProfile.username,
      this.state.userProfile.photo,
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

  renderItem = ({ item }) => {
    return (
      <Post
        post={item}
        user={this.state.userProfile}
        openPhoto={this.openPhoto}
        onSendPostToConversation={this.sendPostToConversation}
      />
    );
  };

  closedPhoto = () => {
    this.setState({
      modalPhoto: "",
      showModalPhoto: false,
    });
  };

  renderHeader() {
    const { userProfile } = this.state;
    return (
      <View>
        {this.state.modalPhoto !== "" && (
          <ModalPhoto
            show={this.state.showModalPhoto}
            image={this.state.modalPhoto}
            onClose={this.closedPhoto}
          />
        )}
        <View style={[styles.center, { marginTop: 20 }]}>
          <TouchableOpacity onPress={() => this.openPhoto(userProfile.photo)}>
            <Image style={styles.roundBigImage} uri={userProfile.photo} />
          </TouchableOpacity>
          <Text style={styles.bold}>{userProfile.username}</Text>
          <Text style={{ marginTop: 5 }}>{userProfile.bio}</Text>
          <Text style={{ marginTop: 5 }}>
            Tiempo disponible: {this.state.hoursCoins}:{this.state.minutesCoins}
          </Text>
          {userProfile.location ? (
            <Text style={{ marginTop: 5 }}>
              Localización: {userProfile.location.city}
            </Text>
          ) : null}
        </View>

        <View
          style={[
            styles.center,
            {
              marginTop: 10,
              paddingBottom: 25,
              borderBottomColor: "#E6E6E6",
              borderBottomWidth: 0.5,
            },
          ]}
        >
          {this.props.user.uid === this.state.userProfile.uid ? null : (
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.buttonSmall}
                onPress={() => this.goToUser(userProfile)}
              >
                <Text style={styles.bold}>Pagar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonSmall}
                onPress={() => {
                  this.props
                    .initialiseConversation(userProfile)
                    .then((conversation) => {
                      this.props.navigation.navigate("Chat", {
                        conversation: conversation.getId(),
                        who: conversation.getUsername(),
                        photo: conversation.getPhoto(),
                      });
                    });
                }}
              >
                <Text style={styles.bold}>Mensaje</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  }

  render() {
    const { userProfile } = this.state;
    if (!userProfile) return <ActivityIndicator style={styles.container} />;
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          data={this.state.myPosts}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={this.renderHeader}
          ListFooterComponent={this.renderPreloading}
          onEndReached={() => this.getPosts()}
          onEndReachedThreshold={1}
          renderItem={this.renderItem}
        />
      </SafeAreaView>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ getUser, initialiseConversation }, dispatch);
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
