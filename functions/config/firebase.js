const admin = require("firebase-admin");
const path = require("path");
require("dotenv").config({ path: "../.env" });

// Initialize Firebase Admin once
if (!admin.apps.length) {
  const serviceAccountPath = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_PATH
    ? process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_PATH
    : path.join(__dirname, "..", "serviceAccountKey.json");

  const serviceAccount = require(serviceAccountPath);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth, admin };
