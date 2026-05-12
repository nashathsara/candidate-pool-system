const { auth, db } = require("../config/firebase");
const { 
  createUserWithEmailAndPassword, 
  sendEmailVerification 
} = require("firebase/auth"); // Firebase Auth functions
const { collection, addDoc } = require("firebase/firestore");
const Candidate = require("../models/Candidate");
const { checkDuplicates } = require("../services/duplicateDetection");

const createCandidateProfile = async (req, res) => {
  try {
    console.log("1. Registration started for:", req.body.email);
    const { email, password, fullName } = req.body;

    // 1. check user
    const newCandidate = new Candidate(req.body);
    const existingDuplicate = await checkDuplicates(newCandidate);

    if (existingDuplicate) {
      return res.status(200).json({
        status: "duplicate",
        message: "Exact match found in the system.",
        existingData: existingDuplicate
      });
    }

    const actionCodeSettings = {
    url: 'http://localhost:5173/verified', 
    handleCodeInApp: false,
    };
    // 2. create account Firebase Authentication 
    // need password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 3. send Verification Email for candidate
    await sendEmailVerification(user, actionCodeSettings);

    // 4. add data to Firestore  "candidates" collection 
    const docRef = await addDoc(collection(db, "candidates"), {
      ...newCandidate,
      uid: user.uid, // Firebase Auth ID 
      isVerified: false 
    });

    res.status(201).json({
      status: "success",
      message: "Candidate profile created and verification email sent!",
      id: docRef.id
    });

  } catch (error) {
    console.log("❌ CRITICAL ERROR:", error.message); 
    console.error("Signup Error:", error.message);
    
    if (error.code === 'auth/email-already-in-use') {
        return res.status(400).json({
            status: "error",
            message: "This email is already registered in Firebase Authentication."
        });
    }

    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

module.exports = { createCandidateProfile };