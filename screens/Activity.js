import React from 'react';0
import styles from '../styles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import 'firebase/firestore';
import { Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Image } from 'react-native-expo-image-cache'
import { NavigationActions } from 'react-navigation';
import moment from 'moment'
import 'moment/locale/es'
import AppBadge from '../components/AppBadge'
import { getPost } from '../actions/post';
import { FireSQL } from "firesql";
import firebase from "firebase/app";
import { getUserById } from '../querysFirebase/querysUser'

class Activity extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      activities: [],
      ref: null, 
      user: props.user,
      hours: 0,
      minutes: 0
    }
    this.goToPost = this.goToPost.bind(this)
  }

  componentDidMount = () => {
    const { navigation } = this.props
    navigation.addListener('willFocus', async() => {
      this.setState({
        user: await getUserById(this.props.user.uid),
        ref: null,
        activities: []
      }, () => {
        this.calculateTime()
        this.getActivities()
      })
      
    })
  }

  calculateTime = () => {
    let minutesCoins = this.state.user.timeCoins % 60
    minutesCoins = (minutesCoins < 10 ? '0' : '') + minutesCoins;
    const hoursCoins = (this.state.user.timeCoins - minutesCoins) / 60
    this.setState({
      hours: hoursCoins,
      minutes: minutesCoins
    }, () => {
      const { navigation } = this.props
      navigation.setParams({hours: this.state.hours, minutes: this.state.minutes})      
    })  
  }  

  getActivities = async () => {
    const fireSQL = new FireSQL(firebase.firestore());
    let activitysPromise = null
    if(this.state.ref){
      activitysPromise = fireSQL.query(`
        SELECT * FROM activity 
        WHERE (uid="${this.props.user.uid}" OR senderId="${this.props.user.uid}") 
        AND date<${this.state.ref.date} AND type="TRANSACTION" 
        ORDER BY date DESC LIMIT 25
      `);
    } else {
      activitysPromise = fireSQL.query(`
        SELECT * FROM activity 
        WHERE (uid="${this.props.user.uid}" OR senderId="${this.props.user.uid}") 
        AND type="TRANSACTION"
        ORDER BY date DESC LIMIT 25
      `);
    }
    activitysPromise.then(activities => {
      activities.map((a) => {
        this.setState({
          activities: [...this.state.activities, a],
          ref: a
        })
      })      
    })
    
  }

  goToUser = async(user, uid) => {
    let u = null
    switch (uid) {
      case 'senderId':
        u = await getUserById(user.senderId)
        break;
      case 'commenterId':
        u = await getUserById(user.commenterId)
        break;
      case 'followerId':
        u = await getUserById(user.followerId)
        break;
      case 'likerId':
        u = await getUserById(user.likerId)
        break;
      default:
        u = await getUserById(user.uid)
    }
    this.props.navigation.navigate('Profile', { user: u })
  }

  goToPost = (postId) => {
    this.props.getPost(postId)
    this.props.navigation.navigate('SinglePost', this.props.post)
  }

  renderList = (item) => {
    let minutesCoins = item.timeCoinsSended % 60
    minutesCoins = (minutesCoins < 10 ? '0' : '') + minutesCoins;
    const hoursCoins = (item.timeCoinsSended - minutesCoins) / 60

    switch (item.type) {
      case 'FOLLOWER':
        return (
          <View style={[styles.row, styles.space, { marginVertical: 9, marginRight: 12 }]}>
            <TouchableOpacity onPress={() => this.goToUser(item, 'followerId')}>
              <Image style={styles.roundImage} uri={item.followerPhoto} />
            </TouchableOpacity>
            <View style={[styles.container, styles.left]}>
              <View style={[styles.row, { marginBottom: 3 }]}>
                <Text>
                  <Text style={styles.bold}>{item.followerName}</Text>
                  <Text style={[styles.darkGray]}> empezó a seguirte</Text>
                </Text>
              </View>
              <Text style={[styles.gray]}>{moment(item.date).fromNow()}</Text>
            </View>
          </View>
        )
      case 'TRANSACTION':
        const title = hoursCoins + ':' + minutesCoins;
        return (
          <View style={[styles.row, styles.space, { marginVertical: 9, marginRight: 12 }]}>
            <TouchableOpacity onPress={() => this.goToUser(item, 'senderId')}>
              <Image style={styles.roundImage} uri={item.senderPhoto} />
            </TouchableOpacity>
            <View style={[styles.container, styles.left]}>
              <View style={[styles.row, { marginBottom: 3 }]}>
                { 
                  item.senderId == this.props.user.uid ? (
                    <Text>
                      <Text style={styles.bold}>{item.senderName}</Text>
                      <Text style={[styles.darkGray]}> has enviado tiempo</Text>
                    </Text>
                  ) : (
                    <Text>
                      <Text style={styles.bold}>{item.senderName}</Text>
                      <Text style={[styles.darkGray]}> te envió tiempo</Text>
                    </Text>
                  )
                }
              </View>
              <Text style={[styles.gray]}>{moment(item.date).fromNow()}</Text>
            </View>
            <AppBadge
              bgColor="#D8D8D8"
              fontColor="#1C1C1C"
              title={title}
            />
          </View>
        )
      case 'LIKE':
        return (
          <View style={[styles.row, styles.space, { marginVertical: 9, marginRight: 12 }]}>
            <TouchableOpacity onPress={() => this.goToUser(item, 'likerId')}>
              <Image style={styles.roundImage} uri={item.likerPhoto} />
            </TouchableOpacity>
            <View style={[styles.container, styles.left]}>
              <View style={[styles.row, { marginBottom: 3 }]}>
                <Text>
                  <Text style={styles.bold}>{item.likerName}</Text>
                  <Text style={[styles.darkGray]}> le gusta tu foto</Text>
                </Text>
              </View>
              <Text style={[styles.gray]}>{moment(item.date).fromNow()}</Text>
            </View>
            <Image style={styles.squareImage} uri={item.postPhoto} />
          </View>
        )
      case 'COMMENT':
        return (
          <View style={[styles.row, styles.space, { marginVertical: 9, marginRight: 12 }]}>
            <TouchableOpacity onPress={() => this.goToUser(item, 'commenterId')}>
              <Image style={styles.roundImage} uri={item.commenterPhoto} />
            </TouchableOpacity>
            <View style={[styles.container, styles.left]}>
              <View style={[styles.row, { marginBottom: 3 }]}>
                <Text>
                  <Text style={styles.bold}>{item.commenterName}</Text>
                  <Text style={[styles.darkGray]}> mencionó en un comentario: {item.comment}</Text>
                </Text>
              </View>
              <Text style={[styles.gray]}>{moment(item.date).fromNow()}</Text>
            </View>
            <TouchableOpacity style={styles.fourthButton} onPress={() => this.goToPost(item.postId)} >
              <Text style={[styles.bold]}>Ver</Text>
            </TouchableOpacity>
          </View>
        )
      default: null
    }
  }

  render() {
    if (this.state.activities.length <= 0) return <ActivityIndicator style={styles.container} />
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.activities}
          keyExtractor={(item) => item.transactionId}
          onEndReached={this.getActivities}
          onEndReachedThreshold={1}
          keyExtractor={(item) => JSON.stringify(item.date)}
          renderItem={({ item }) => this.renderList(item)} />
      </View>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ getPost }, dispatch)
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    post: state.post
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Activity)