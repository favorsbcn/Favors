import React from 'react';
import styles from '../styles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Text, View, TextInput, FlatList, KeyboardAvoidingView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Image } from 'react-native-expo-image-cache'
import { addComment, getComments } from '../actions/post';
import { getUser } from '../actions/user'
import moment from 'moment'
import 'moment/locale/es'

class Comment extends React.Component {
  state = {
    comment: ''
  }

  componentDidMount = () => {
    const { params } = this.props.navigation.state
    this.props.getComments(params)
  }

  postComment = () => {
    const { params } = this.props.navigation.state
    this.props.addComment(this.state.comment, params)
    this.setState({ comment: '' })
  }

  goToUser = (user) => {
    this.props.getUser(user.uid)
    this.props.navigation.navigate('Profile', { user })
  }

  render() {
    return (
      <SafeAreaView>
        {/* <KeyboardAvoidingView enabled behavior='padding' style={styles.container}> */}
        <View style={{
          backgroundColor: '#FAFAFA', borderBottomColor: '#BDBDBD',
          borderBottomWidth: 0.5, borderTopColor: '#E6E6E6', marginBottom: 12
        }}>
          <TextInput
            style={styles.input}
            onChangeText={(comment) => this.setState({ comment })}
            value={this.state.comment}
            returnKeyType='send'
            placeholder='Añadir comentario'
            onSubmitEditing={this.postComment}
          />
        </View>
        <FlatList
          inverted
          keyExtractor={(item) => JSON.stringify(item.date)}
          data={this.props.post.comments}
          renderItem={({ item }) => (
            // <View style={[styles.row, styles.space, { marginBottom: 10 }]}>
            //   <Image style={styles.roundImage} uri={item.commenterPhoto} />
            //   <View style={[styles.container, styles.left]}>
            //     <Text style={styles.bold}>{item.commenterName}</Text>
            //     <Text style={[styles.gray, { marginVertical: 2 }]}>{item.comment}</Text>
            //     <Text style={[styles.gray, styles.small]}>{moment(item.date).fromNow()}</Text>
            //   </View>

            <View style={[styles.row, styles.maxWidth, {
              marginBottom: 18, paddingBottom: 12, borderBottomColor: '#E6E6E6',
              borderBottomWidth: 0.5, borderTopColor: '#E6E6E6',
            }]}>
              <TouchableOpacity onPress={() => this.goToUser(item)}>
                <Image style={styles.roundImage} uri={item.commenterPhoto} />
              </TouchableOpacity>
              <View style={[styles.postContent, { marginLeft: 0 }]}>
                {/* <View style={[styles.row, { marginBottom: 3 }]}> */}
                <Text style={[styles.gray, { fontSize: 14, marginBottom: 3 }]}>{item.commenterName} </Text>
                <Text style={[styles.bold, { fontSize: 15, marginBottom: 15 }]}>{item.comment}</Text>
                {/* </View> */}
                <Text style={[styles.gray, { fontSize: 14 }]}>{moment(item.date).fromNow()}</Text>
                {/* <View style={styles.row}>
                  <Text style={[styles.gray, { fontSize: 14 }]}>{item.commenterName}</Text>
                  <Text style={[styles.gray, { fontSize: 14 }]}> · {moment(item.date).fromNow()}</Text>
                </View> */}
              </View>
            </View>
            // </View>
          )} />
        {/* </KeyboardAvoidingView> */}
      </SafeAreaView>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ addComment, getComments, getUser }, dispatch)
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    post: state.post
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Comment)