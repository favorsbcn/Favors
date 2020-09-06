import React from "react";
import { Ionicons } from "@expo/vector-icons";
import Login from "../screens/Login";
import Signup from "../screens/Signup";
import { createStackNavigator, createAppContainer } from "react-navigation";
import { TouchableOpacity } from "react-native";

const StackNavigator = createStackNavigator({
  Login: {
    screen: Login,
    navigationOptions: {
      header: null,
    },
  },
  Signup: {
    screen: Signup,
    navigationOptions: ({ navigation }) => ({
      title: "Signup",
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            style={[styles.icon, { marginLeft: 12 }]}
            name={"ios-arrow-back"}
            size={30}
          />
        </TouchableOpacity>
      ),
    }),
  },
});

export default createAppContainer(StackNavigator);
