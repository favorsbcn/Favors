import React from "react";
import { View, ScrollView, Text, Dimensions, Animated } from "react-native";
import styles from "../styles";

const Slides = (props) => {
  const { width } = Dimensions.get("window");
  let scrollX = new Animated.Value(0);
  let position = Animated.divide(scrollX, width);

  const renderSlides = () => {
    return props.data.map((slide, index) => {
      return (
        <View key={slide.text} style={[styles.slideStyle, styles.center]}>
          {slide.title ? (
            <Text style={[styles.titleStyle, { fontWeight: "500" }]}>
              {slide.title}
            </Text>
          ) : null}
          {slide.text ? (
            <Text style={[styles.textStyle, { fontWeight: "500" }]}>
              {slide.text}
            </Text>
          ) : null}
        </View>
      );
    });
  };

  const renderDots = (array) => (
    <View style={{ flexDirection: "row" }}>
      {array.map((_, i) => {
        let opacity = position.interpolate({
          inputRange: [i - 1, i, i + 1],
          outputRange: [0.3, 1, 0.3],
          extrapolate: "clamp",
        });
        return (
          <Animated.View
            key={i}
            style={{
              opacity,
              height: 8,
              width: 8,
              backgroundColor: "#595959",
              margin: 4,
              borderRadius: 5,
            }}
          />
        );
      })}
    </View>
  );

  return (
    <>
      <ScrollView
        horizontal
        style={{ flex: 1 }}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([
          { nativeEvent: { contentOffset: { x: scrollX } } },
        ])}
        scrollEventThrottle={16}
      >
        {renderSlides()}
      </ScrollView>
      {renderDots(props.data)}
    </>
  );
};

export default Slides;
