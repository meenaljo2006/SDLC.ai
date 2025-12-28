// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCh0VvvykIo4_h_OgcbdEVSH6dmCW5mzPw",
  authDomain: "sdlcai-3501a.firebaseapp.com",
  projectId: "sdlcai-3501a",
  storageBucket: "sdlcai-3501a.firebasestorage.app",
  messagingSenderId: "867454965992",
  appId: "1:867454965992:web:7e17dc4460092d9454115d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); 
export const db = getFirestore(app); 