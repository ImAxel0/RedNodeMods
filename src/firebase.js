import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDON9kS8ivRRcmfPM4l5hrBu7T5poEUIbY",
  authDomain: "rednodemods.firebaseapp.com",
  projectId: "rednodemods",
  storageBucket: "rednodemods.appspot.com",
  messagingSenderId: "103028438944",
  appId: "1:103028438944:web:5108b4c2fbdbec8d3596c5",
  measurementId: "G-6R5M4H19NW",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);
export const storage = getStorage(app);
