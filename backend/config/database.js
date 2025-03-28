const admin = require("firebase-admin");

// Import Firebase configuration
const serviceAccount = require("../serviceAccountKey.json");

// Initialize Firebase Admin SDK (if not already initialized)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("✅ Firebase initialized!");
} else {
  console.log("⚠️ Firebase already initialized.");
}

// Firestore database instance
const db = admin.firestore();

module.exports = { db };
