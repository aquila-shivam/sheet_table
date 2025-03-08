// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBB1z3rLX71JMxRVBUZxHSrIHTnoWKe66A",
  authDomain: "sheet-39a60.firebaseapp.com",
  projectId: "sheet-39a60",
  storageBucket: "sheet-39a60.firebasestorage.app",
  messagingSenderId: "187460732873",
  appId: "1:187460732873:web:acc44297ff352fca058a18",
  measurementId: "G-RVFRXZ7TL0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, doc, onSnapshot };