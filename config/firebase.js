import firebase from 'firebase';
require('firebase/firestore')

import {
  API_KEY,
  AUTH_DOMAIN,
  DATABASE_URL,
  PROJECT_ID,
  STORABE_BUCKET,
  MESSAGEING_SENDER_ID,
  APP_ID
} from 'react-native-dotenv'

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket: STORABE_BUCKET,
  messagingSenderId: MESSAGEING_SENDER_ID,
  appId: APP_ID
}

firebase.initializeApp(firebaseConfig)

const db = firebase.firestore()

//Need to add this to forgo deprecated warnings
// db.settings({
//   timestampsInSnapshots: true
// });

export default db;