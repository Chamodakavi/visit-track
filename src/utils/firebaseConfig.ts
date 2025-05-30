// firebaseConfig.ts or firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyAIHKTk7YoiS87VRF50wInAbQ4TP-1nYog",
  authDomain: "visit-tracker-af2df.firebaseapp.com",
  projectId: "visit-tracker-af2df",
  storageBucket: "visit-tracker-af2df.firebasestorage.app",
  messagingSenderId: "195153885818",
  appId: "1:195153885818:web:d7a43bdf3f08bfcefc59c3",
  measurementId: "G-KLS1RDK5XK"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }; 
