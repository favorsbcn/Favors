import React from 'react';
import styles from '../styles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { View, Text, SafeAreaView, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { Image } from 'react-native-expo-image-cache'
import { getUser } from '../actions/user'
import { searchUsers } from '../services/search'

class Search extends React.Component {
  state = {
    search: '',
    query: []
  }

  searchUser = async () => {
    const { search } = this.state
    const hits = await searchUsers(search)
    this.setState({ query: hits })
  }

  goToUser = (user) => {
    this.props.getUser(user.uid)
    this.props.navigation.navigate('Profile', { user })
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{
          backgroundColor: '#FAFAFA', borderBottomColor: '#BDBDBD',
          borderBottomWidth: 0.5, borderTopColor: '#E6E6E6', marginBottom: 12
        }}>
          <TextInput
            style={styles.input}
            onChangeText={(search) => this.setState({ search })}
            value={this.state.search}
            returnKeyType='send'
            placeholder='Busca'
            onSubmitEditing={this.searchUser}
          />
        </View>
        <FlatList
          data={this.state.query}
          keyExtractor={(item) => JSON.stringify(item.uid)}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => this.goToUser(item)} style={[styles.row, styles.space, { marginVertical: 6 }]}>
              <Image style={styles.roundImage} uri={item.photo} />
              <View style={[styles.container, styles.left]}>
                <Text style={styles.bold}>{item.username}</Text>
                <Text style={[styles.gray, { marginTop: 2 }]}>{item.bio}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ getUser }, dispatch)
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search)