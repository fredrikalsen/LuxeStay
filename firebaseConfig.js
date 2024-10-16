// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAKSq6CZsP_h_Wjhg0EzViYhAUTWDZPK98",
  authDomain: "airbnb-6c30d.firebaseapp.com",
  projectId: "airbnb-6c30d",
  storageBucket: "airbnb-6c30d.appspot.com",
  messagingSenderId: "693853552251",
  appId: "1:693853552251:web:61a559f98988b5af806cde",
  measurementId: "G-NTVXYRC744"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };