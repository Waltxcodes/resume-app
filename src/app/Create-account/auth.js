import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCq28NeqNfMsGrVhbMtcZTUozmGw5RlPeQ",
  authDomain: "resume-app-3c3a8.firebaseapp.com",
  projectId: "resume-app-3c3a8",
  storageBucket: "resume-app-3c3a8.appspot.com",
  messagingSenderId: "428780003055",
  appId: "1:428780003055:web:16ec5cd60d583fc1c3051a",
  measurementId: "G-B69X4134QS"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const firestore = getFirestore(app);

export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export { storage, firestore };
