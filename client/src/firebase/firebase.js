// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBfvWXuduJ1lF5c3PqxvNMLgjbVKdcdSBs",
  authDomain: "cheapeats-a8676.firebaseapp.com",
  projectId: "cheapeats-a8676",
  storageBucket: "cheapeats-a8676.appspot.com",
  messagingSenderId: "241269563932",
  appId: "1:241269563932:web:e1dc49e853e26d7770f5d9",
  measurementId: "G-E2C5HKFG6T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };