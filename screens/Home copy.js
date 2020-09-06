import React from "react";
import styles from "../styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  getPosts,
  getFilteredPosts,
  likePost,
  unlikePost,
  sharePost,
} from "../actions/post";
import { followUser, unfollowUser, getUser } from "../actions/user";
import {
  AntDesign,
  SimpleLineIcons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {
  Text,
  View,
  Share,
  FlatList,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from "react-native";
import { Image } from "react-native-expo-image-cache";
import { NavigationActions } from "react-navigation";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import * as IntentLauncher from "expo-intent-launcher";
import AppBadge from "../components/AppBadge";
import moment from "moment";
import firebase from "firebase";
import db from "../config/firebase";
import "moment/locale/es";

// own components
import LoadingIndicator from "../components/LoadingIndicator";

//components
import { hasNewMessages } from "../querysFirebase/querysChat";
import { sendPost } from "../querysFirebase/querysMessages";
import { updateLocationUser } from "../querysFirebase/querysUser";

// actions
import { getUserById } from "../actions/user";
import { allowNotifications } from "../actions/index";
import { Linking } from "expo";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModalPhoto: false,
      modalPhoto: "",
      posts: [],
      skills: "",
      visible: false,
      refreshing: false,
      initialFecth: true,
      ref: null,
      newMessages: false,
      user: props.user,
      reload: null,
      page: 0,
      location: null,
      hasEnableLocation: true,
      listenerConv: null,
    };
    console.log("state", props.user);
    this.sharePost = this.sharePost.bind(this);
    this.checkNewMessages = this.checkNewMessages.bind(this);
    this.getDataUser = this.getDataUser.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.sendPostToConversation = this.sendPostToConversation.bind(this);
    this.handleGetPost = this.handleGetPost.bind(this);
  }

  componentDidMount() {
    console.log("did mount");
    this.getDataUser();
    console.log("get data user");
    setTimeout(() => {
      console.log("settime");
      const { navigation } = this.props;
      navigation.addListener("willFocus", async () => {
        console.log("willfocus");
        if (this.state.hasEnableLocation) {
          const u = await getUserById(this.state.user.uid);
          this.setState(
            {
              user: u,
              posts: [],
              initialFecth: true,
              ref: null,
              refreshing: false,
              location: u.location,
            },
            () => {
              this.props.getPosts(
                this.state.initialFecth,
                null,
                this.state.location.city
              );
            }
          );
        } else {
          this.getLocation();
        }
      });
    }, 500);
  }

  componentWillUnmount() {
    this.checkMessages(); //unsubscribe listener
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.user !== undefined &&
      prevState.user.uid === undefined &&
      this.state.user.uid !== undefined
    ) {
      this.checkMessages(); // subcribe listener
    }
  }

  handleRefresh = () => {
    this.setState(
      {
        posts: [],
        refreshing: true,
        initialFecth: true,
        ref: null,
      },
      () => {
        this.setState({ refreshing: false });
        this.props.getPosts(
          this.state.initialFecth,
          null,
          this.state.location.city
        );
      }
    );
  };

  //this is the listener
  checkMessages = () => {
    //aca se debe buscar la forma de que el uid no sea undefinido
    db.collection("conversations")
      .where("memberUids", "array-contains", this.state.user.uid)
      .onSnapshot((querySnapshot) => {
        this.checkNewMessages();
      });
  };

  async handleGetPost() {
    this.setState({ visible: true, initialFecth: false }, () => {
      this.props.getPosts(
        this.state.initialFecth,
        this.props.post.reference,
        this.state.location.city
      );
      setTimeout(() => {
        this.setState({
          visible: false,
        });
      }, 500);
    });
  }

  initialLoadData = () => {
    this.setState(
      {
        initialFecth: true,
        initialFecth: true,
        ref: null,
        refreshing: false,
      },
      () =>
        this.props.getPosts(
          this.state.initialFecth,
          null,
          this.state.location.city
        )
    );
  };

  async setStateLocation() {
    const timeout = new Promise((resolve, reject) => {
      return setTimeout(() => reject(new Error("Location timeout")), 20 * 1000);
    });
    const locationPromise = Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    const locations = await Promise.race([locationPromise, timeout]);
    let location = {
      latitude: locations.coords.latitude,
      longitude: locations.coords.longitude,
    };
    let fullLocation = await Location.reverseGeocodeAsync(location);
    const loc = {
      latitude: locations.coords.latitude,
      longitude: locations.coords.longitude,
      city: fullLocation[0].city,
      country: fullLocation[0].country,
      isoCountryCode: fullLocation[0].isoCountryCode,
      name: fullLocation[0].name,
      postalCode: fullLocation[0].postalCode,
      region: fullLocation[0].region,
      street: fullLocation[0].street,
      latitudeDelta: 0.003,
      longitudeDelta: 0.003,
    };

    if (this.state.location) {
      const { city, region, country } = this.state.location;
      if (
        city === loc.city ||
        region === loc.region ||
        country === loc.country
      ) {
        this.initialLoadData();
        //this.handleGetPost()
      } else {
        this.setState(
          {
            location: loc,
          },
          async () => {
            await updateLocationUser(this.state.user, this.state.location);
            this.initialLoadData();
            this.props.getUser(this.state.user.uid, "LOGIN");
          }
        );
      }
    } else {
      this.setState(
        {
          location: loc,
        },
        async () => {
          await updateLocationUser(this.state.user, this.state.location);
          this.initialLoadData();
          this.props.getUser(this.state.user.uid, "LOGIN");
        }
      );
    }
  }

  async getLocation() {
    const hasEnableLocation = await Location.hasServicesEnabledAsync();
    this.setState({
      hasEnableLocation: hasEnableLocation,
    });
    if (hasEnableLocation) {
      const permission = await Permissions.askAsync(Permissions.LOCATION);
      if (permission.status === "granted") {
        const timeout = new Promise((resolve, reject) => {
          return setTimeout(
            () => reject(new Error("Location timeout")),
            20 * 1000
          );
        });
        const locationPromise = Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        const locations = await Promise.race([locationPromise, timeout]);
        const location = {
          latitude: locations.coords.latitude,
          longitude: locations.coords.longitude,
        };
        let fullLocation = await Location.reverseGeocodeAsync(location);
        const loc = {
          latitude: locations.coords.latitude,
          longitude: locations.coords.longitude,
          city: fullLocation[0].city,
          country: fullLocation[0].country,
          isoCountryCode: fullLocation[0].isoCountryCode,
          name: fullLocation[0].name,
          postalCode: fullLocation[0].postalCode,
          region: fullLocation[0].region,
          street: fullLocation[0].street,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        };

        if (this.state.location) {
          const { city, region, country } = this.state.location;
          if (
            city === loc.city ||
            region === loc.region ||
            country === loc.country
          ) {
            this.initialLoadData();
            //this.handleGetPost()
          } else {
            this.setState(
              {
                location: loc,
              },
              async () => {
                await updateLocationUser(this.state.user, this.state.location);
                this.initialLoadData();
                this.props.getUser(this.state.user.uid, "LOGIN");
              }
            );
          }
        } else {
          this.setState(
            {
              location: loc,
            },
            async () => {
              await updateLocationUser(this.state.user, this.state.location);
              this.initialLoadData();
              this.props.getUser(this.state.user.uid, "LOGIN");
            }
          );
        }
      }
    }
  }

  getDataUser() {
    firebase.auth().onAuthStateChanged(async (user) => {
      const userData = await getUserById(user.uid);

      if (user && userData) {
        console.log("continue user");
        await this.props.allowNotifications(user.uid);
        console.log("notify");
        this.setState(
          {
            user: userData,
          },
          () => {
            //this.props.getUser(user.uid, "LOGIN");
            this.getLocation();
            this.checkNewMessages();
          }
        );
      } else if (!userData) {
        console.log("again get data");
        this.getDataUser();
      }
    });
  }

  async checkNewMessages() {
    const { navigation } = this.props;
    const n = await hasNewMessages(this.state.user.uid);
    this.setState(
      {
        newMessages: n,
      },
      () => {
        const setParamAction = NavigationActions.setParams({
          params: { newMessages: this.state.newMessages },
          key: "Messages",
        });
        navigation.dispatch(setParamAction);
      }
    );
  }

  follow = (user) => {
    this.props.getUser(user.uid);
    this.props.followUser(user);
  };

  likePost = (post) => {
    const { uid } = this.props.user;
    if (post.likes.includes(uid)) {
      this.props.unlikePost(post);
    } else {
      this.props.likePost(post);
    }
  };

  //This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
  calcCrow = (lat1, lon1, lat2, lon2) => {
    var R = 6371; // km
    var dLat = this.toRad(lat2 - lat1);
    var dLon = this.toRad(lon2 - lon1);
    var lat1 = this.toRad(lat1);
    var lat2 = this.toRad(lat2);

    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  };

  // Converts numeric degrees to radians
  toRad = (Value) => {
    return (Value * Math.PI) / 180;
  };

  goToUser = (user) => {
    this.props.getUser(user.uid);
    this.props.navigation.navigate("Profile", { user });
  };

  openPhoto = (photo) => {
    this.setState({ showModalPhoto: true, modalPhoto: photo });
  };

  closePhoto = () => {
    this.setState({ showModalPhoto: false, modalPhoto: "" });
  };

  async sendPostToConversation(item) {
    const post = {
      id: item.id,
      photo: item.postPhoto,
      date: item.date,
      description: item.postDescription,
    };
    const conversation = await sendPost(
      this.state.user.uid,
      this.state.user.username,
      this.state.user.photo,
      item.uid,
      item.username,
      item.photo,
      post
    );
    this.props.navigation.navigate("Chat", {
      conversation: conversation.getId(),
      who: conversation.getUsername(),
      photo: conversation.getPhoto(),
      otherUser: conversation.getOtherUserUID(),
      user: conversation,
    });
  }

  async sharePost(post) {
    try {
      const result = await Share.share({
        message:
          "Consulta esta petición de TimeChat de " +
          `${post.username}` +
          " : " +
          `${post.id}`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert("Share", error.message);
    }
  }

  filterPosts = () => {
    this.state.skills
      ? this.props.getFilteredPosts(this.state.skills)
      : this.props.getPosts();
  };

  onSignout = () => {
    firebase.auth().signOut();
    this.props.navigation.navigate("Login");
  };

  renderItem(item) {
    const { uid } = this.props.user;
    return (
      // <TouchableOpacity style={styles.post} onPress={() => this.props.navigation.navigate('SinglePost', { item })} >
      <View style={styles.post}>
        <View style={[styles.row, styles.maxWidth, { marginTop: 16 }]}>
          <View style={[styles.column, { alignItems: "center" }]}>
            <TouchableOpacity onPress={() => this.goToUser(item)}>
              <Image
                style={[styles.roundImage, { marginBottom: 8 }]}
                uri={item.photo}
              />
            </TouchableOpacity>
            {/* <TextInput value={distance} /> */}
            <Text style={[styles.gray, { fontSize: 13 }]}>
              {Math.ceil(
                this.calcCrow(
                  Number(
                    this.state.location ? this.state.location.latitude : 0
                  ),
                  Number(
                    this.state.location ? this.state.location.longitude : 0
                  ),
                  Number(item.postLocation.latitude),
                  Number(item.postLocation.longitude)
                )
              )}
              km
            </Text>
          </View>
          <View style={styles.postContent}>
            <View style={styles.row}>
              <Text style={[styles.gray, { fontSize: 14 }]}>
                {item.username}
              </Text>
              <Text style={[styles.gray, { fontSize: 14 }]}>
                {" "}
                · {moment(item.date).fromNow()}
              </Text>
            </View>
            <View style={styles.column}>
              <Text style={[styles.postDescription]}>
                {item.postDescription}
              </Text>
              {item.postPhoto !== " " ? (
                <TouchableOpacity
                  onPress={() => this.openPhoto(item.postPhoto)}
                >
                  <Image style={styles.postPhotoInside} uri={item.postPhoto} />
                </TouchableOpacity>
              ) : null}
              <Text style={[styles.gray, styles.skillsTitle]}>
                {"Habilidad requerida"}
              </Text>
              {item.postSkills ? (
                <AppBadge
                  bgColor="#D8D8D8"
                  fontColor="#1C1C1C"
                  title={item.postSkills}
                />
              ) : null}
            </View>
          </View>
        </View>
        <View
          style={[styles.row, styles.space, { marginLeft: 62, marginTop: 16 }]}
        >
          <View style={styles.row}>
            {/*<TouchableOpacity onPress={() => this.sharePost(item)}>
              <Feather style={[{ margin: 5 }, styles.darkGray]} name='share' size={25} />
            </TouchableOpacity>*/}
            {item.uid != uid ? (
              item.offer && item.offer.includes(uid) ? (
                <TouchableOpacity
                  disabled
                  style={{ flexDirection: "row", alignItems: "center" }}
                  onPress={() => this.sendPostToConversation(item)}
                >
                  <SimpleLineIcons
                    style={{ margin: 8, color: "#D3D3D3" }}
                    name="bubbles"
                    size={25}
                  />
                  <Text style={{ color: "#D3D3D3" }}>
                    Ya has ofrecido ayuda
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{ flexDirection: "row", alignItems: "center" }}
                  onPress={() => this.sendPostToConversation(item)}
                >
                  <SimpleLineIcons
                    style={[{ margin: 8 }, styles.darkGray]}
                    name="bubbles"
                    size={25}
                  />
                  <Text>Ofrecer ayuda</Text>
                </TouchableOpacity>
              )
            ) : null}
          </View>
        </View>

        <View style={[styles.column, styles.maxWidth, {}]}>
          {item.comments[0] ? (
            <TouchableOpacity
              style={[
                styles.row,
                { marginTop: 16, marginLeft: 67, marginRight: 12 },
              ]}
              onPress={() => this.props.navigation.navigate("Comment", item)}
            >
              <Text style={{ fontSize: 13, lineHeight: 18 }}>
                {item.comments[0].comment} ·{" "}
                <Text style={[styles.gray, { fontSize: 13 }]}>
                  {item.comments[0].commenterName}
                </Text>
              </Text>
            </TouchableOpacity>
          ) : null}
          {item.comments[1] ? (
            <TouchableOpacity
              style={[
                styles.row,
                { marginTop: 6, marginLeft: 67, marginRight: 12 },
              ]}
              onPress={() => this.props.navigation.navigate("Comment", item)}
            >
              <Text style={{ fontSize: 13, lineHeight: 18 }}>
                {item.comments[1].comment} ·{" "}
                <Text style={[styles.gray, { fontSize: 13 }]}>
                  {item.comments[1].commenterName}
                </Text>
              </Text>
            </TouchableOpacity>
          ) : null}
          {item.comments[2] ? (
            <TouchableOpacity
              style={[{ marginTop: 12, marginLeft: 67 }]}
              onPress={() => this.props.navigation.navigate("Comment", item)}
            >
              <Text style={[styles.gray, { fontSize: 13, lineHeight: 18 }]}>
                Ver todos los mensajes
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }

  renderPreloading = () => {
    return this.state.visible ? (
      <LoadingIndicator size="large" color="#00CBA8" />
    ) : null;
  };

  openSettings() {
    IntentLauncher.startActivityAsync(
      IntentLauncher.ACTION_LOCATION_SOURCE_SETTINGS
    );
  }

  renderHasNotLocation = () => (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <MaterialIcons
        name="gps-off"
        size={80}
        style={{ opacity: 0.2, color: "#00CBA8" }}
      />
      <Text style={{ marginTop: 25, marginBottom: 25 }}>
        Es necesario que actives tu GPS
      </Text>
      <TouchableOpacity
        style={[styles.buttonBigPremium]}
        onPress={() => this.getLocation()}
      >
        <Text style={styles.secondaryButton}>Actualizar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.buttonBigPremium]}
        onPress={() => this.openSettings()}
      >
        <Text style={styles.secondaryButton}>Activar GPS</Text>
      </TouchableOpacity>
    </View>
  );

  renderWithoutPosts = () => (
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

  render() {
    if (!this.state.hasEnableLocation) {
      return this.renderHasNotLocation();
    } else if (this.props.post !== null && this.props.post.feed.length === 0) {
      return this.renderWithoutPosts();
    } else if (this.props.post === null)
      return <LoadingIndicator size="large" color="#00CBA8" />;
    return (
      <View style={[styles.container, styles.bgLightGray]}>
        {this.state.modalPhoto !== "" ? (
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
        ) : null}
        {this.state.user !== null && this.state.user !== undefined ? (
          <FlatList
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
            data={this.props.post.feed}
            keyExtractor={(item) => item.key}
            //ListFooterComponent={this.renderPreloading}
            onEndReached={() => this.handleGetPost()}
            onEndReachedThreshold={0.8}
            renderItem={({ item }) => this.renderItem(item)}
          />
        ) : (
          <LoadingIndicator size="large" color="#00CBA8" />
        )}
      </View>
    );
  }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
