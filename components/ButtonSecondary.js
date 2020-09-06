import React from "react";
import PropTypes from "prop-types";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  buttonStyle: {
    padding: 10,
    alignItems: "center",
    borderColor: "#d3d3d3",
    borderWidth: 1,
    borderRadius: 20,
    alignSelf: "stretch",
    backgroundColor: "#00CBA8",
  },
  text: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "500",
  },
});

const ButtonSecondaryCustom = (props) => {
  return (
    <TouchableOpacity
      style={[styles.buttonStyle, props.stylesBtn ? props.stylesBtn : {}]}
      onPress={props.onPress}
    >
      <Text style={[styles.text, props.stylesText ? props.stylesText : {}]}>
        {props.text}
      </Text>
    </TouchableOpacity>
  );
};

ButtonSecondaryCustom.propTypes = {
  onPress: PropTypes.func.isRequired,
  text: PropTypes.string,
  stylesBtn: PropTypes.object,
  stylesText: PropTypes.object,
};

export default ButtonSecondaryCustom;
