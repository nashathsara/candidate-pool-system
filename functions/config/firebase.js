const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: "../.env" });

// Initialize Firebase Admin once
let db;
let auth;

try {
  if (!admin.apps.length) {
    console.log("🔧 Initializing Firebase Admin SDK...");
    
    // Try to find the service account file
    const possiblePaths = [
      process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_PATH,
      path.join(__dirname, "..", "serviceAccountKey.json"),
      path.join(__dirname, "serviceAccountKey.json"),
      path.join(process.cwd(), "serviceAccountKey.json")
    ];
    
    let serviceAccountPath = null;
    let serviceAccount = null;
    
    // Find the first existing path
    for (const p of possiblePaths) {
      if (p && fs.existsSync(p)) {
        serviceAccountPath = p;
        console.log(`✅ Found service account at: ${serviceAccountPath}`);
        try {
          serviceAccount = require(serviceAccountPath);
          break;
        } catch (err) {
          console.error(`❌ Error loading from ${p}:`, err.message);
        }
      }
    }
    
    if (!serviceAccount) {
      console.error("❌ Service account file not found in any of these locations:");
      possiblePaths.forEach(p => console.error(`   - ${p}`));
      throw new Error("Service account key file is required. Please download it from Firebase Console.");
    }
    
    // Initialize the app
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("✅ Firebase Admin SDK initialized successfully");
  }
  
  // Get Firestore and Auth instances
  db = admin.firestore();
  auth = admin.auth();
  
  // Test the connection
  console.log("✅ Firestore instance created");
  console.log("✅ Auth instance created");
  
} catch (error) {
  console.error("❌ Firebase initialization error:", error.message);
  process.exit(1);
}

module.exports = { db, auth, admin };