import React from "react";
import PropTypes from "prop-types";
import { Image } from "react-native-expo-image-cache";
import {
  Modal,
  SafeAreaView,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  postPhoto: {
    height: width,
    width: width,
  },
});

const ModalPhoto = (props) => {
  return (
    <Modal animationType="slide" transparent={false} visible={props.show}>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={{ paddingLeft: 24 }} onPress={props.onClose}>
          <AntDesign color={"#fff"} name={"close"} size={32} />
        </TouchableOpacity>
        <View
          style={[
            styles.container,
            { justifyContent: "center", alignContent: "center" },
          ]}
        >
          <Image style={styles.postPhoto} uri={props.image} />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

ModalPhoto.propTypes = {
  show: PropTypes.bool.isRequired,
  image: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ModalPhoto;
