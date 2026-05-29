// ===================================================================
// Firebase Admin SDK — Server-Side Only Initialization
// All Firebase credentials stay on the server, never exposed to client.
// ===================================================================

import * as admin from "firebase-admin";

let initialized = false;

export function initFirebase(): void {
  if (initialized) return;

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  if (serviceAccountJson) {
    // Parse inline JSON from environment variable (Render deployment)
    try {
      const serviceAccount = JSON.parse(serviceAccountJson);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (err) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:", err);
      process.exit(1);
    }
  } else if (serviceAccountPath) {
    // Load from file path (local development)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    console.error(
      "FATAL: No Firebase service account configured. Set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_PATH."
    );
    process.exit(1);
  }

  initialized = true;
  console.log("✅ Firebase Admin SDK initialized (server-side only)");
}

export function getFirestore(): admin.firestore.Firestore {
  return admin.firestore();
}

export function getAuth(): admin.auth.Auth {
  return admin.auth();
}
