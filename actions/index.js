import uuid from 'uuid';
import firebase from 'firebase'
import db from '../config/firebase'
import { Notifications } from 'expo';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Permissions from 'expo-permissions';
const PUSH_ENDPOINT = 'https://exp.host/--/api/v2/push/send'

export const uploadPhoto = (image) => {
  return async (dispatch) => {
    try {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.onload = () => resolve(xhr.response)
        xhr.responseType = 'blob'
        xhr.open('GET', image.uri, true)
        xhr.send(null)
      });
      const uploadTask = await firebase.storage().ref().child(uuid.v4()).put(blob)
      const downloadURL = await uploadTask.ref.getDownloadURL()
      return downloadURL
    } catch (e) {
      console.error(e)
    }
  }
}

export const allowNotifications = (uid) => {
  return async (dispatch, getState) => {
    try {
      const permission = await Permissions.askAsync(Permissions.NOTIFICATIONS)
      if (permission.status === 'granted') {
        try {
          const token = await Notifications.getExpoPushTokenAsync()
          dispatch({ type: 'GET_TOKEN', payload: token })
          await db.collection('users').doc(uid).update({ token: token })
        } catch (error) {
          console.log("get token", error);
        }
      }
    } catch (e) {
      console.error(e)
    }
  }
}

export const sendNotification = (uid, text) => {
  return async (dispatch, getState) => {
    const { username } = getState().user
    try {
      const user = await db.collection('users').doc(uid).get()
      if (user.data().token) {
        fetch(PUSH_ENDPOINT, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: user.data().token,
            title: username,
            body: text,
          })
        })
      }
    } catch (e) {
      console.error(e)
    }
  }
}

export const openPhoto = (photo) => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: 'OPEN_PHOTO', payload: photo })
    } catch (e) {
      console.error(e)
    }
  }
}

export const closePhoto = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({ type: 'CLOSE_PHOTO', payload: '' })
    } catch (e) {
      console.error(e)
    }
  }
}