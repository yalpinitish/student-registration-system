
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import { getDatabase } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNFAPdPWc6SnF18fzQl2mcMugvGKyP7Js",
  authDomain: "student-registration-sys-adca5.firebaseapp.com",
  databaseURL: "https://student-registration-sys-adca5-default-rtdb.firebaseio.com",
  projectId: "student-registration-sys-adca5",
  storageBucket: "student-registration-sys-adca5.firebasestorage.app",
  messagingSenderId: "632318821593",
  appId: "1:632318821593:web:9ad552630706ef8607eac8",
  measurementId: "G-JSYBZBKXNG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
const auth = getAuth(app);

// Initialize Realtime Database
const db = getDatabase(app);

console.log("Firebase connected successfully");

// Export Firebase services
export { auth, db };
