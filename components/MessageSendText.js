import React, { Component } from 'react'
import styles from '../styles'
import { TextInput, Keyboard } from 'react-native'

class MessageSendText extends Component {

  constructor(props) {
    super(props)
    this.state = {
      message: '',
      marginBottom: 15,
    }
    this._keyboardDidHide = this._keyboardDidHide.bind(this)
    this._keyboardDidShow = this._keyboardDidShow.bind(this)
  }
  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow() {
    this.setState({
      marginBottom: 90
    })
  }

  _keyboardDidHide() {
    this.setState({
      marginBottom: 15
    })
  }

  render() {
    const { sendMessage } = this.props
    const { message } = this.state
    return (
      <TextInput
        style={[styles.input, {marginBottom: this.state.marginBottom}]}
        onChangeText={(message) => this.setState({ message })}
        value={message}
        returnKeyType='send'
        placeholder='Send Message'
        onSubmitEditing={() => {
          sendMessage(message)
          this.setState({ message: '' })
          Keyboard.dismiss
        }} />
    )
  }
}

export default MessageSendText