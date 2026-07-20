// lib/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCQrsn1RVROyNdtigPVO7KgLqc7ApotEag",
  authDomain: "david-portfolio-71fcc.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "david-portfolio-71fcc",
  storageBucket: "david-portfolio-71fcc.firebasestorage.app",
  messagingSenderId: "903887227667",
  appId: "1:903887227667:web:af82248c4015a3795f68e6"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
