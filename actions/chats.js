import db from '../config/firebase'
import moment from 'moment'

export const CONVERSATION_COLLECTION = 'conversations'

export const initialiseConversation = (otherParty) => {
  return async (dispatch, getState) => {

    const { uid, username, photo } = getState().user
    try {
      const id = [uid, otherParty.uid].sort().join('')
      const conversation = await db.collection(CONVERSATION_COLLECTION)
        .where('id', '==', id)
        .get()

      if (conversation.empty) {
        const newConversation = {
          id,
          acceptConversation: [uid],
          pendingConversation: [otherParty.uid],
          countAccept: 1,
          memberDetails: [
            {
              uid,
              username,
              photo
            },
            { 
              uid: otherParty.uid,
              username: otherParty.username,
              photo: otherParty.photo
            }
          ],
          memberUids: [uid, otherParty.uid],
          reply: false
        }
        db.collection(CONVERSATION_COLLECTION)
          .doc(id)
          .set(newConversation)
        return new Conversation(newConversation, uid)
      } else {
        return new Conversation(conversation.docs.find(() => true).data(), uid)
      }
    } catch (e) {
      console.error(e)
    }
  }
}


async function hasUnreadMessages(conversationUID, lastReading) {
  const messages = await db.collection('messages')
    .where('conversation', '==', conversationUID)
    .where('date', '>', lastReading).get()
  let newMessages = false
  messages.forEach((item, i) => {
    newMessages = true
    return;
  })
  return newMessages
}

export class Conversation {

  constructor(data, myUid) {
    this._data = data
    this._myUid = myUid
    this._newMgs = false
  }

  _getOthersDetails() {
    return this._data.memberDetails.find(({ uid }) => uid !== this._myUid)
  }

  async hasNewMessage(){
    await Promise.all(this._data.memberDetails.map(async (item) => {
      if(item.lastReading && item.uid === this._myUid){
        const unread = await hasUnreadMessages(this._data.id, item.lastReading)
        if( unread ){
          this._newMgs = true
          return;
        }
      }
    }))

  }

  getId() {
    return this._data.id
  }

  getUsername() {
    const otherDetais = this._getOthersDetails()
    return otherDetais && otherDetais.username
  }

  getPhoto() {
    const otherDetais = this._getOthersDetails()
    return otherDetais && otherDetais.photo
  }

  getOtherUserUID() {
    const otherDetais = this._getOthersDetails()
    return otherDetais && otherDetais.uid
  }

  lastMessage() {
    const { lastMessage } = this._data
    if (lastMessage) {
      return lastMessage
    }
    return 'Start a Conversation...'
  }

  lastMessageDate() {
    const { lastMessageDate } = this._data
    if (lastMessageDate) {
      return moment(lastMessageDate).fromNow()
    }
    return 'NEVER'
  }
}

export const getConversations = () => {
  return async (dispatch, getState) => {
    const { uid } = getState().user
    const conversations = await db.collection(CONVERSATION_COLLECTION)
      .where('memberUids', 'array-contains', uid)
      .orderBy('lastMessageDate', 'desc').get()
      
    const myConversations = []
    conversations.forEach((conversationDoc) => {
      myConversations.push(new Conversation(conversationDoc.data(), uid))
    })
    
    dispatch({ type: 'GET_CONVERSATIONS', payload: myConversations })
    // dispatch({ type: 'GET_CONVERSATIONS', payload: orderBy(myConversations, 'lastMessageDate', 'desc') })
    // dispatch({ type: 'GET_CONVERSATIONS', payload: orderBy(conversations, 'lastMessageDate', 'desc') })
  }
}