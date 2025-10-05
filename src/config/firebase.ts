// src/config/firebase.ts
import * as admin from "firebase-admin";
import path from "path";
import { readFileSync } from "fs";

// Avoid re-initializing in Next.js hot reload
if (!admin.apps.length) {
  try {
    let credential: admin.credential.Credential;

    // Check if we have environment variables for Firebase credentials
    if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      // Use environment variables (preferred for production)
      const privateKey = process.env.FIREBASE_PRIVATE_KEY
        .replace(/\\n/g, '\n')
        .replace(/"/g, '')
        .trim();
      
      credential = admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID || "jmail-c6d93",
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      });
    } else {
      // Fallback to service account file (for development)
      const serviceAccountPath = path.join(process.cwd(), "jmail-c6d93-firebase-adminsdk-fbsvc-d56baad133.json");
      const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));
      credential = admin.credential.cert(serviceAccount as admin.ServiceAccount);
    }

    admin.initializeApp({
      credential,
      projectId: process.env.FIREBASE_PROJECT_ID || "jmail-c6d93",
    });

    console.log("Firebase Admin initialized successfully");
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error);
    throw new Error("Firebase initialization failed");
  }
}

export const db = admin.firestore();
export default admin;
