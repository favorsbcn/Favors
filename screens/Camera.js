import React, { Component } from 'react'
import styles from '../styles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { uploadPhoto } from '../actions/index'
import { updatePostPhoto } from '../actions/post'
import { Camera } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Permissions from 'expo-permissions';
import { Ionicons } from '@expo/vector-icons'
import { Text, View, SafeAreaView, TouchableOpacity } from 'react-native'

class CameraUpload extends Component {

  snapPhoto = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA)
    if (status === 'granted') {
      const image = await this.camera.takePictureAsync()
      if (!image.cancelled) {
        const resize = await ImageManipulator.manipulateAsync(image.uri, [{ width: 650, height: 650 }], { format: 'jpg', compress: 0.4 })
        const url = await this.props.dispatch(uploadPhoto(resize))
        this.props.dispatch(updatePostPhoto(url))
        url ? this.props.navigation.navigate('Post') : null
      }
    }
  }

  render() {
    return (
      <Camera style={{ flex: 1 }} ref={ref => { this.camera = ref }} type={Camera.Constants.Type.back}>
        <SafeAreaView style={{ flex: 1 }}>
          <TouchableOpacity style={{ paddingLeft: 24 }} onPress={() => this.props.navigation.goBack()} >
            <Ionicons color={'white'} name={'ios-arrow-back'} size={40} />
          </TouchableOpacity>
        </SafeAreaView>
        <TouchableOpacity style={styles.cameraButton} onPress={() => this.snapPhoto()} />
      </Camera>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ uploadPhoto, updatePostPhoto }, dispatch)
}

const mapStateToProps = (state) => {
  return {}
}

export default connect(mapStateToProps)(CameraUpload)