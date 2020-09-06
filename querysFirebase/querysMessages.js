import db from "../config/firebase";
import firebase from "firebase";
import { Conversation } from "../actions/chats";

export async function hasUnreadMessages(conversationUID, lastReading) {
  const messages = await db
    .collection("messages")
    .where("conversation", "==", conversationUID)
    .where("date", ">", lastReading)
    .get();
  let newMessages = false;
  messages.forEach((item, i) => {
    newMessages = true;
    return;
  });
  return newMessages;
}

export async function getMessages(conversationId, initialFetch, reference) {
  try {
    let messages = [];
    if (initialFetch) {
      messages = await db
        .collection("messages")
        .where("conversation", "==", conversationId)
        .orderBy("date", "desc")
        .limit(15)
        .get({ source: "default" });
    } else {
      if (reference) {
        messages = await db
          .collection("messages")
          .where("conversation", "==", conversationId)
          .orderBy("date", "desc")
          .startAfter(reference.date)
          .limit(15)
          .get({ source: "default" });
      }
    }
    let array = [];
    messages.forEach((message) => {
      array.push(message.data());
    });
    let arrayOfKeys = Object.keys(array).reverse();
    let arrayMessage = arrayOfKeys.map((key) => array[key]);
    referenceToOldestKey = arrayOfKeys[arrayOfKeys.length - 1];
    reference = arrayMessage[referenceToOldestKey];
    return { messages: arrayMessage.reverse(), ref: reference };
  } catch (error) {
    alert(error);
  }
}

export async function addMessage(conversationUID, username, userUID, text) {
  try {
    const date = new Date().getTime();
    const message = {
      conversation: conversationUID,
      message: text,
      photo: "",
      username: username,
      uid: userUID,
      date,
    };
    await db.collection("messages").doc().set(message);
    await db.collection("conversations").doc(conversationUID).update({
      lastMessage: text,
      lastMessageDate: date,
    });
    return message;
  } catch (e) {
    console.error(e);
  }
}

export async function addPhotoMessage(
  conversationUID,
  username,
  userUID,
  photo
) {
  try {
    const date = new Date().getTime();
    const message = {
      conversation: conversationUID,
      message: "",
      photo: photo,
      username: username,
      uid: userUID,
      date,
    };
    await db.collection("messages").doc().set(message);
    await db.collection("conversations").doc(conversationUID).update({
      lastMessage: "imagen",
      lastMessageDate: date,
    });
    return message;
  } catch (e) {
    console.error(e);
  }
}

async function existConversation(
  myUserUID,
  myUserName,
  myUserPhoto,
  otherUserUID,
  otherUserName,
  otherUserPhoto
) {
  const conversationUID = [myUserUID, otherUserUID].sort().join("");
  const conversationExist = await db
    .collection("conversations")
    .where("id", "==", conversationUID)
    .get();

  if (conversationExist.empty) {
    const newConversation = {
      id: conversationUID,
      acceptConversation: [myUserUID],
      pendingConversation: [otherUserUID],
      countAccept: 1,
      memberDetails: [
        {
          uid: myUserUID,
          username: myUserName,
          photo: myUserPhoto,
        },
        {
          uid: otherUserUID,
          username: otherUserName,
          photo: otherUserPhoto,
        },
      ],
      memberUids: [myUserUID, otherUserUID],
      reply: false,
    };
    await db
      .collection("conversations")
      .doc(conversationUID)
      .set(newConversation);
  }
}

export async function sendPost(
  myUserUID,
  myUserName,
  myUserPhoto,
  otherUserUID,
  otherUserName,
  otherUserPhoto,
  post
) {
  try {
    await existConversation(
      myUserUID,
      myUserName,
      myUserPhoto,
      otherUserUID,
      otherUserName,
      otherUserPhoto
    );
    const conversationUID = [myUserUID, otherUserUID].sort().join("");
    const date = new Date().getTime();
    const message = {
      conversation: conversationUID,
      message: "",
      photo: "",
      post: post,
      username: myUserName,
      uid: myUserUID,
      date,
    };
    await db.collection("messages").doc().set(message);
    await db.collection("conversations").doc(conversationUID).update({
      lastMessage: "post",
      lastMessageDate: date,
    });
    await db
      .collection("posts")
      .doc(post.id)
      .update({ offer: firebase.firestore.FieldValue.arrayUnion(myUserUID) });
    const conversation = await db
      .collection("conversations")
      .doc(conversationUID)
      .get();
    return new Conversation(conversation.data(), myUserUID);
  } catch (error) {
    console.error(error);
  }
}

export async function sendTime(
  myUserUID,
  myUserName,
  myUserPhoto,
  otherUserUID,
  otherUserName,
  otherUserPhoto,
  time
) {
  try {
    await existConversation(
      myUserUID,
      myUserName,
      myUserPhoto,
      otherUserUID,
      otherUserName,
      otherUserPhoto
    );
    const conversationUID = [myUserUID, otherUserUID].sort().join("");
    const date = new Date().getTime();
    const message = {
      conversation: conversationUID,
      message: "",
      photo: "",
      post: "",
      time: time,
      requestTime: "",
      username: myUserName,
      uid: myUserUID,
      date,
    };
    await db.collection("messages").doc().set(message);
    await db.collection("conversations").doc(conversationUID).update({
      lastMessage: "time",
      lastMessageDate: date,
    });
    const conversation = await db
      .collection("conversations")
      .doc(conversationUID)
      .get();
    return new Conversation(conversation.data(), myUserUID);
  } catch (error) {
    console.log(error);
  }
}

export async function snedRequestTime(
  myUserUID,
  myUserName,
  myUserPhoto,
  otherUserUID,
  otherUserName,
  otherUserPhoto,
  time
) {
  try {
    await existConversation(
      myUserUID,
      myUserName,
      myUserPhoto,
      otherUserUID,
      otherUserName,
      otherUserPhoto
    );
    const conversationUID = [myUserUID, otherUserUID].sort().join("");
    const date = new Date().getTime();
    const message = {
      conversation: conversationUID,
      requestTime: time,
      username: myUserName,
      uid: myUserUID,
      date,
    };
    await db.collection("messages").doc().set(message);
    await db.collection("conversations").doc(conversationUID).update({
      lastMessage: "request time",
      lastMessageDate: date,
    });
    const conversation = await db
      .collection("conversations")
      .doc(conversationUID)
      .get();
    return new Conversation(conversation.data(), myUserUID);
  } catch (error) {
    console.log(error);
  }
}
