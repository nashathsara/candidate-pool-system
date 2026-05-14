const { auth, db, admin } = require("../config/firebase");
const Candidate = require("../models/Candidate");
const { checkDuplicates } = require("../services/duplicateDetection");

// (Registration) ---
const createCandidateProfile = async (req, res) => {
  try {
    console.log("1. Registration started for:", req.body.email);
    const { email, password } = req.body;

    // 1) Check duplicates
    const newCandidate = new Candidate(req.body);
    const existingDuplicate = await checkDuplicates(newCandidate);

    if (existingDuplicate) {
      return res.status(200).json({
        status: "duplicate",
        message: "Exact match found in the system.",
        existingData: existingDuplicate,
      });
    }

    // 2) Create user (ADMIN SDK)
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: fullName,
    });

    // 3) Generate verification link (ADMIN SDK)
    const actionCodeSettings = {
      url: "http://localhost:5173/verified",
      handleCodeInApp: false,
    };

    // Generate email verification link
    const verificationLink = await auth.generateEmailVerificationLink(
      email,
      actionCodeSettings
    );

    // 4) Save candidate to Firestore (ADMIN SDK)
    const docRef = await db.collection("candidates").add({
      ...newCandidate,
      uid: userRecord.uid,
      isVerified: false,
      verificationLink, // optional: keep or remove
    });

    return res.status(201).json({
      status: "success",
      message: "Candidate profile created and verification link generated!",
      id: docRef.id,
      verificationLink, // optional: remove in production
    });
  } catch (error) {
    console.log("❌ CRITICAL ERROR:", error.message);
    console.error("Signup Error:", error.message);

    // firebase-admin errors
    if (error && error.code === "auth/email-already-exists") {
      return res.status(400).json({
        status: "error",
        message: "This email is already registered in Firebase Authentication.",
      });
    }

    return res.status(500).json({
      status: "error",
      message: error.message || "Internal server error",
    });
  }
};

module.exports = { createCandidateProfile };
