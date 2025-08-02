// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier  } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCLVfND5wDDq-gYsWgkAVqI-2x31cm09KU",
  authDomain: "twiller-b9f61.firebaseapp.com",
  projectId: "twiller-b9f61",
  storageBucket: "twiller-b9f61.firebasestorage.app",
  messagingSenderId: "260429371732",
  appId: "1:260429371732:web:3d46bf6f0df010a7b410c1",
  measurementId: "G-7K17LR6QBY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth(app)
export default app
