import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// TODO: Replace these placeholder credentials with your actual Firebase Configuration.
// You can get these details from your Firebase Console -> Project Settings -> General -> Web App.
const firebaseConfig = {
  apiKey: "AIzaSyCXrqW0VXXseVKOiygXYA5At6aZiqIH5dM",
  authDomain: "alaraportfolio-e750c.firebaseapp.com",
  projectId: "alaraportfolio-e750c",
  storageBucket: "alaraportfolio-e750c.firebasestorage.app",
  messagingSenderId: "862474406851",
  appId: "1:862474406851:web:3ad852f76c3422b15dcb76"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
