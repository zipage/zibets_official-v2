import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBsH3mH8ei-m3OdG5iVMEUz8SvL_rjVNCw",
  authDomain: "zibets-d4fe1.firebaseapp.com",
  projectId: "zibets-d4fe1",
  storageBucket: "zibets-d4fe1.firebasestorage.app",
  messagingSenderId: "97543798103",
  appId: "1:97543798103:web:e1a162e9e285aa00a19212",
  measurementId: "G-6KN4R431SK"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
