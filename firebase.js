import  {getApps, getApp, initializeApp} from 'firebase/app'
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'


const firebaseConfig = {
    apiKey: "AIzaSyBqu3k6wXLPNn0gK1gXueJjIr4s2N4Vr7w",
    authDomain: "insta-clone-3254e.firebaseapp.com",
    projectId: "insta-clone-3254e",
    storageBucket: "insta-clone-3254e.appspot.com",
    messagingSenderId: "283562836456",
    appId: "1:283562836456:web:f857fea71b830ca522645d"
  };

  const app = !getApps().length > 0 ? initializeApp(firebaseConfig) : getApp();

  const db = getFirestore()
  const storage = getStorage();
   export {db, storage}


