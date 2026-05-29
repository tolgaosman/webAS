import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { initializeAppCheck, ReCaptchaV3Provider } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-check.js";

// Firebase Configuration (Public config, secured via Database/Storage Rules)
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

// Initialize Firebase App Check (reCAPTCHA v3 integration)
// Initialize Firebase App Check (reCAPTCHA v3 integration)
// Protects the app from bot traffic, curl requests, and API abuse.
// Only enabled in production to prevent 403 errors during local testing on 127.0.0.1
if (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
  try {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider("6LcmiAItAAAAAEn68HCQE7hZWSFIOSw17-7_cu7-"),
      isTokenAutoRefreshEnabled: true
    });
    console.log("App Check initialized (Production Mode).");
  } catch (appCheckError) {
    console.warn("App Check initialization failed:", appCheckError);
  }
} else {
  console.log("Local development detected: Firebase App Check bypassed.");
}

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
