import db from "../config/firebase";
import { hasUnreadMessages } from "./querysMessages";
import { Conversation } from "../actions/chats";

export async function getConversation(uid) {
  const conversation = await db.collection('conversations').doc(uid).get()
  return conversation.data()
}

export async function updateLastReading(uid, userId) {
  const conversation = await getConversation(uid)
  const details = conversation.memberDetails
  details.forEach((item, i) => {
    if(item.uid === userId){
      details[i].lastReading = new Date().getTime()
    }
  })
  await db.collection('conversations').doc(uid).update({
    memberDetails: details
  })
}

export async function acceptConversation(uid, userUID) {
  const conversation = await getConversation(uid)
  const acceptConversation = conversation.acceptConversation
  acceptConversation.push(userUID)
  const pendingConversation = []
  
  await db.collection('conversations').doc(uid).update({
    acceptConversation,
    pendingConversation,
    countAccept: conversation.countAccept + 1
  })
  return true
}

export async function conversationsPending(userUID) {
  const conversations = await db.collection('conversations')
    .where('pendingConversation', 'array-contains', userUID)
    .orderBy('lastMessageDate', 'desc')
    .get()
    const myPending = []
    conversations.forEach((c) => {
      myPending.push(new Conversation(c.data(), userUID))
    })
    return myPending
}

export async function getListConversations(userId){
  const conversations = await db.collection('conversations')
      .where('acceptConversation', 'array-contains', userId)
      .orderBy('lastMessageDate', 'desc')
      .get()
  const myConversations = []
  conversations.forEach((conversationDoc) => {
    myConversations.push(new Conversation(conversationDoc.data(), userId))
  })
  await Promise.all(myConversations.map(async(item) => {
    await item.hasNewMessage()
  }))
  return myConversations  
};


export async function hasNewMessages(userUID) {
  
  let newMessages = false
  const conversations = await db.collection('conversations')
      .where('memberUids', 'array-contains', userUID)
      .get()
  let listConv = []
  conversations.forEach((conversation) => {
    const c = conversation.data()
    const d = c.memberDetails
    d.forEach((item) => {
      if(item.uid === userUID){
        if(item.lastReading){
          listConv.push({
            convId: c.id,
            lastReading: item.lastReading
          })
        }        
      } 
    })
  })
  await Promise.all(listConv.map(async (item) => {
    const unread = await hasUnreadMessages(item.convId, item.lastReading)
    if( unread ){
      newMessages = true
      return;
    }
  }))       
  return newMessages
}

