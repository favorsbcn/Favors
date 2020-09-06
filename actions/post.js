import firebase from "firebase";
import db from "../config/firebase";
import uuid from "uuid";
import cloneDeep from "lodash/cloneDeep";
import orderBy from "lodash/orderBy";
import { sendNotification } from "./";

export const updateDescription = (input) => {
  return { type: "UPDATE_DESCRIPTION", payload: input };
};

export const updatePhoto = (input) => {
  return { type: "UPDATE_PHOTO", payload: input };
};

export const updatePostPhoto = (input) => {
  return { type: "UPDATE_POST_PHOTO", payload: input };
};

export const updateLocation = (input) => {
  return { type: "UPDATE_LOCATION", payload: input };
};

export const uploadSkills = (input) => {
  return { type: "UPDATE_SKILLS", payload: input };
};

export const uploadPost = () => {
  return async (dispatch, getState) => {
    try {
      const { post, user } = getState();
      const id = uuid.v4();
      const upload = {
        id: id,
        postPhoto: post.photo || " ",
        postDescription: post.description || " ",
        postLocation: post.location || " ",
        postSkills: post.skills,
        uid: user.uid,
        photo: user.photo || " ",
        username: user.username,
        likes: [],
        comments: [],
        date: new Date().getTime(),
        enabled: true,
      };
      db.collection("posts").doc(id).set(upload);
    } catch (e) {
      console.error(e);
    }
  };
};

export const getPosts = (initialFecth, reference, city) => {
  return async (dispatch, getState) => {
    try {
      let posts = [];
      if (initialFecth) {
        if (city) {
          posts = await db
            .collection("posts")
            .where("postLocation.city", "==", city)
            .orderBy("date", "desc")
            .limit(10)
            .get({ source: "default" });
        } else {
          posts = await db
            .collection("posts")
            .orderBy("date", "desc")
            .limit(10)
            .get({ source: "default" });
        }

        let array = [];
        posts.forEach((post) => {
          array.push(post.data());
        });
        let arrayOfKeys = Object.keys(array).sort().reverse();
        let arrayPost = arrayOfKeys.map((key) => array[key]);
        const referenceToOldestKey = arrayOfKeys[arrayOfKeys.length - 1];
        reference = arrayPost[referenceToOldestKey];
        dispatch({
          type: "GET_POSTS",
          payload: orderBy(arrayPost, "date", "desc"),
          reference,
        });
      } else {
        if (reference) {
          let posts = [];
          if (city) {
            posts = await db
              .collection("posts")
              .where("postLocation.city", "==", city)
              .orderBy("date", "desc")
              .startAfter(reference.date)
              .limit(10)
              .get({ source: "default" });
          } else {
            posts = await db
              .collection("posts")
              .orderBy("date", "desc")
              .startAfter(reference.date)
              .limit(10)
              .get({ source: "default" });
          }
          let array = [];
          posts.forEach((post) => {
            array.push(post.data());
          });
          let arrayOfKeys = Object.keys(array).sort().reverse();
          let arrayPost = arrayOfKeys.map((key) => array[key]);
          const referenceToOldestKey = arrayOfKeys[arrayOfKeys.length - 1];
          reference = arrayPost[referenceToOldestKey];
          console.log("finished posts");
          dispatch({
            type: "GET_MORE_POSTS",
            payload: orderBy(arrayPost, "date", "desc"),
            reference,
          });
        }
      }
    } catch (e) {
      console.log("get_posts", e);
      alert(e);
    }
  };
};

export const getPost = (uid) => {
  return async (dispatch, getState) => {
    try {
      const post = await db.collection("posts").doc(uid).get();
      dispatch({ type: "GET_POST", payload: post.data() });
    } catch (e) {
      console.log("post", e);
      alert(e);
    }
  };
};

export const getFilteredPosts = (postSkills) => {
  return async (dispatch, getState) => {
    try {
      const posts = await db
        .collection("posts")
        .where("postSkills", "==", postSkills)
        .get();
      let array = [];
      posts.forEach((post) => {
        array.push(post.data());
      });
      dispatch({ type: "GET_POSTS", payload: orderBy(array, "date", "desc") });
    } catch (e) {
      console.log("filter", e);
      alert(e);
    }
  };
};

export const likePost = (post) => {
  return (dispatch, getState) => {
    const { uid, username, photo } = getState().user;
    try {
      const home = cloneDeep(getState().post.feed);
      let newFeed = home.map((item) => {
        if (item.id === post.id) {
          item.likes.push(uid);
        }
        return item;
      });
      db.collection("posts")
        .doc(post.id)
        .update({
          likes: firebase.firestore.FieldValue.arrayUnion(uid),
        });
      db.collection("activity").doc().set({
        postId: post.id,
        postPhoto: post.postPhoto,
        likerId: uid,
        likerPhoto: photo,
        likerName: username,
        uid: post.uid,
        date: new Date().getTime(),
        type: "LIKE",
      });
      dispatch(sendNotification(post.uid, "Liked Your Photo"));
      dispatch({ type: "GET_POSTS", payload: newFeed });
    } catch (e) {
      console.error(e);
    }
  };
};

export const unlikePost = (post) => {
  return async (dispatch, getState) => {
    const { uid } = getState().user;
    try {
      db.collection("posts")
        .doc(post.id)
        .update({
          likes: firebase.firestore.FieldValue.arrayRemove(uid),
        });
      const query = await db
        .collection("activity")
        .where("postId", "==", post.id)
        .where("likerId", "==", uid)
        .get();
      query.forEach((response) => {
        response.ref.delete();
      });
      dispatch(getPosts());
    } catch (e) {
      console.error(e);
    }
  };
};

// export const sharePost = (post) => {
//   return async (dispatch, getState) => {
//     const { uid } = getState().user
//     try {
//       const result = await Share.share({
//         message: 'Consulta esta petición de TimeChat de ${user.username}: ${post.id}',
//       });
//       console.log('SHARE BUTTON: ', result)

//       if (result.action === Share.sharedAction) {
//         if (result.activityType) {
//           // shared with activity type of result.activityType
//         } else {
//           // shared
//         }
//       } else if (result.action === Share.dismissedAction) {
//         // dismissed
//       }
//     } catch (error) {
//       alert(error.message);
//     }
//   }
// }

export const getComments = (post) => {
  return (dispatch) => {
    dispatch({
      type: "GET_COMMENTS",
      payload: orderBy(post.comments, "date", "desc"),
    });
  };
};

export const addComment = (text, post) => {
  return (dispatch, getState) => {
    const { uid, photo, username } = getState().user;
    let comments = cloneDeep(getState().post.comments.reverse());
    try {
      const comment = {
        comment: text,
        commenterId: uid,
        commenterPhoto: photo || "",
        commenterName: username,
        date: new Date().getTime(),
      };
      db.collection("posts")
        .doc(post.id)
        .update({
          comments: firebase.firestore.FieldValue.arrayUnion(comment),
        });
      comment.postId = post.id;
      comment.postPhoto = post.postPhoto;
      comment.uid = post.uid;
      comment.type = "COMMENT";
      comments.push(comment);
      dispatch({ type: "GET_COMMENTS", payload: comments.reverse() });
      dispatch(sendNotification(post.uid, text));
      db.collection("activity").doc().set(comment);
    } catch (e) {
      console.error(e);
    }
  };
};
