const { db } = require("../config/firebase"); 
const { collection, addDoc } = require("firebase/firestore");
const Candidate = require("../models/Candidate");
const { checkDuplicates } = require("../services/duplicateDetection");

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

    const docRef = await addDoc(collection(db, "candidates"), {
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

module.exports = { createCandidateProfile };