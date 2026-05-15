const { auth, db, admin } = require("../config/firebase");
const Candidate = require("../models/Candidate");
const { checkDuplicates } = require("../services/duplicateDetection");
const { sendVerificationEmail } = require("../services/emailService");

const createCandidateProfile = async (req, res) => {
  try {
    console.log("1. Registration started for:", req.body.email);
    console.log("Full request body:", req.body);
    
    const { email, password, fullName } = req.body;

    // Check if fullName exists
    if (!fullName) {
      return res.status(400).json({
        status: "error",
        message: "Full name is required"
      });
    }

    // Check if email exists
    if (!email) {
      return res.status(400).json({
        status: "error",
        message: "Email is required"
      });
    }

    // Check if password exists
    if (!password) {
      return res.status(400).json({
        status: "error",
        message: "Password is required"
      });
    }

    // 1) Check duplicates in Firestore
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
    console.log("Attempting to create user in Firebase Auth...");
    let userRecord;
    try {
      userRecord = await auth.createUser({
        email,
        password,
        displayName: fullName,
        emailVerified: false
      });
      console.log("User created successfully:", userRecord.uid);
    } catch (authError) {
      console.log("Firebase Auth error:", authError.code, authError.message);
      
      if (authError.code === "auth/email-already-exists") {
        return res.status(400).json({
          status: "error",
          message: "This email is already registered. Please sign in instead.",
          code: "EMAIL_EXISTS"
        });
      }
      
      throw authError;
    }

    // 3) Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`Generated verification code: ${verificationCode}`);
    
    // Store verification code in Firestore with expiry (10 minutes)
    await db.collection('emailVerifications').doc(userRecord.uid).set({
      code: verificationCode,
      email: email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    // 4) Send verification email
    try {
      await sendVerificationEmail(email, verificationCode);
      console.log("Verification email sent successfully to:", email);
    } catch (emailError) {
      console.error("Failed to send email:", emailError.message);
      // Don't fail the registration if email fails, just log it
    }

    // 5) Save candidate to Firestore
    const candidateData = {
      fullName: fullName,
      email: email,
      uid: userRecord.uid,
      isVerified: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: "pending"
    };
    
    const docRef = await db.collection("candidates").add(candidateData);
    console.log("Candidate saved to Firestore:", docRef.id);

    return res.status(201).json({
      status: "success",
      message: "Registration successful! Verification code sent to your email.",
      id: docRef.id,
      // Include for development only
      devVerificationCode: verificationCode
    });
    
  } catch (error) {
    console.log("❌ CRITICAL ERROR:", error);
    console.error("Signup Error:", error.message);
    console.error("Error code:", error.code);

    if (error.code === "auth/email-already-exists") {
      return res.status(400).json({
        status: "error",
        message: "This email is already registered. Please sign in.",
        code: "EMAIL_EXISTS"
      });
    }

    return res.status(500).json({
      status: "error",
      message: error.message || "Internal server error",
      code: error.code
    });
  }
};

// Sign In function (added this)
const signInCandidate = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email and password are required"
      });
    }

    // Note: With Admin SDK, we can't verify passwords directly
    // We can only check if the user exists
    try {
      const userRecord = await auth.getUserByEmail(email);
      
      return res.status(200).json({
        status: "success",
        message: "User found. Please use Firebase Client SDK to sign in.",
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName
      });
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        return res.status(401).json({
          status: "error",
          message: "Invalid email or password"
        });
      }
      throw error;
    }
  } catch (error) {
    console.error("Sign in error:", error.message);
    return res.status(500).json({
      status: "error",
      message: error.message || "Internal server error"
    });
  }
};

