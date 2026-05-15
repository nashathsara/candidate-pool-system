const { db } = require("../config/firebase");
const { collection, addDoc, query, where, getDocs, doc, getDoc, updateDoc } = require("firebase/firestore");
const Candidate = require("../models/Candidate");
const { checkDuplicates } = require("../services/duplicateDetection");

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

    // Create the user using Firebase Identity Toolkit REST API
    const apiKey = process.env.FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY;
    if (!apiKey) {
      throw new Error("Firebase API key not configured on the server.");
    }

    const signUpUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;
    const signUpResponse = await fetch(signUpUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true })
    });

    const signUpData = await signUpResponse.json();
    if (!signUpResponse.ok) {
      const errorCode = signUpData.error?.message;
      if (errorCode === 'EMAIL_EXISTS') {
        return res.status(400).json({
          status: 'error',
          message: 'This email is already registered.'
        });
      }
      throw new Error(signUpData.error?.message || 'Unable to create user account.');
    }

    const localId = signUpData.localId;
    const idToken = signUpData.idToken;

    // Send email verification via REST API
    const actionCodeSettings = {
      url: 'http://localhost:5173/verified',
      handleCodeInApp: false,
    };
    const sendOobCodeUrl = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`;
    const sendOobResponse = await fetch(sendOobCodeUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requestType: 'VERIFY_EMAIL',
        idToken,
        returnSecureToken: true
      })
    });
    const sendOobData = await sendOobResponse.json();
    if (!sendOobResponse.ok) {
      console.log('❌ VERIFICATION EMAIL ERROR:', sendOobData);
      throw new Error('Unable to send verification email.');
    }

    const docRef = await addDoc(collection(db, "candidates"), {
      ...newCandidate,
      uid: localId,
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

const signInCandidate = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Attempting sign in for:", email);

    const apiKey = process.env.FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY;
    if (!apiKey) {
      throw new Error("Firebase API key not configured on the server.");
    }

    const signInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
    const signInResponse = await fetch(signInUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true })
    });

    const signInData = await signInResponse.json();

    if (!signInResponse.ok) {
      const errorCode = signInData.error?.message;
      let message = 'Invalid email or password.';

      if (errorCode === 'EMAIL_NOT_FOUND' || errorCode === 'INVALID_PASSWORD') {
        message = 'Invalid login credentials.';
      } else if (errorCode === 'USER_DISABLED') {
        message = 'User account has been disabled.';
      }

      console.log('❌ SIGNIN ERROR:', errorCode || signInData);
      return res.status(401).json({ status: 'error', message });
    }

    const idToken = signInData.idToken;
    const lookupUrl = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`;
    const lookupResponse = await fetch(lookupUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken })
    });

    const lookupData = await lookupResponse.json();
    if (!lookupResponse.ok) {
      console.log('❌ SIGNIN LOOKUP ERROR:', lookupData);
      return res.status(500).json({ status: 'error', message: 'Unable to verify user account.' });
    }

    const userRecord = lookupData.users?.[0];
    if (!userRecord) {
      return res.status(404).json({ status: 'error', message: 'User not found.' });
    }

    if (!userRecord.emailVerified) {
      console.log('❌ Sign in blocked: Email not verified');
      return res.status(403).json({ status: 'unverified', message: 'Please verify your email before signing in.' });
    }

    let role = 'candidate';
    if (userRecord.customAttributes) {
      try {
        const attrs = JSON.parse(userRecord.customAttributes);
        if (attrs.role) {
          role = attrs.role;
        }
      } catch (parseError) {
        console.log('⚠️ Unable to parse customAttributes for user role:', parseError.message);
      }
    }

    if (userRecord.email) {
      try {
        // Check adminProfiles collection first
        const adminQuery = query(collection(db, 'adminProfiles'), where('email', '==', userRecord.email));
        const adminSnapshot = await getDocs(adminQuery);
        if (!adminSnapshot.empty) {
          const adminData = adminSnapshot.docs[0].data();
          if (adminData.role) {
            role = adminData.role;
            console.log('✅ Found user in adminProfiles with role:', role);
          }
        } else {
          // If not admin, check candidates collection
          const candidatesQuery = query(collection(db, 'candidates'), where('email', '==', userRecord.email));
          const candidatesSnapshot = await getDocs(candidatesQuery);
          if (!candidatesSnapshot.empty) {
            const candidateData = candidatesSnapshot.docs[0].data();
            if (candidateData.userRole) {
              role = candidateData.userRole;
              console.log('✅ Found user in candidates with role:', role);
            }
          }
        }
      } catch (docError) {
        console.log('⚠️ Error reading user doc for role:', docError.message);
      }
    }

    console.log('✅ Sign in successful for:', email, 'role:', role);
    res.status(200).json({
      status: 'success',
      message: 'Welcome back!',
      role,
      user: {
        uid: userRecord.localId,
        email: userRecord.email,
      },
      idToken,
    });

  } catch (error) {
    console.log('❌ SIGNIN ERROR:', error);
    const message = error?.message || 'Invalid email or password.';
    res.status(500).json({ status: 'error', message });
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

// Set user role (admin endpoint)
const setUserRole = async (req, res) => {
  try {
    const { email, userRole } = req.body;

    if (!email || !userRole) {
      return res.status(400).json({ 
        status: "error", 
        message: "Email and userRole are required." 
      });
    }

    const validRoles = ['admin', 'recruiter', 'hiring_manager', 'candidate'];
    if (!validRoles.includes(userRole)) {
      return res.status(400).json({ 
        status: "error", 
        message: `Invalid role. Must be one of: ${validRoles.join(', ')}` 
      });
    }

    const q = query(collection(db, 'candidates'), where('email', '==', email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return res.status(404).json({ 
        status: "error", 
        message: "Candidate not found." 
      });
    }

    const docId = snapshot.docs[0].id;
    const candidateRef = doc(db, 'candidates', docId);
    await updateDoc(candidateRef, { userRole });

    console.log(`✅ Set role for ${email} to ${userRole}`);
    res.status(200).json({ 
      status: "success", 
      message: `User role updated to ${userRole}` 
    });
  } catch (error) {
    console.log('❌ SET ROLE ERROR:', error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = { createCandidateProfile, signInCandidate, getCandidateProfile, updateCandidateProfile, setUserRole };