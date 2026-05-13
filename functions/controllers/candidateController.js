const { db } = require("../config/firebase");
const {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} = require("firebase/firestore");
const Candidate = require("../models/Candidate");
const { checkDuplicates } = require("../services/duplicateDetection");

const candidateCollection = collection(db, "candidates");
const profileSettingsRef = doc(db, "candidateSettings", "profile");

const defaultProfileSettings = {
  fullName: "Alex Jordan",
  email: "alex.jordan@candidate.pulse",
  bio: "Recruitment administrator focused on maintaining a high-quality, verified candidate pool and supporting hiring teams with timely profile reviews.",
  profileVisibility: true,
  profilePhoto: "",
};

const withId = (candidateDoc) => ({
  id: candidateDoc.id,
  ...candidateDoc.data(),
});

const createCandidateProfile = async (req, res) => {
  try {
    const rawData = req.body;

    const newCandidate = new Candidate(rawData);

    const existingDuplicate = await checkDuplicates(newCandidate);

    if (existingDuplicate) {
 
      return res.status(200).json({
        status: "duplicate",
        message: "Exact match found in the system.",
        existingData: existingDuplicate
      });
    }

    const docRef = await addDoc(candidateCollection, {
      ...newCandidate
    });

    res.status(201).json({
      status: "success",
      message: "Candidate profile created successfully!",
      id: docRef.id
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

const listCandidateProfiles = async (_req, res) => {
  try {
    const snapshot = await getDocs(candidateCollection);
    res.status(200).json({
      status: "success",
      data: snapshot.docs.map(withId),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const getCandidateProfile = async (req, res) => {
  try {
    const candidateRef = doc(db, "candidates", req.params.id);
    const snapshot = await getDoc(candidateRef);

    if (!snapshot.exists()) {
      return res.status(404).json({
        status: "error",
        message: "Candidate profile not found.",
      });
    }

    res.status(200).json({
      status: "success",
      data: withId(snapshot),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const updateCandidateProfile = async (req, res) => {
  try {
    const candidateRef = doc(db, "candidates", req.params.id);
    const snapshot = await getDoc(candidateRef);

    if (!snapshot.exists()) {
      return res.status(404).json({
        status: "error",
        message: "Candidate profile not found.",
      });
    }

    const allowedFields = [
      "fullName",
      "email",
      "phone",
      "dob",
      "interestedField",
      "linkedinUrl",
      "status",
      "verificationStatus",
      "lastActiveLabel",
    ];

    const updates = allowedFields.reduce((next, field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        next[field] = req.body[field];
      }
      return next;
    }, {});

    await updateDoc(candidateRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    const updatedSnapshot = await getDoc(candidateRef);
    res.status(200).json({
      status: "success",
      message: "Candidate profile updated successfully.",
      data: withId(updatedSnapshot),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const getProfileSettings = async (_req, res) => {
  try {
    const snapshot = await getDoc(profileSettingsRef);
    res.status(200).json({
      status: "success",
      data: snapshot.exists()
        ? { ...defaultProfileSettings, ...snapshot.data() }
        : defaultProfileSettings,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const updateProfileSettings = async (req, res) => {
  try {
    const updates = {
      fullName: req.body.fullName || defaultProfileSettings.fullName,
      email: req.body.email || defaultProfileSettings.email,
      bio: req.body.bio || defaultProfileSettings.bio,
      profileVisibility:
        typeof req.body.profileVisibility === "boolean"
          ? req.body.profileVisibility
          : defaultProfileSettings.profileVisibility,
      profilePhoto:
        typeof req.body.profilePhoto === "string"
          ? req.body.profilePhoto
          : defaultProfileSettings.profilePhoto,
      updatedAt: new Date().toISOString(),
    };

    await setDoc(profileSettingsRef, updates, { merge: true });

    res.status(200).json({
      status: "success",
      message: "Profile settings updated successfully.",
      data: updates,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const updateProfilePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        status: "error",
        message: "Please complete all password fields.",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        status: "error",
        message: "New password must be at least 8 characters.",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        status: "error",
        message: "New password and confirmation do not match.",
      });
    }

    await setDoc(
      profileSettingsRef,
      { passwordUpdatedAt: new Date().toISOString() },
      { merge: true }
    );

    res.status(200).json({
      status: "success",
      message: "Password updated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  createCandidateProfile,
  getCandidateProfile,
  getProfileSettings,
  listCandidateProfiles,
  updateCandidateProfile,
  updateProfilePassword,
  updateProfileSettings,
};
