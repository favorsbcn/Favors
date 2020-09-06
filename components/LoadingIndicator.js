import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const LoadingIndicator = ({ size, color }) => {
  return <ActivityIndicator size={size} color={color} />;
};

export default LoadingIndicator;
