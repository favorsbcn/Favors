import React, {Component} from 'react';

import styles from "../styles";
import pendingStyle from "../assets/css/pendingStyle";
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import { Image } from 'react-native-expo-image-cache'
import { acceptConversation } from "../querysFirebase/querysChat";
import { getUserById } from '../querysFirebase/querysUser';

class PendingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photo: this.props.navigation.getParam('photo'),
      username: this.props.navigation.getParam('username'),
      userUID: this.props.navigation.getParam('userUID'),
      conversation: this.props.navigation.getParam('conversation'),
      disabledBtn: false
    }
  }

  goToChat =  () => {
    this.setState({
      disabledBtn: true
    }, async () => {
      await acceptConversation(this.state.conversation._data.id, this.state.conversation._myUid)
      this.props.navigation.navigate('Chat', {
        conversation: this.state.conversation.getId(),
        who: this.state.conversation.getUsername(),
        photo: this.state.conversation.getPhoto(),
        user: this.state.conversation,
        rName: 'pending'
      })
    })    
  }

  goToProfile = async() => {
    const u = await getUserById(this.state.userUID)
    this.props.navigation.navigate('Profile', { user: u })
  }

  render() {
    return (
      <View style={pendingStyle.container}>
        <View style={pendingStyle.roundContentImageLarge}>
          <Image 
            style={pendingStyle.roundImageLarge}
            uri={this.state.photo}
          />
        </View>
        <TouchableOpacity style={[styles.buttonBigPremium]} onPress={() => this.goToProfile()} >
          <Text style={styles.secondaryButton}>Ver perfil</Text>
        </TouchableOpacity>
        {
          this.state.conversation._data.acceptConversation.indexOf(this.state.conversation._myUid) > -1 ? (
            <Text style={pendingStyle.textLarge}>
              {this.state.username} aun no ha aceptado la conversación
            </Text>
          ) : (
            <>
              <Text style={pendingStyle.textLarge}>
                {this.state.username} quiere iniciar una conversación contigo
              </Text>
              <TouchableOpacity 
                disabled={this.state.disabledBtn} 
                style={this.state.disabledBtn ? styles.buttonBig : styles.buttonBigPremium} 
                onPress={() => this.goToChat()} 
              >
                <Text style={this.state.disabledBtn ? styles.bold : styles.secondaryButton}>Aceptar conversación</Text>
              </TouchableOpacity>
            </>
          )
        }
        

      </View>
      
    );
  }
}
 
export default PendingScreen;