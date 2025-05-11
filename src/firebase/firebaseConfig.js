// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore"; 

//Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB14hG2qUhAZ6TxOvZLUCZCkoVNs1PfLro",
    authDomain: "eventplanner-75a75.firebaseapp.com",
    projectId: "eventplanner-75a75",
    storageBucket: "eventplanner-75a75.appspot.com",
    messagingSenderId: "426919254475",
    appId: "1:426919254475:web:4d6dcba85e5f9551abbe4e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, app };