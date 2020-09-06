import React from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { Image } from "react-native-expo-image-cache";
import {
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";

import { calcCrow } from "../utils";

import AppBadge from "../components/AppBadge";

import stylesGeneral from "../styles";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomColor: "#E6E6E6",
    borderBottomWidth: 0.5,
    borderTopColor: "#E6E6E6",
  },
  post: {
    flexDirection: "row",
    alignSelf: "stretch",
    marginTop: 16,
  },
  postProfile: {
    flexDirection: "column",
    alignItems: "center",
  },
  postContent: {
    alignSelf: "stretch",
    width: width - 85,
  },
  postFooter: {},
  photoProfile: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginHorizontal: 12,
    backgroundColor: "#adadad",
  },
  postPhoto: {
    borderRadius: 12,
    marginTop: 12,
    height: ((width - 85) / 16) * 9,
    width: width - 85,
  },
  textSecondary: {
    color: "#9B9B9B",
  },
  textPrimary: {
    fontWeight: "600",
    fontSize: 17,
    lineHeight: 24,
    marginTop: 4,
  },
});

const Post = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.post}>
        <View style={styles.postProfile}>
          <TouchableOpacity onPress={() => props.goToUser(props.post)}>
            <Image style={styles.photoProfile} uri={props.post.photo} />
          </TouchableOpacity>
          <Text style={[styles.textSecondary, { fontSize: 13 }]}>
            {Math.ceil(
              calcCrow(
                Number(props.user.location ? props.user.location.latitude : 0),
                Number(props.user.location ? props.user.location.longitude : 0),
                Number(props.post.postLocation.latitude),
                Number(props.post.postLocation.longitude)
              )
            )}
            km
          </Text>
        </View>
        <View style={styles.postContent}>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.textSecondary, { fontSize: 14 }]}>
              {props.post.username}
            </Text>
            <Text style={[styles.textSecondary, { fontSize: 14 }]}>
              {" "}
              · {moment(props.post.date).fromNow()}
            </Text>
          </View>
          <View style={{ flexDirection: "column" }}>
            <Text style={[styles.textPrimary]}>
              {props.post.postDescription}
            </Text>
            {props.post.postPhoto !== " " ? (
              <TouchableOpacity
                onPress={() => props.openPhoto(props.post.postPhoto)}
              >
                <Image style={styles.postPhoto} uri={props.post.postPhoto} />
              </TouchableOpacity>
            ) : null}
            <Text style={[styles.textSecondary, stylesGeneral.skillsTitle]}>
              {"Habilidad requerida"}
            </Text>
            {props.post.postSkills ? (
              <AppBadge
                bgColor="#D8D8D8"
                fontColor="#1C1C1C"
                title={props.post.postSkills}
              />
            ) : null}
          </View>
        </View>
      </View>
      <View
        style={[styles.row, styles.space, { marginLeft: 62, marginTop: 16 }]}
      >
        <View style={styles.row}>
          {props.post.uid != props.user.uid ? (
            props.post.offer && props.post.offer.includes(props.user.uid) ? (
              <TouchableOpacity
                disabled
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={() => this.sendPostToConversation(props.post)}
              >
                <SimpleLineIcons
                  style={{ margin: 8, color: "#D3D3D3" }}
                  name="bubbles"
                  size={25}
                />
                <Text style={{ color: "#D3D3D3" }}>Ya has ofrecido ayuda</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={() => props.onSendPostToConversation(props.post)}
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
        {props.post.comments[0] ? (
          <TouchableOpacity
            style={[
              styles.row,
              { marginTop: 16, marginLeft: 67, marginRight: 12 },
            ]}
            onPress={() =>
              this.props.navigation.navigate("Comment", props.post)
            }
          >
            <Text style={{ fontSize: 13, lineHeight: 18 }}>
              {props.post.comments[0].comment} ·{" "}
              <Text style={[styles.gray, { fontSize: 13 }]}>
                {props.post.comments[0].commenterName}
              </Text>
            </Text>
          </TouchableOpacity>
        ) : null}
        {props.post.comments[1] ? (
          <TouchableOpacity
            style={{
              marginTop: 6,
              marginLeft: 67,
              marginRight: 12,
              flexDirection: "row",
            }}
            onPress={() =>
              this.props.navigation.navigate("Comment", props.post)
            }
          >
            <Text style={{ fontSize: 13, lineHeight: 18 }}>
              {props.post.comments[1].comment} ·{" "}
              <Text style={[styles.textSecondary, { fontSize: 13 }]}>
                {props.post.comments[1].commenterName}
              </Text>
            </Text>
          </TouchableOpacity>
        ) : null}
        {props.post.comments[2] ? (
          <TouchableOpacity
            style={[{ marginTop: 12, marginLeft: 67 }]}
            onPress={() =>
              this.props.navigation.navigate("Comment", props.post)
            }
          >
            <Text
              style={[styles.textSecondary, { fontSize: 13, lineHeight: 18 }]}
            >
              Ver todos los mensajes
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

Post.proTypes = {
  post: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  openPhoto: PropTypes.func.isRequired,
  onSendPostToConversation: PropTypes.func.isRequired,
  goToUser: PropTypes.func.isRequired,
};

export default Post;
