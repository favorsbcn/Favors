import React, { Component } from 'react';
import { Text } from 'react-native';

class AppBadge extends Component {
  render() {
    const { title, bgColor, fontColor } = this.props;
    return (
      <Text
        style={{
          padding: 8,
          borderRadius: 10,
          fontSize: 14,
          color: fontColor,
          backgroundColor: bgColor,
          alignSelf: 'flex-start',
          fontWeight: '500',
          borderWidth: 1,
          borderColor: bgColor,
          overflow: 'hidden',
        }}
      >{title}</Text>
    );
  }
}

export default AppBadge;