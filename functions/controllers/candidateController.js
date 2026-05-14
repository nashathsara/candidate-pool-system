const { auth, db } = require("../config/firebase");
const { 
  createUserWithEmailAndPassword, 
  sendEmailVerification,
  signInWithEmailAndPassword 
} = require("firebase/auth");
const { collection, addDoc, query, where, getDocs, doc, updateDoc } = require("firebase/firestore");
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

// candidateController.js
// 1. දැනට ලොග් වී සිටින යූසර්ගේ විස්තර ලබා ගැනීම
// const getCandidateProfile = async (req, res) => {
//   try {
//     const { uid } = req.params;
//     const q = query(collection(db, "candidates"), where("uid", "==", uid));
//     const snapshot = await getDocs(q);

//     if (snapshot.empty) {
//       return res.status(404).json({ status: "error", message: "User not found" });
//     }

//     const userData = snapshot.docs[0].data();
//     const docId = snapshot.docs[0].id;

//     res.status(200).json({ status: "success", data: { ...userData, docId } });
//   } catch (error) {
//     res.status(500).json({ status: "error", message: error.message });
//   }
// };

// // 2. විස්තර Update කිරීම (නිවැරදි කළ ක්‍රමය)
// const updateCandidateProfile = async (req, res) => {
//   try {
//     const { docId } = req.params;
//     const updateData = req.body;

//     // db.collection පාවිච්චි කරන්නේ නැතුව මේ විදිහට ලියන්න:
//     const candidateRef = doc(db, "candidates", docId);
//     await updateDoc(candidateRef, updateData);

//     res.status(200).json({ status: "success", message: "Profile updated successfully" });
//   } catch (error) {
//     console.error("Update Error:", error.message);
//     res.status(500).json({ status: "error", message: error.message });
//   }
// };

// candidateController.js

// candidateController.js

// 1. යූසර්ගේ ඊමේල් එක හරහා විස්තර ලබා ගැනීම (Get Profile)
// candidateController.js
// candidateController.js

const getCandidateProfile = async (req, res) => {
  try {
    const { email } = req.params; 
    const q = query(collection(db, "candidates"), where("email", "==", email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    const userData = snapshot.docs[0].data();
    res.status(200).json({ 
      status: "success", 
      data: { ...userData, docId: snapshot.docs[0].id } 
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

const updateCandidateProfile = async (req, res) => {
  try {
    const { email } = req.params;
    const updateData = req.body;

    const q = query(collection(db, "candidates"), where("email", "==", email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return res.status(404).json({ status: "error", message: "User not found." });
    }

    const docId = snapshot.docs[0].id;
    const candidateRef = doc(db, "candidates", docId);
    await updateDoc(candidateRef, updateData);

    res.status(200).json({ status: "success", message: "Profile updated successfully!" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
module.exports = { createCandidateProfile, signInCandidate, getCandidateProfile, updateCandidateProfile };
