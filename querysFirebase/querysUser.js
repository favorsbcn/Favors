import Firebase from "firebase";
import db from "../config/firebase";
import uuid from "uuid";
import * as Facebook from "expo-facebook";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";
import { FACEBOOK_APP_ID } from "react-native-dotenv";
import { sendNotification, allowNotifications } from "../actions/index";

export async function getUserById(uid) {
  const userQuery = await db.collection("users").doc(uid).get();
  return userQuery.data();
}

export const addTransaction = async (
  receiverUser,
  user,
  donationTime,
  receiverTime,
  senderTime
) => {
  const { uid, photo, username } = user;
  let newSenderTime = senderTime - donationTime;
  let newReceiverTime = receiverTime + donationTime;
  const transactionId = uuid.v4();
  try {
    const transaction = {
      id: transactionId,
      members: [receiverUser.uid, uid].sort(),
      transaction: donationTime,
      photo: photo,
      username: username,
      uid: uid,
      date: new Date().getTime(),
    };
    await db.collection("users").doc(uid).update({
      timeCoins: newSenderTime,
    });
    await db.collection("users").doc(receiverUser.uid).update({
      timeCoins: newReceiverTime,
    });
    await db.collection("transactions").doc().set(transaction);
    await db.collection("activity").doc().set({
      transactionId: transactionId,
      timeCoinsSended: donationTime,
      senderId: uid,
      receiverName: receiverUser.username,
      receiverPhoto: receiverUser.photo,
      senderPhoto: photo,
      senderName: username,
      uid: receiverUser.uid,
      date: new Date().getTime(),
      type: "TRANSACTION",
    });
    await sendNotification(uid, " te envió tiempo");
    // dispatch(getMessages())
  } catch (e) {
    console.error(e);
  }
};

export const updateUser = async (user) => {
  const { uid, username, bio, photo, location } = user;
  try {
    await db
      .collection("users")
      .doc(uid)
      .update({
        username: username,
        bio: bio,
        photo: photo,
        location: location,
      })
      .then(async () => {
        await db
          .collection("posts")
          .where("uid", "==", uid)
          .get()
          .then((querySnapshot) => {
            const batch = db.batch();
            querySnapshot.forEach((postDoc) => {
              batch.update(postDoc.ref, { username, photo });
            });
            batch.commit().then((result) => console.log({ result }));
          });
        await db
          .collection(CONVERSATION_COLLECTION)
          .where("memberUids", "array-contains", uid)
          .get()
          .then((querySnapshot) => {
            const batch = db.batch();
            querySnapshot.forEach((conversationDoc) => {
              const conversation = conversationDoc.data();
              const memberDetail = conversation.memberDetails.find(
                (member) => member.uid === uid
              );
              const otherDetails = conversation.memberDetails.filter(
                (member) => member.uid !== uid
              );
              const updatedMember = { ...memberDetail, username, photo };

              batch.update(conversationDoc.ref, {
                memberDetails: [...otherDetails, updatedMember],
              });
            });
            batch.commit().then((result) => console.log({ result }));
          });
      });
  } catch (e) {
    alert(e);
  }
};

export const updateLocationUser = async (user, location) => {
  const { uid } = user;
  try {
    await db.collection("users").doc(uid).update({
      location: location,
    });
  } catch (e) {
    console.log("update location", e);
    alert(e);
  }
};

export const facebookLogin = async () => {
  try {
    await Facebook.initializeAsync(FACEBOOK_APP_ID, "Favors");
    const { type, token } = await Facebook.logInWithReadPermissionsAsync({
      permissions: ["public_profile", "email"],
    });
    if (type === "success") {
      // Build Firebase credential with the Facebook access token.
      const credential = await Firebase.auth.FacebookAuthProvider.credential(
        token
      );
      // Sign in with credential from the Facebook user.
      const response = await Firebase.auth().signInWithCredential(credential);
      const user = await db.collection("users").doc(response.user.uid).get();
      if (!user.exists) {
        let photo_user = response.user.photoURL;
        try {
          photo_user = response.additionalUserInfo.profile.picture.data.url;
        } catch (error) {
          console.log("photo facebook", error);
        }
        const user_json = {
          uid: response.user.uid,
          email: response.user.email,
          username: response.user.displayName,
          bio: "",
          photo: photo_user,
          token: null,
          followers: [],
          following: [],
          location: {},
          timeCoins: 120,
        };
        await db.collection("users").doc(user_json.uid).set(user_json);
      }
    }
  } catch (e) {
    console.log(e);
  }
};

export const appleLogin = async () => {
  try {
    const csrf = Math.random().toString(36).substring(2, 15);
    const nonce = Math.random().toString(36).substring(2, 10);
    const hashedNonce = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      nonce
    );
    console.log("enterr login");
    const tokenApple = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
      state: csrf,
      nonce: hashedNonce,
    });
    const provider = new Firebase.auth.OAuthProvider("apple.com");
    provider.addScope("email");
    provider.addScope("name");
    const credential = provider.credential({
      idToken: tokenApple.identityToken,
      rawNonce: nonce,
    });
    console.log("credential", credential);
    try {
      const response = await Firebase.auth().signInWithCredential(credential);
      const user = await db.collection("users").doc(response.user.uid).get();
      if (!user.exists) {
        const user_json = {
          uid: response.user.uid,
          email: response.user.email,
          username: response.user.displayName,
          bio: "",
          photo: response.user.photoURL,
          token: null,
          followers: [],
          following: [],
          location: {},
          timeCoins: 120,
        };
        await db.collection("users").doc(user_json.uid).set(user_json);
      }
    } catch (error) {
      console.log("error firebase", JSON.stringify(error));
    }
  } catch (e) {
    console.log("code error", e.code);
    alert(e.code);
    if (e.code === "ERR_CANCELED") {
      // CANCELADO
    } else {
      console.log("apple error code", e.code, e);
    }
  }
};
