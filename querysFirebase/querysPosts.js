import db from "../config/firebase";
import uuid from 'uuid';

export async function getUserPosts(initialFecth, reference, userUID) {
  let posts = []
  if ( initialFecth ) {
    posts = await db.collection('posts')
      .where('uid', '==', userUID)
      .orderBy('date', 'desc')
      .limit(6)
      .get({ source: 'default' })
  } else {
    if ( reference ) {
      posts = await db.collection('posts')
        .where('uid', '==', userUID)
        .orderBy('date', 'desc')
        .startAfter(reference.date)
        .limit(6)
        .get({ source: 'default'})
    }
  }
  
  let array = []
  posts.forEach((post) => {
    array.push(post.data())
  })
  
  let arrayOfKeys = Object.keys(array)
    .reverse()
  let arrayPosts = arrayOfKeys.map((key) => array[key])
  referenceToOldestKey = arrayOfKeys[arrayOfKeys.length - 1];
  reference = arrayPosts[referenceToOldestKey]
  return { posts: arrayPosts.reverse(), ref: reference }
}

export async function addPost(photo, description, location, skill, user){
  const id = uuid.v4()
  const newPost = {
    id: id,
    postPhoto: photo || ' ',
    postDescription: description || ' ',
    postLocation: location || ' ',
    postSkills: skill,
    uid: user.uid,
    photo: user.photo || ' ',
    username: user.username,
    likes: [],
    comments: [],
    date: new Date().getTime(),
    enabled: true
  }
  db.collection('posts').doc(id).set(newPost)
  return newPost;
}

export async function getPosts (initialFecth, reference, city){
  let posts = []
  if (initialFecth){
    if(city) {
      posts = await db.collection('posts')
        .where('postLocation.city', '==', city)
        .orderBy('date', 'desc')
        .limit(10)
        .get({ source: 'default' })
    } else {
      posts = await db.collection('posts')
        .orderBy('date', 'desc')
        .limit(10)
        .get({ source: 'default' })
    }
  } else { 
    if(reference){
      if (city) {
        posts = await db.collection('posts')
        .where('postLocation.city', '==', city)
        .orderBy('date', 'desc')
        .startAfter(reference.date)
        .limit(10)
        .get({source: 'default'})
      } else {
        posts = await db.collection('posts')
        .orderBy('date', 'desc')
        .startAfter(reference.date)
        .limit(10)
        .get({source: 'default'})
      }
    }
  }
  let array = []
  posts.forEach((post) => {
    array.push(post.data())
  })
  let arrayOfKeys = Object.keys(array)
    .sort()
    .reverse()
  let arrayPost = arrayOfKeys
    .map((key) =>  array[key])
  referenceToOldestKey = arrayOfKeys[arrayOfKeys.length-1];
  reference = arrayPost[referenceToOldestKey]
  return {posts: arrayPost, ref: reference}
}