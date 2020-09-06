import React from 'react';
import styles from '../styles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Feather } from '@expo/vector-icons'
import { Text, View, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { Image } from 'react-native-expo-image-cache'
import { getUser } from '../actions/user'
import AppBadge from '../components/AppBadge'
import moment from 'moment'
import 'moment/locale/es'

class Comment extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      item: props.post.post
    }
  }

  goToUser = (user) => {
    this.props.getUser(user.uid)
    this.props.navigation.navigate('Profile', { user })
  }

  componentWillReceiveProps(nextProps) {
    if( this.state.item !== nextProps.post.post ){
      this.setState({
        item: nextProps.post.post
      })
    }
  }

  render() {
    const { item } = this.state
    return (
      item ? (
      <SafeAreaView>
        <View style={styles.post}>
          <View style={[styles.row, styles.maxWidth, { marginTop: 16 }]}>
            <View style={[styles.column, { alignItems: 'center' }]}>
              <TouchableOpacity onPress={() => this.goToUser(item)}>
                <Image style={[styles.roundImage, { marginBottom: 8 }]} uri={item.photo} />
              </TouchableOpacity>
            </View>
            <View style={styles.postContent}>
              <View style={styles.row}>
                <Text style={[styles.gray, { fontSize: 14 }]}>{item.username}</Text>
                <Text style={[styles.gray, { fontSize: 14 }]}> · {moment(item.date).fromNow()}</Text>
              </View>
              <View style={styles.column}>
                <Text style={[styles.postDescription]}>{item.postDescription}</Text>
                {
                  item.postPhoto !== ' ' ?
                    <TouchableOpacity onPress={() => this.openPhoto(item.postPhoto)}>
                      <Image style={styles.postPhotoInside} uri={item.postPhoto} />
                    </TouchableOpacity>
                    : null
                }
                <Text style={[styles.gray, styles.skillsTitle]}>{'Habilidad requerida'}</Text>
                {
                  item.postSkills ?
                    <AppBadge
                      bgColor="#D8D8D8"
                      fontColor="#1C1C1C"
                      title={item.postSkills}
                    />
                    : null
                }
              </View>
            </View>
          </View>
          <View style={[styles.row, { marginLeft: 62, marginTop: 16 }]}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Comment', item)} >
              <View style={styles.row}>
                <Feather style={[{ margin: 5 }, styles.darkGray]} name='message-circle' size={25} />
                {/* <Text style={{ fontSize: 13 }}>{item.comments.length}</Text> */}
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.sharePost}>
              <Feather style={[{ margin: 5 }, styles.darkGray]} name='share' size={25} />
            </TouchableOpacity>
          </View>
          <FlatList
            inverted
            keyExtractor={(item) => JSON.stringify(item.date)}
            data={item.comments}
            renderItem={({ item }) => (
            <View style={[styles.row, styles.maxWidth, {
              marginBottom: 18, paddingBottom: 12, borderBottomColor: '#E6E6E6',
              borderBottomWidth: 0.5, borderTopColor: '#E6E6E6',
            }]}>
              <TouchableOpacity onPress={() => this.goToUser(item)}>
                <Image style={styles.roundImage} uri={item.commenterPhoto} />
              </TouchableOpacity>
              <View style={[styles.postContent, { marginLeft: 0 }]}>
                <Text style={[styles.gray, { fontSize: 14, marginBottom: 3 }]}>{item.commenterName} </Text>
                <Text style={[styles.bold, { fontSize: 15, marginBottom: 15 }]}>{item.comment}</Text>
                <Text style={[styles.gray, { fontSize: 14 }]}>{moment(item.date).fromNow()}</Text>
              </View>
            </View>
          )} />
        </View>
      </SafeAreaView>
      ):(
        null
      )
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ getUser }, dispatch)
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    post: state.post
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Comment)