// Get all candidates
const getCandidates = async (req, res) => {
  try {
    const candidatesSnapshot = await db.collection("candidates").get();
    const candidates = [];
    candidatesSnapshot.forEach(doc => {
      candidates.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json({
      status: "success",
      data: candidates
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

// Get candidate by ID
const getCandidateById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection("candidates").doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({
        status: "error",
        message: "Candidate not found"
      });
    }
    
    res.status(200).json({
      status: "success",
      data: { id: doc.id, ...doc.data() }
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

// Update candidate
const updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    await db.collection("candidates").doc(id).update({
      ...updates,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.status(200).json({
      status: "success",
      message: "Candidate updated successfully"
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

// Delete candidate
const deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    
    // First get the candidate to get the uid
    const candidateDoc = await db.collection("candidates").doc(id).get();
    
    if (!candidateDoc.exists) {
      return res.status(404).json({
        status: "error",
        message: "Candidate not found"
      });
    }
    
    const candidateData = candidateDoc.data();
    
    // Delete from Firestore
    await db.collection("candidates").doc(id).delete();
    
    // Delete from Firebase Auth (if uid exists)
    if (candidateData.uid) {
      try {
        await auth.deleteUser(candidateData.uid);
      } catch (authError) {
        console.error("Error deleting auth user:", authError.message);
        // Continue even if auth deletion fails
      }
    }
    
    res.status(200).json({
      status: "success",
      message: "Candidate deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};
// Add these functions to your candidateController.js

// Verify email with code - UPDATED VERSION
const verifyEmail = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;
    
    console.log(`Verifying email: ${email} with code: ${verificationCode}`);
    
    // Get user from Firebase Auth by email
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(email);
      console.log(`Found user: ${userRecord.uid}`);
    } catch (error) {
      console.error("User not found in Auth:", error.message);
      return res.status(404).json({
        status: "error",
        message: "User not found. Please register first."
      });
    }
    
    // Check if user has a pending verification code in Firestore
    const verificationDoc = await db.collection('emailVerifications')
      .doc(userRecord.uid)
      .get();
    
    console.log("Verification document exists:", verificationDoc.exists);
    
    if (!verificationDoc.exists) {
      return res.status(400).json({
        status: "error",
        message: "No verification request found. Please request a new code."
      });
    }
    
    const verificationData = verificationDoc.data();
    console.log("Stored code:", verificationData.code);
    console.log("Entered code:", verificationCode);
    console.log("Expires at:", verificationData.expiresAt);
    console.log("Current time:", Date.now());
    
    // Check if code has expired
    if (verificationData.expiresAt < Date.now()) {
      console.log("Code has expired");
      await db.collection('emailVerifications').doc(userRecord.uid).delete();
      return res.status(400).json({
        status: "error",
        message: "Verification code has expired. Please request a new one."
      });
    }
    
    // Check if code matches (convert both to strings for comparison)
    if (String(verificationData.code) === String(verificationCode)) {
      console.log("Code matches! Verifying user...");
      
      // Update user as verified in Firebase Auth
      await auth.updateUser(userRecord.uid, {
        emailVerified: true
      });
      
      // Update candidate in Firestore
      const candidatesSnapshot = await db.collection('candidates')
        .where('uid', '==', userRecord.uid)
        .limit(1)
        .get();
      
      if (!candidatesSnapshot.empty) {
        const candidateDoc = candidatesSnapshot.docs[0];
        await candidateDoc.ref.update({
          isVerified: true,
          verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
          status: "active"
        });
        console.log("Updated candidate in Firestore");
      }
      
      // Delete verification document
      await db.collection('emailVerifications').doc(userRecord.uid).delete();
      console.log("Verification successful!");
      
      return res.status(200).json({
        status: "success",
        message: "Email verified successfully! You can now sign in."
      });
    } else {
      console.log("Code mismatch!");
      return res.status(400).json({
        status: "error",
        message: "Invalid verification code. Please try again."
      });
    }
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Verification failed"
    });
  }
};

const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    
    console.log(`Resending verification code to: ${email}`);
    
    // Get user by email
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(email);
    } catch (error) {
      return res.status(404).json({
        status: "error",
        message: "User not found"
      });
    }
    
    // Generate new 6-digit code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`New verification code for ${email}: ${verificationCode}`);
    
    // Store verification code in Firestore
    await db.collection('emailVerifications').doc(userRecord.uid).set({
      code: verificationCode,
      email: email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes expiry
    });
    
    // Send verification email
    try {
      await sendVerificationEmail(email, verificationCode);
      console.log("Verification email sent successfully to:", email);
    } catch (emailError) {
      console.error("Failed to send email:", emailError.message);
      return res.status(500).json({
        status: "error",
        message: "Failed to send verification email. Please try again."
      });
    }
    
    return res.status(200).json({
      status: "success",
      message: "Verification code sent successfully to your email!",
      devVerificationCode: verificationCode // For development
    });
  } catch (error) {
    console.error("Resend error:", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Failed to resend code"
    });
  }
};

// Add these functions to your candidateController.js

// Get stats for homepage
const getStats = async (req, res) => {
  try {
    // Get total candidates count
    const candidatesSnapshot = await db.collection('candidates').count().get();
    const totalCandidates = candidatesSnapshot.data().count;
    
    // Get unique countries (you'll need to store country in candidate data)
    const countriesSnapshot = await db.collection('candidates').select('country').get();
    const uniqueCountries = new Set();
    countriesSnapshot.forEach(doc => {
      if (doc.data().country) uniqueCountries.add(doc.data().country);
    });
    
    res.status(200).json({
      status: "success",
      data: {
        totalFreelancers: `${Math.floor(totalCandidates / 1000000)}M+`,
        countries: `${uniqueCountries.size || 220}+`,
        satisfaction: "98%"
      }
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

// Get recent jobs (you'll need to create a jobs collection)
const getRecentJobs = async (req, res) => {
  try {
    // For now, return mock data
    res.status(200).json({
      status: "success",
      data: []
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

// Add these functions to your candidateController.js

// Get candidate profile by email
const getCandidateProfile = async (req, res) => {
  try {
    const { email } = req.params;
    
    const candidatesSnapshot = await db.collection('candidates')
      .where('email', '==', email)
      .limit(1)
      .get();
    
    if (candidatesSnapshot.empty) {
      return res.status(404).json({
        status: "error",
        message: "Candidate not found"
      });
    }
    
    const candidate = candidatesSnapshot.docs[0];
    res.status(200).json({
      status: "success",
      data: { id: candidate.id, ...candidate.data() }
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

// Get candidate stats
const getCandidateStats = async (req, res) => {
  try {
    const { uid } = req.params;
    
    // Get saved jobs count
    const savedJobsSnapshot = await db.collection('savedJobs')
      .where('candidateId', '==', uid)
      .count()
      .get();
    
    // Get applications count
    const applicationsSnapshot = await db.collection('applications')
      .where('candidateId', '==', uid)
      .count()
      .get();
    
    // Get messages count
    const messagesSnapshot = await db.collection('messages')
      .where('recipientId', '==', uid)
      .where('read', '==', false)
      .count()
      .get();
    
    res.status(200).json({
      status: "success",
      data: {
        savedJobs: savedJobsSnapshot.data().count || 0,
        applications: applicationsSnapshot.data().count || 0,
        messages: messagesSnapshot.data().count || 0,
        unreadMessages: messagesSnapshot.data().count || 0,
        profileStrength: "92%"
      }
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

// Get recent activity
const getRecentActivity = async (req, res) => {
  try {
    const { uid } = req.params;
    
    // Get recent applications
    const applicationsSnapshot = await db.collection('applications')
      .where('candidateId', '==', uid)
      .orderBy('appliedAt', 'desc')
      .limit(5)
      .get();
    
    const activities = [];
    applicationsSnapshot.forEach(doc => {
      activities.push({
        type: 'application',
        text: `Applied to ${doc.data().jobTitle}`,
        time: formatTime(doc.data().appliedAt)
      });
    });
    
    res.status(200).json({
      status: "success",
      data: activities
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

// Helper function to format time
function formatTime(timestamp) {
  if (!timestamp) return 'Recently';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours} hours ago`;
  return `${Math.floor(hours / 24)} days ago`;
}


// Add to module.exports
module.exports = { 
  createCandidateProfile,
  signInCandidate,
  verifyEmail,
  resendVerification,
  getCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
  getStats, 
  getRecentJobs,
  getCandidateProfile,  // Add this
  getCandidateStats,    // Add this
  getRecentActivity   
};

