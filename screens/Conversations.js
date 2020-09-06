import React from "react";
import styles from "../styles";
import conversationStyles from "../assets/css/conversationStyles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Image } from "react-native-expo-image-cache";
import "moment/locale/es";
import { getConversations } from "../actions/chats";
import {
  getListConversations,
  conversationsPending,
} from "../querysFirebase/querysChat";
import { FontAwesome } from "@expo/vector-icons";
import LoadingIndicator from "../components/LoadingIndicator";

class Conversations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      conversations: [],
      conversationsPending: [],
      reload: null,
      preload: true,
    };
    this.timer = null;
  }

  componentDidMount = () => {
    this.props.navigation.addListener("willFocus", () => {
      this.setState(
        {
          conversations: [],
          conversationsPending: [],
        },
        () => {
          this.handleRequestConversation();
          this.handleRequestPendig();
          this.setState({
            preload: false,
          });
        }
      );
    });
    this.doReload();
  };

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  doReload() {
    this.timer = setInterval(() => {
      this.handleRequestConversation();
      this.handleRequestPendig();
    }, 60000);
  }

  async handleRequestConversation() {
    const c = await getListConversations(this.props.user.uid);
    this.setState({
      conversations: c,
    });
  }

  async handleRequestPendig() {
    const c = await conversationsPending(this.props.user.uid);
    this.setState({
      conversationsPending: c,
    });
  }

  goToChat = (item) => {
    this.props.navigation.navigate("Chat", {
      conversation: item.getId(),
      who: item.getUsername(),
      photo: item.getPhoto(),
      otherUser: item.getOtherUserUID(),
      user: item,
    });
  };

  goToPending = (item) => {
    this.props.navigation.navigate("PendingChat", {
      photo: item.getPhoto(),
      username: item.getUsername(),
      userUID: item.getOtherUserUID(),
      conversation: item,
    });
  };

  renderHeaderConversations = (text) => {
    return (
      <View style={conversationStyles.headerConversation}>
        <Text style={conversationStyles.headerTextConversation}>{text}</Text>
      </View>
    );
  };

  renderPending = (item) => {
    return (
      <TouchableOpacity onPress={() => this.goToPending(item)}>
        <Image
          style={conversationStyles.roundImageMedium}
          uri={item.getPhoto()}
        />
        <Text style={{ color: "black", textAlign: "center" }}>
          {item.getUsername().split(" ")[0]}
        </Text>
      </TouchableOpacity>
    );
  };

  renderConversations = (item) => {
    return (
      <TouchableOpacity
        onPress={() =>
          item._data.countAccept === 1
            ? this.goToPending(item)
            : this.goToChat(item)
        }
        style={[styles.row, styles.space, { marginVertical: 6 }]}
      >
        <Image style={styles.roundImage} uri={item.getPhoto()} />
        <View style={[styles.container, styles.left]}>
          <Text style={styles.bold}>{item.getUsername()}</Text>
          <View style={[styles.row, styles.space, styles.conversationWidth]}>
            <Text
              numberOfLines={1}
              style={[styles.darkGray, { marginVertical: 3, marginRight: 12 }]}
            >
              {item.lastMessage().length < 70
                ? `${item.lastMessage()}`
                : `${item.lastMessage().substring(0, 68)}...`}
            </Text>
            {item._newMgs ? (
              <FontAwesome
                name="circle"
                size={15}
                style={[styles.right, { color: "green" }]}
              />
            ) : null}
          </View>
          <Text style={[styles.gray, { fontSize: 13 }]}>
            {item.lastMessageDate()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { conversations, conversationsPending } = this.state;
    if (!conversations) return <ActivityIndicator style={styles.container} />;
    return (
      <View style={[styles.container]}>
        {this.state.preload ? (
          <LoadingIndicator size="large" color="#00CBA8" />
        ) : (
          <>
            {conversationsPending.length === 0 ? null : (
              <View style={{ height: 130 }}>
                <View style={conversationStyles.headerConversation}>
                  <Text style={conversationStyles.headerTextConversation}>
                    Pendientes
                  </Text>
                </View>
                <FlatList
                  horizontal={true}
                  data={conversationsPending}
                  keyExtractor={(item) => item.getId()}
                  renderItem={({ item }) => this.renderPending(item)}
                />
              </View>
            )}
            <FlatList
              keyExtractor={(item) => item.getId()}
              data={conversations}
              ListHeaderComponent={this.renderHeaderConversations(
                "Conversaciones"
              )}
              renderItem={({ item }) => this.renderConversations(item)}
            />
          </>
        )}
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ getConversations }, dispatch);
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    conversations: state.conversations,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Conversations);
