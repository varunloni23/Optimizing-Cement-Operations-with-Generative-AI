// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDmiyJI9HLybYo5QE_k-bNuSEbeQOtXCXY",
  authDomain: "nexus-4b4ba.firebaseapp.com",
  projectId: "nexus-4b4ba",
  storageBucket: "nexus-4b4ba.firebasestorage.app",
  messagingSenderId: "492142282065",
  appId: "1:492142282065:web:5ce721fc60c3286f8b7f70",
  measurementId: "G-0W3KCLKSZ4",
  databaseURL: "https://nexus-4b4ba-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const database = getDatabase(app);
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export {
  app,
  analytics,
  database,
  firestore,
  auth,
  storage,
  firebaseConfig
};

export default app;