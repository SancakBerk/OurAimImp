// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBd_oB9eQ28YX2WPfA6KUxiI9ffG5tEoCs",
  authDomain: "ourgoalimp.firebaseapp.com",
  projectId: "ourgoalimp",
  storageBucket: "ourgoalimp.firebasestorage.app",
  messagingSenderId: "509464667874",
  appId: "1:509464667874:web:48044764e6eb3794e820bb",
  measurementId: "G-80TJQ7HKVQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);
