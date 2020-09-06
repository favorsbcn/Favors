import db from "../config/firebase";
import { FireSQL } from "firesql";
import firebase from "firebase/app";

export async function getActivities(uidUser, reference){
  try {
    const fireSQL = new FireSQL(firebase.firestore());
    let acts = []  
    if ( reference ){
      const activitysPromise = fireSQL.query(`
        SELECT * FROM activity 
        WHERE (uid="${uidUser}" OR senderId="${uidUser}" )
        AND date > "${reference.date}"
        ORDER BY date DESC LIMIT 5
      `);
      activitysPromise.then(activitys => {
        for(const act of activitys) {
          acts.push(act)
        }
      })
    } else {
      const activitysPromise = fireSQL.query(`
        SELECT * FROM activity 
        WHERE uid="${uidUser}" OR senderId="${uidUser}" 
        ORDER BY date DESC LIMIT 5
      `);
      const acts = []
      activitysPromise.then(activitys => {
        for(const act of activitys) {
          acts.push(act)
        }
      })
    }
    
    let arrayOfKeys = Object.keys(acts)
      .reverse()
    let arrayActivities = arrayOfKeys.map((key) => array[key])
    referenceToOldestKey = arrayOfKeys[arrayOfKeys.length - 1];
    reference = arrayActivities[referenceToOldestKey]
    
    return { activities: arrayActivities, ref: reference}
  } catch (error) {
    console.log("getactivities", error);
    
  }
}