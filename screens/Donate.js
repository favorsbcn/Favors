import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Image } from "react-native-expo-image-cache";
import styles from "../styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import TimePicker from "react-native-simple-time-picker";
import SwipePicker from "react-native-swipe-picker";
import { Ionicons } from "@expo/vector-icons";

import { getUserById } from "../actions/user";
import { getUser } from "../actions/user";

import { addTransaction } from "../querysFirebase/querysUser";
import { sendTime, snedRequestTime } from "../querysFirebase/querysMessages";

import Button from "../components/Button";
import ButtonSecondary from "../components/ButtonSecondary";

import { listHours, listMinutes } from "../data/data";

class DonateSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      donation: "",
      selectedHours: 0,
      //initial Hours
      selectedMinutes: 0,
      //initial Minutes
      receiverUser: {},
      senderUser: props.user,
      disabledBtnPay: false,
    };
  }

  goToProfile = (user) => {
    this.props.getUser(user.uid);
    this.props.navigation.navigate("Profile", { user });
  };

  async getUserReceiver() {
    const conversation = this.props.navigation.state.params.user._data
      ? this.props.navigation.state.params.user._data
      : this.props.navigation.state.params.user;
    let uid = null;
    if (conversation.memberDetails) {
      conversation.memberDetails.map((item) => {
        if (item.uid !== this.state.senderUser.uid) {
          uid = item.uid;
        }
      });
      if (uid !== null) {
        receiverUser = await getUserById(uid);
        this.setState({ receiverUser });
      }
    } else {
      this.setState({
        receiverUser: conversation,
      });
    }
  }

  componentDidMount() {
    this.getUserReceiver();
  }

  donationRequest = async () => {
    const { receiverUser, senderUser } = this.state;
    let donationTime =
      this.state.selectedHours * 60 + this.state.selectedMinutes;
    if (donationTime > 0) {
      const conversation = await snedRequestTime(
        this.props.user.uid,
        this.props.user.username,
        this.props.user.photo,
        receiverUser.uid,
        receiverUser.username,
        receiverUser.photo,
        donationTime
      );
      this.props.navigation.navigate("Chat", {
        conversation: conversation.getId(),
        who: conversation.getUsername(),
        photo: conversation.getPhoto(),
        otherUser: conversation.getOtherUserUID(),
        user: conversation,
      });
    } else {
      Alert.alert("Debes seleccionar un precio a pedir");
    }
  };

  sendDonation = async () => {
    const { receiverUser, senderUser } = this.state;
    let donationTime =
      this.state.selectedHours * 60 + this.state.selectedMinutes;
    let senderTime = senderUser.timeCoins;
    let receiverTime = receiverUser.timeCoins;
    if (donationTime > 0) {
      if (donationTime < senderTime) {
        await addTransaction(
          receiverUser,
          senderUser,
          donationTime,
          receiverTime,
          senderTime
        );
        const conversation = await sendTime(
          this.props.user.uid,
          this.props.user.username,
          this.props.user.photo,
          receiverUser.uid,
          receiverUser.username,
          receiverUser.photo,
          donationTime
        );
        this.props.navigation.navigate("Chat", {
          conversation: conversation.getId(),
          who: conversation.getUsername(),
          photo: conversation.getPhoto(),
          otherUser: conversation.getOtherUserUID(),
          user: conversation,
        });
      } else {
        Alert.alert("No tienes suficientes tiempo");
      }
    } else {
      Alert.alert("Debes seleccionar un precio a pagar");
    }
  };

  goToUser = (user) => {
    this.props.navigation.navigate("Home");
  };

  render() {
    const { selectedHours, selectedMinutes } = this.state;

    return (
      <View style={[styles.container, styles.center, styles.spaceAround]}>
        <View style={[styles.row]}>
          <View style={[styles.center, { flex: 3 }]}>
            <TouchableOpacity
              onPress={() => this.goToProfile(this.state.senderUser)}
            >
              <Image
                style={styles.roundImage}
                uri={this.state.senderUser.photo}
              />
            </TouchableOpacity>
            <Text style={[styles.bold, { marginTop: 6 }]}>
              {this.state.senderUser.username}
            </Text>
          </View>
          <View
            style={[styles.row, styles.center, { flex: 1, marginBottom: 24 }]}
          >
            <Ionicons
              style={[{ margin: 3 }, styles.gray]}
              name="ios-arrow-forward"
              size={25}
            />
            <Ionicons
              style={[{ margin: 3 }, styles.gray]}
              name="ios-arrow-forward"
              size={25}
            />
            <Ionicons
              style={[{ margin: 3 }, styles.gray]}
              name="ios-arrow-forward"
              size={25}
            />
          </View>
          <View style={[styles.center, { flex: 3 }]}>
            <TouchableOpacity
              onPress={() => this.goToProfile(this.state.receiverUser)}
            >
              <Image
                style={styles.roundImage}
                uri={this.state.receiverUser.photo}
              />
            </TouchableOpacity>
            <Text style={[styles.bold, { marginTop: 6 }]}>
              {this.state.receiverUser.username}
            </Text>
          </View>
        </View>

        <View
          style={{
            backgroundColor: "#fff",
            width: "100%",
            marginLeft: 30,
            marginRight: 30,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* <View style={[styles.center, { marginBottom: 12 }]}>
            <Text
              style={[styles.sliderLabels, { fontSize: 72, fontWeight: "200" }]}
            >
              {selectedHours}h {selectedMinutes}min
            </Text>
          </View>
            <TimePicker
              selectedHours={selectedHours}
              //initial Hourse value
              selectedMinutes={selectedMinutes}
              //initial Minutes value
              onChange={(hours, minutes) =>
                this.setState({
                  selectedHours: hours,
                  selectedMinutes: minutes,
                })
              }
              hoursUnit=" horas"
              minutesUnit=" min"
            />*/}

          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-around",
            }}
          >
            <SwipePicker
              items={listHours}
              onChange={({ index, item }) => {
                this.setState({
                  selectedHours: item.value,
                });
              }}
            />
            <SwipePicker
              items={listMinutes}
              onChange={({ index, item }) => {
                this.setState({
                  selectedMinutes: item.value,
                });
              }}
            />
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignSelf: "stretch",
            justifyContent: "space-around",
          }}
        >
          <View
            style={{ alignContent: "stretch", flex: 1, marginHorizontal: 10 }}
          >
            <Button onPress={this.donationRequest} text="Pedir" />
          </View>
          <View
            style={{ alignContent: "stretch", flex: 1, marginHorizontal: 10 }}
          >
            <ButtonSecondary
              stylesBtn={{
                borderRadius: 10,
                paddingVertical: 12,
                marginTop: 0,
              }}
              stylesText={{
                fontSize: 18,
              }}
              onPress={this.sendDonation}
              text="Enviar"
            />
          </View>
        </View>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ getUser }, dispatch);
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    profile: state.profile,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DonateSlider);
