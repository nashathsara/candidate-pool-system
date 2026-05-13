// const { db } = require("../config/firebase");
// const { collection, query, where, getDocs } = require("firebase/firestore");

// const checkDuplicates = async (candidate) => {
//   //check Exact match
//   const q = query(
//     collection(db, "candidates"),
//     where("fullName", "==", candidate.fullName),
//     where("dob", "==", candidate.dob),
//     where("phone", "==", candidate.phone)
//   );

//   const snapshot = await getDocs(q);
//   return !snapshot.empty ? snapshot.docs[0].data() : null; //get Duplicate
// };

// module.exports = { checkDuplicates };

// functions/services/duplicateDetection.js
const { db } = require("../config/firebase");
const { collection, query, where, getDocs } = require("firebase/firestore");

const checkDuplicates = async (candidate) => {
  // check email
  const q = query(
    collection(db, "candidates"),
    where("email", "==", candidate.email)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const duplicateDoc = snapshot.docs[0];
  return {
    id: duplicateDoc.id,
    ...duplicateDoc.data(),
  };
};

module.exports = { checkDuplicates };
