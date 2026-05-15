const { db, auth } = require("../config/firebase");
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

    const newCandidate = new Candidate(req.body);
    const existingDuplicate = await checkDuplicates(newCandidate);

    if (existingDuplicate) {
      return res.status(200).json({
        status: "duplicate",
        message: "Exact match found in the system.",
        existingData: existingDuplicate
      });
    }

    // Redirect URL
    const actionCodeSettings = {
      url: 'http://localhost:3000/verified', 
      handleCodeInApp: false,
    };

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await sendEmailVerification(user, actionCodeSettings);
    console.log("2. Verification email triggered with redirect settings");

    const docRef = await addDoc(collection(db, "candidates"), {
      ...newCandidate,
      uid: user.uid,
      isVerified: false 
    });

    res.status(201).json({
      status: "success",
      message: "Candidate profile created and verification email sent!",
      id: docRef.id
    });

  } catch (error) {
    console.log("❌ REGISTRATION ERROR:", error.message);
    if (error.code === 'auth/email-already-in-use') {
      return res.status(400).json({
        status: "error",
        message: "This email is already registered."
      });
    }
    res.status(500).json({ status: "error", message: error.message });
  }
};

//  (Sign In) ---
const signInCandidate = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Attempting sign in for:", email);

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      console.log("❌ Sign in blocked: Email not verified");
      return res.status(403).json({
        status: "unverified",
        message: "Please verify your email before signing in."
      });
    }

    console.log("✅ Sign in successful for:", email);
    res.status(200).json({
      status: "success",
      message: "Welcome back!",
      user: {
        uid: user.uid,
        email: user.email
      }
    });

  } catch (error) {
    console.log("❌ SIGNIN ERROR:", error.message);
    let message = "Invalid email or password.";
    
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      message = "Invalid login credentials.";
    }

    res.status(401).json({
      status: "error",
      message: message
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
    const candidatesRef = collection(db, "candidates");
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