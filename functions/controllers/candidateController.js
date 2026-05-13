// const { auth, db } = require("../config/firebase");
// const { 
//   createUserWithEmailAndPassword, 
//   sendEmailVerification,
//   signInWithEmailAndPassword 
// } = require("firebase/auth"); // Firebase Auth functions
// const { collection, addDoc } = require("firebase/firestore");
// const Candidate = require("../models/Candidate");
// const { checkDuplicates } = require("../services/duplicateDetection");

// const createCandidateProfile = async (req, res) => {
//   try {
//     console.log("1. Registration started for:", req.body.email);
//     const { email, password, fullName } = req.body;

//     // 1. check user
//     const newCandidate = new Candidate(req.body);
//     const existingDuplicate = await checkDuplicates(newCandidate);

//     if (existingDuplicate) {
//       return res.status(200).json({
//         status: "duplicate",
//         message: "Exact match found in the system.",
//         existingData: existingDuplicate
//       });
//     }

//     const actionCodeSettings = {
//     url: 'http://localhost:5173/verified', 
//     handleCodeInApp: false,
//     };
//     // 2. create account Firebase Authentication 
//     // need password
//     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//     const user = userCredential.user;

//     // 3. send Verification Email for candidate
//     await sendEmailVerification(user, actionCodeSettings);

//     // 4. add data to Firestore  "candidates" collection 
//     const docRef = await addDoc(collection(db, "candidates"), {
//       ...newCandidate,
//       uid: user.uid, // Firebase Auth ID 
//       isVerified: false 
//     });

//     res.status(201).json({
//       status: "success",
//       message: "Candidate profile created and verification email sent!",
//       id: docRef.id
//     });

//   } catch (error) {
//     console.log("❌ CRITICAL ERROR:", error.message); 
//     console.error("Signup Error:", error.message);
    
//     if (error.code === 'auth/email-already-in-use') {
//         return res.status(400).json({
//             status: "error",
//             message: "This email is already registered in Firebase Authentication."
//         });
//     }

//     res.status(500).json({
//       status: "error",
//       message: error.message
//     });
//   }
// };
// // --- 2. ඇතුළු වීම (Sign In) ---
// const signInCandidate = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     console.log("Attempting sign in for:", email);

//     const userCredential = await signInWithEmailAndPassword(auth, email, password);
//     const user = userCredential.user;

//     // යූසර් ඊමේල් එක වෙරිෆයි කරලා නැත්නම් ලොග් වෙන්න ඉඩ දෙන්න එපා
//     if (!user.emailVerified) {
//       console.log("❌ Sign in blocked: Email not verified");
//       return res.status(403).json({
//         status: "unverified",
//         message: "Please verify your email before signing in."
//       });
//     }

//     console.log("✅ Sign in successful for:", email);
//     res.status(200).json({
//       status: "success",
//       message: "Welcome back!",
//       user: {
//         uid: user.uid,
//         email: user.email
//       }
//     });

//   } catch (error) {
//     console.log("❌ SIGNIN ERROR:", error.message);
//     let message = "Invalid email or password.";
    
//     if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
//       message = "Invalid login credentials.";
//     }

//     res.status(401).json({
//       status: "error",
//       message: message
//     });
//   }
// };

// module.exports = { createCandidateProfile, signInCandidate };



const { auth, db } = require("../config/firebase");
const { 
  createUserWithEmailAndPassword, 
  sendEmailVerification,
  signInWithEmailAndPassword 
} = require("firebase/auth");
const { collection, addDoc } = require("firebase/firestore");
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
      url: 'http://localhost:5173/verified', 
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

module.exports = { createCandidateProfile, signInCandidate };