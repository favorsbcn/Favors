import db from '../config/firebase'
import { orderBy } from 'lodash'
import { CONVERSATION_COLLECTION } from './chats'

export const addMessage = (conversation, text) => {
  return async (dispatch, getState) => {
    const { uid, username } = getState().user
    try {
      const date = new Date().getTime()
      const message = {
        conversation,
        message: text,
        photo: '',
        username: username,
        uid: uid,
        date,
      }
      await db.collection('messages').doc().set(message)
      await db.collection(CONVERSATION_COLLECTION)
        .doc(conversation)
        .update({
          lastMessage: text,
          lastMessageDate: date,
        })

      dispatch(getMessages(conversation))
    } catch (e) {
      console.error(e)
    }
  }
}

export const addPhotoMessage = (conversation, photo) => {
  return async (dispatch, getState) => {
    const { uid, username } = getState().user
    try {
      const date = new Date().getTime()
      const message = {
        conversation,
        message: '',
        photo: photo,
        username: username,
        uid: uid,
        date,
      }
      await db.collection('messages').doc().set(message)
      await db.collection(CONVERSATION_COLLECTION)
        .doc(conversation)
        .update({
          lastMessage: 'imagen',
          lastMessageDate: date,
        })

      dispatch(getMessages(conversation))
    } catch (e) {
      console.error(e)
    }
  }
}

// TODO where else is this function called from???
export const getMessages = (conversationId) => {
  return async (dispatch) => {
    try {
      await db.collection('messages')
        .where('conversation', '==', conversationId)
        .onSnapshot(function (querySnapshot) {
          const messages = []
          querySnapshot.forEach((response) => {
            let message = response.data()
            messages.push(message)
          })
          dispatch({ type: 'GET_MESSAGES', payload: orderBy(messages, 'date', 'desc') })
        })
    } catch (e) {
      console.error(e)
    }
  }
}