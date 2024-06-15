// Most of this code is boilerplate code from the Firebase website

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "hidden-for-github",
  authDomain: "hidden-for-github",
  projectId: "hidden-for-github",
  storageBucket: "hidden-for-github",
  messagingSenderId: "hidden-for-github",
  appId: "hidden-for-github",
  measurementId: "hidden-for-github"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };