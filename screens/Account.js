import React from 'react'
import styles from '../styles'
import firebase from 'firebase'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { followUser, unfollowUser, getUser } from '../actions/user'
import { initialiseConversation } from '../actions/chats'

import { Feather, AntDesign } from '@expo/vector-icons'
import { Text, View, TouchableOpacity, Modal, ActivityIndicator, SafeAreaView, Linking } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Image } from 'react-native-expo-image-cache'
import 'moment/locale/es'
import { logInWithReadPermissionsAsync } from 'expo-facebook'

class Profile extends React.Component {
  state = {
    showModalPhoto: false,
    modalPhoto: '',
  }

  follow = (user) => {
    if (user.followers.indexOf(this.props.user.uid) >= 0) {
      this.props.unfollowUser(user)
    } else {
      this.props.followUser(user)
    }
  }

  goToMap = (user) => {
    this.props.navigation.navigate('Map', { user })
  }

  goToUser = (user) => {
    this.props.getUser(user.uid)
    this.props.navigation.navigate('Profile', { user })
  }

  onSignout = () => {
    firebase.auth().signOut()
    this.props.navigation.navigate('Login')
  }

  openPhoto = (photo) => {
    this.setState({ showModalPhoto: true, modalPhoto: photo })
  }

  closePhoto = () => {
    this.setState({ showModalPhoto: false, modalPhoto: '' })
  }

  render() {
    const user = this.props.user
    
    // if (!user.posts) return <ActivityIndicator style={styles.container} />
    return (
      <View style={styles.container}>
        <View style={[styles.center, { marginTop: 20 }]}>
          <TouchableOpacity onPress={() => this.goToUser(user)}>
            <Image style={styles.roundBigImage} uri={user.photo} />
          </TouchableOpacity>
        </View>

        <View style={[styles.center, { marginTop: 10, paddingBottom: 25 }]}>
          <View style={styles.column}>
            <TouchableOpacity style={styles.buttonBig} onPress={() => this.props.navigation.navigate('Edit')}>
              <Text style={styles.bold}>Editar Perfil</Text>
            </TouchableOpacity>
            {
              user.location ?
                <TouchableOpacity style={styles.buttonBig} onPress={() => this.goToMap(user)}>
                  <Text style={styles.bold}>Cambiar localización</Text>
                </TouchableOpacity>
                : null
            }
            <TouchableOpacity style={styles.buttonBig} onPress={() => this.onSignout()}>
              <Text style={styles.bold}>Cerrar sesión</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttonBigPremium]} onPress={() => Linking.openURL('https://patreon.com/timelend')} >
              <Text style={styles.secondaryButton}>Compartir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ followUser, unfollowUser, getUser, initialiseConversation }, dispatch)
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    profile: state.profile
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)