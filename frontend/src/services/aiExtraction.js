// src/services/aiExtraction.js
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

// Upload file to Firebase Storage
export const uploadToStorage = async (file, path) => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
};

// Extract data from CV using AI
export const extractCVWithAI = async (file) => {
  return new Promise((resolve) => {
    // Simulate AI processing delay
    setTimeout(() => {
      // Mock extracted data - in production, replace with actual AI API call
      const mockExtraction = {
        fullName: "Anne Piyula Arulpirabakar",
        email: "anne@gmail.com",
        phone: "0745637829",
        appliedRole: "Senior Systems Architect",
        skills: ["React", "Node.js", "TypeScript", "AWS", "MongoDB"],
        experience: "8 years",
        education: ["MSc Computer Science", "BSc Software Engineering"],
        previousCompanies: ["Tech Corp", "Innovate Inc"],
        rawText: "Extracted text from CV...",
        confidenceScore: 0.95
      };
      
      resolve(mockExtraction);
    }, 2000);
  });
};