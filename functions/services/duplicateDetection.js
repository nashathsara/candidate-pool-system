// functions/services/duplicateDetection.js
const { db } = require("../config/firebase");

const checkDuplicates = async (candidate) => {
  try {
    console.log("Checking duplicates for email:", candidate.email);
    
    // Check for existing candidate with same email using Admin SDK
    const snapshot = await db.collection("candidates")
      .where("email", "==", candidate.email)
      .limit(1)
      .get();
    
    if (!snapshot.empty) {
      console.log("Duplicate found!");
      return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    }
    
    // Optional: Check by phone number if provided
    if (candidate.phone && candidate.phone !== "N/A") {
      const phoneSnapshot = await db.collection("candidates")
        .where("phone", "==", candidate.phone)
        .limit(1)
        .get();
      
      if (!phoneSnapshot.empty) {
        console.log("Duplicate found by phone number!");
        return { id: phoneSnapshot.docs[0].id, ...phoneSnapshot.docs[0].data() };
      }
    }
    
    console.log("No duplicate found");
    return null;
  } catch (error) {
    console.error("Error in checkDuplicates:", error.message);
    // Return null if there's an error (don't block registration)
    return null;
  }
};

module.exports = { checkDuplicates };