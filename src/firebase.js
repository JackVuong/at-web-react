import FireBase from 'firebase';
import _ from 'lodash';
const config = {
    apiKey: "AIzaSyDzGLjwaQI5mMV2kBuAuVAVh7Ns5CHigNI",
    authDomain: "attendance-tracking-af83a.firebaseapp.com",
    databaseURL: "https://attendance-tracking-af83a.firebaseio.com",
    projectId: "attendance-tracking-af83a",
    storageBucket: "attendance-tracking-af83a.appspot.com",
    messagingSenderId: "498865513606"
  };


const firebase = FireBase.initializeApp(config);

export const database = firebase.database();
export const getData = (part) => database.ref(part).once('value').then((snapshot) => snapshot.val());
export const update = (part, data) => database.ref().update({[part]: data});
export const getLastIndex = (part) => {
   return getData(part).then((data) => {
     return _.last(Object.keys(data))
   })
 }
export default firebase
