// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAnNHSSws5H0-sKOxsTUMgv3saAblCRQbY",
  authDomain: "htcoaching-44012.firebaseapp.com",
  projectId: "htcoaching-44012",
  storageBucket: "htcoaching-44012.firebasestorage.app",
  messagingSenderId: "815595030578",
  appId: "1:815595030578:web:e230813eca242f7e42542b",
  measurementId: "G-60YVJ56E16",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const storage = getStorage(app);

export {
  app,
  db,
  auth,
  googleProvider,
  storage,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
};
