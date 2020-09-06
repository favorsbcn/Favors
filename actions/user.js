import firebase from 'firebase'
import db from '../config/firebase'
import uuid from 'uuid'
import { allowNotifications, sendNotification } from './'
import * as Facebook from 'expo-facebook';
import { FACEBOOK_APP_ID } from 'react-native-dotenv'

const CONVERSATION_COLLECTION = 'conversations'

export const updateEmail = (email) => {
  return { type: 'UPDATE_EMAIL', payload: email }
}

export const updatePassword = (password) => {
  return { type: 'UPDATE_PASSWORD', payload: password }
}

export const updateUsername = (username) => {
  return { type: 'UPDATE_USERNAME', payload: username }
}

export const updateBio = (bio) => {
  return { type: 'UPDATE_BIO', payload: bio }
}

export const updatePhoto = (photo) => {
  return { type: 'UPDATE_PHOTO', payload: photo }
}

export const updateUserPhoto = (photo) => {
  return { type: 'UPDATE_USER_PHOTO', payload: photo }
}

export const updateTime = (timeCoins) => {
  return { type: 'UPDATE_TIMECOINS', payload: timeCoins }
}

export const updateUserLocation = (location) => {
  return { type: 'UPDATE_USER_LOCATION', payload: location }
}

export const login = () => {
  return async (dispatch, getState) => {
    try {
      const { email, password } = getState().user
      const response = await firebase.auth().signInWithEmailAndPassword(email, password)
      dispatch(getUser(response.user.uid))
    } catch (e) {
      console.log("login action", e);
      alert(e)
    }
  }
}

/*export const facebookLogin = (location) => {
  return async (dispatch) => {
    try {
      const { type, token } = await Facebook.logInWithReadPermissionsAsync(FACEBOOK_APP_ID, { behavior: "web" })
      if (type === 'success') {
        // Build Firebase credential with the Facebook access token.
        const credential = await firebase.auth.FacebookAuthProvider.credential(token)
        // Sign in with credential from the Facebook user.
        const response = await firebase.auth().signInWithCredential(credential)
        const user = await db.collection('users').doc(response.uid).get()
        if (!user.exists) {
          const user = {
            uid: response.uid,
            email: response.email,
            username: response.displayName,
            bio: '',
            photo: response.photoURL,
            token: null,
            followers: [],
            following: [],
            location: location,
            timeCoins: 2
            
          }
          db.collection('users').doc(response.uid).set(user)
          dispatch({ type: 'LOGIN', payload: user })
          dispatch(allowNotifications(user.uid))
        } else {
          dispatch(getUser(response.uid))
          
        }
      }
    } catch (e) {
      alert(e)
    }
  }
}*/
 
export const getUser = (uid, type) => {
  return async (dispatch, getState) => {
    try {   
      const userQuery = await db.collection('users').doc(uid).get()
      let user = userQuery.data()
      /*let posts = []
      const postsQuery = await db.collection('posts').where('uid', '==', uid).get()
      postsQuery.forEach(function (response) {
        posts.push(response.data())
      })
      user.posts = orderBy(posts, 'date', 'desc')*/
      if (type === 'LOGIN') {
        dispatch({ type: 'LOGIN', payload: user })
      } else {
        dispatch({ type: 'GET_PROFILE', payload: user })
      }
    } catch (e) { 
      alert("GET USER " + e)
    }
  }
}

// without redux
export async function getUserById(uid) {
  const userQuery = await db.collection('users').doc(uid).get()
  return userQuery.data()
}

export const updateUser = () => {
  return async (dispatch, getState) => {
    const { uid, username, bio, photo, location } = getState().user
    try {
      db.collection('users').doc(uid).update({
        username: username,
        bio: bio,
        photo: photo,
        location: location
      }).then(() => {
        db.collection('posts')
          .where('uid', '==', uid)
          .get()
          .then(querySnapshot => {
            const batch = db.batch()
            querySnapshot.forEach(postDoc => {
              batch.update(postDoc.ref, { username, photo })
            })
            batch.commit()
              .then((result) => console.log({ result }))
          })
        db.collection('activity')
          .where('senderId', '==', uid)
          .get()
          .then(querySnapshot => {
            const batch = db.batch()
            querySnapshot.forEach(actDoc => {
              batch.update(actDoc.ref, { senderName: username, senderPhoto: photo })
            })
            batch.commit().then((result) => console.log({ result }))
          })
          

        db.collection('activity')
          .where('uid', '==', uid)
          .get()
          .then(querySnapshot => {
            const batch = db.batch()
            querySnapshot.forEach(actDoc => {
              batch.update(actDoc.ref, { receiverName: username, receiverPhoto: photo })
            })
            batch.commit().then((result) => console.log({ result }))
          })
          
        db.collection(CONVERSATION_COLLECTION)
          .where('memberUids', 'array-contains', uid)
          .get()
          .then(querySnapshot => {
            const batch = db.batch()
            querySnapshot.forEach(conversationDoc => {
              const conversation = conversationDoc.data()
              const memberDetail = conversation.memberDetails.find((member) => member.uid === uid)
              const otherDetails = conversation.memberDetails.filter((member) => member.uid !== uid)
              const updatedMember = { ...memberDetail, username, photo }

              batch.update(conversationDoc.ref, { memberDetails: [...otherDetails, updatedMember] })
            })
            batch.commit()
              .then((result) => console.log({ result }))
          })
      })

    } catch (e) {
      alert(e)
    }
  }
}

export const signup = () => {
  return async (dispatch, getState) => {
    try {
      const { email, password, username, bio } = getState().user
      const response = await firebase.auth().createUserWithEmailAndPassword(email, password)
      if (response.user.uid) {
        const user = {
          uid: response.user.uid,
          email: email,
          username: username,
          bio: bio,
          photo: '',
          token: null,
          followers: [],
          following: [],
          location: [],
          timeCoins: 2
        }
        db.collection('users').doc(response.user.uid).set(user)
        
        dispatch({ type: 'LOGIN', payload: user })
      }
    } catch (e) {
      alert(e)
    }
  }
}

export const followUser = (user) => {
  return async (dispatch, getState) => {
    const { uid, photo, username } = getState().user
    try {
      db.collection('users').doc(user.uid).update({
        followers: firebase.firestore.FieldValue.arrayUnion(uid)
      })
      db.collection('users').doc(uid).update({
        following: firebase.firestore.FieldValue.arrayUnion(user.uid)
      })
      db.collection('activity').doc().set({
        followerId: uid,
        followerPhoto: photo,
        followerName: username,
        uid: user.uid,
        photo: user.photo,
        username: user.username,
        date: new Date().getTime(),
        type: 'FOLLOWER',
      })
      dispatch(sendNotification(user.uid, 'Started Following You'))
      dispatch(getUser(user.uid))
    } catch (e) {
      console.error(e)
    }
  }
}

export const unfollowUser = (user) => {
  return async (dispatch, getState) => {
    const { uid, photo, username } = getState().user
    try {
      db.collection('users').doc(user.uid).update({
        followers: firebase.firestore.FieldValue.arrayRemove(uid)
      })
      db.collection('users').doc(uid).update({
        following: firebase.firestore.FieldValue.arrayRemove(user.uid)
      })
      dispatch(getUser(user.uid))
    } catch (e) {
      console.error(e)
    }
  }
}