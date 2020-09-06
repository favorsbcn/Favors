import React from "react";
import PropTypes from "prop-types";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  buttonStyle: {
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    borderWidth: 0.5,
    borderRadius: 10,
    alignSelf: "stretch",
  },
  text: {
    color: "#151515",
    fontSize: 18,
    fontWeight: "500",
  },
});

const ButtonCustom = (props) => {
  return (
    <TouchableOpacity
      style={[
        styles.buttonStyle,
        {
          backgroundColor: props.bgColor ? props.bgColor : "white",
          borderColor: props.bgColor ? props.bgColor : "#ccc",
        },
      ]}
      onPress={props.onPress}
    >
      <Text
        style={[
          styles.text,
          {
            color: props.textColor ? props.textColor : "black",
          },
        ]}
      >
        {props.text}
      </Text>
    </TouchableOpacity>
  );
};

ButtonCustom.propTypes = {
  onPress: PropTypes.func.isRequired,
  text: PropTypes.string,
  bgColor: PropTypes.string,
  textColor: PropTypes.string,
};

export default ButtonCustom;
