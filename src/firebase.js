// Import the functions you need from the SDKs you need
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBSohgUT-8n-6qB-E-WmoJ83tTsZ7IjUBs",
  authDomain: "parcial3-a2563.firebaseapp.com",
  projectId: "parcial3-a2563",
  storageBucket: "parcial3-a2563.appspot.com",
  messagingSenderId: "728475190860",
  appId: "1:728475190860:web:f693114479a589dff156e9",
  measurementId: "G-JRHDSRBCCG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);  
export const auth = getAuth()

 
const analytics = getAnalytics(app);