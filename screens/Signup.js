import React from 'react';
import styles from '../styles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Image } from 'react-native-expo-image-cache'
import { updateUserPhoto, updateEmail, updatePassword, updateUsername, updateBio, signup, updateUser } from '../actions/user'
import { uploadPhoto } from '../actions'

class Signup extends React.Component {

  onPress = () => {
    const { routeName } = this.props.navigation.state
    if (routeName === 'Signup') {
      this.props.signup()
      this.props.navigation.navigate('Home')
    } else {
      this.props.updateUser()
      this.props.navigation.goBack()
    }
  }

  openLibrary = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
    if (status === 'granted') {
      const image = await ImagePicker.launchImageLibraryAsync()
      if (!image.cancelled) {
        const url = await this.props.uploadPhoto(image)
        this.props.updateUserPhoto(url)
      }
    }
  }

  render() {
    const { routeName } = this.props.navigation.state
    return (
      <View style={[styles.container, styles.center]}>
        <TouchableOpacity style={styles.center} onPress={this.openLibrary} >
          <Image style={styles.roundBigImage} uri={this.props.user.photo} />
          <Text>Subir Foto</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.border}
          value={this.props.user.bio}
          onChangeText={input => this.props.updateBio(input)}
          placeholder='Bio'
          maxLength={240}
        />
        <TouchableOpacity style={styles.button} onPress={this.onPress}>
          <Text>Guardar</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ updateUserPhoto, uploadPhoto, updateUser, updateEmail, updatePassword, updateUsername, updateBio, signup }, dispatch)
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup)