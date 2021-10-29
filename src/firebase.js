
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADhcMRxq-5DLqp8cTp0-sk1S3_CPr4iS4",
  authDomain: "appointments-1f6f1.firebaseapp.com",
  projectId: "appointments-1f6f1",
  storageBucket: "appointments-1f6f1.appspot.com",
  messagingSenderId: "109993046907",
  appId: "1:109993046907:web:8b68d614c8f105bf8783de"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();



export {app, db}
