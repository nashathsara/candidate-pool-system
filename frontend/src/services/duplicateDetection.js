// src/services/duplicateDetection.js
import { db } from '../config/firebase'; // Fixed import path
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  doc,
  getDoc,
  limit,
  runTransaction,
  serverTimestamp
} from 'firebase/firestore';

// Generate ticket ID
const generateTicketId = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `TICKET-${timestamp}-${random}`;
};

// Calculate name similarity (optimized)
export const calculateNameSimilarity = (name1, name2) => {
  if (!name1 || !name2) return 0;
  
  const clean1 = name1.toLowerCase().replace(/[^a-z]/g, '');
  const clean2 = name2.toLowerCase().replace(/[^a-z]/g, '');
  
  if (clean1 === clean2) return 100;
  if (clean1.includes(clean2) || clean2.includes(clean1)) return 85;
  
  // Quick check for length difference
  if (Math.abs(clean1.length - clean2.length) > 10) return 0;
  
  const distance = levenshteinDistance(clean1, clean2);
  const maxLength = Math.max(clean1.length, clean2.length);
  const similarity = (maxLength - distance) / maxLength;
  
  return Math.round(similarity * 100);
};

const levenshteinDistance = (str1, str2) => {
  if (str1.length === 0) return str2.length;
  if (str2.length === 0) return str1.length;
  
  let prev = Array(str2.length + 1).fill(0);
  let curr = Array(str2.length + 1).fill(0);
  
  for (let j = 0; j <= str2.length; j++) {
    prev[j] = j;
  }
  
  for (let i = 1; i <= str1.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= str2.length; j++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        curr[j - 1] + 1,
        prev[j] + 1,
        prev[j - 1] + indicator
      );
    }
    [prev, curr] = [curr, prev];
  }
  
  return prev[str2.length];
};

// Optimized duplicate check - single query approach
export const findDuplicatesOptimized = async (candidateData) => {
  console.log('Optimized duplicate check for:', candidateData.email);
  
  let existingCandidate = null;
  let matchDetails = {
    email: false,
    phone: false,
    name: 0
  };
  
  try {
    // Check email first (most reliable)
    if (candidateData.email) {
      const emailQuery = query(
        collection(db, 'candidates'),
        where('email', '==', candidateData.email.toLowerCase()),
        limit(1)
      );
      const emailSnapshot = await getDocs(emailQuery);
      
      if (!emailSnapshot.empty) {
        const doc = emailSnapshot.docs[0];
        existingCandidate = { id: doc.id, ...doc.data() };
        matchDetails.email = true;
        matchDetails.name = calculateNameSimilarity(existingCandidate.fullName || '', candidateData.fullName || '');
        
        console.log('Email match found, confidence high');
        return {
          isDuplicate: true,
          existingCandidate,
          matchDetails,
          confidenceScore: 95
        };
      }
    }
    
    // Check phone if no email match
    if (!existingCandidate && candidateData.phone) {
      const phoneQuery = query(
        collection(db, 'candidates'),
        where('phone', '==', candidateData.phone),
        limit(1)
      );
      const phoneSnapshot = await getDocs(phoneQuery);
      
      if (!phoneSnapshot.empty) {
        const doc = phoneSnapshot.docs[0];
        existingCandidate = { id: doc.id, ...doc.data() };
        matchDetails.phone = true;
        matchDetails.name = calculateNameSimilarity(existingCandidate.fullName || '', candidateData.fullName || '');
        
        console.log('Phone match found');
        return {
          isDuplicate: true,
          existingCandidate,
          matchDetails,
          confidenceScore: matchDetails.name > 80 ? 90 : 70
        };
      }
    }
    
    // Quick name check if no contact match
    if (!existingCandidate && candidateData.fullName && candidateData.fullName.length > 3) {
      const nameQuery = query(
        collection(db, 'candidates'),
        where('fullName', '>=', candidateData.fullName.substring(0, 3)),
        where('fullName', '<=', candidateData.fullName.substring(0, 3) + '\uf8ff'),
        limit(20)
      );
      
      const nameSnapshot = await getDocs(nameQuery);
      let bestMatch = null;
      let bestSimilarity = 0;
      
      nameSnapshot.forEach(doc => {
        const candidate = { id: doc.id, ...doc.data() };
        const similarity = calculateNameSimilarity(candidateData.fullName, candidate.fullName || '');
        
        if (similarity > 70 && similarity > bestSimilarity) {
          bestMatch = candidate;
          bestSimilarity = similarity;
        }
      });
      
      if (bestMatch && bestSimilarity > 80) {
        existingCandidate = bestMatch;
        matchDetails.name = bestSimilarity;
        
        console.log('High name similarity match found:', bestSimilarity);
        return {
          isDuplicate: true,
          existingCandidate,
          matchDetails,
          confidenceScore: bestSimilarity
        };
      }
      
      if (bestMatch && bestSimilarity > 60) {
        return {
          isDuplicate: false,
          requiresReview: true,
          potentialMatch: bestMatch,
          matchDetails,
          confidenceScore: bestSimilarity
        };
      }
    }
    
    // No duplicate found
    return {
      isDuplicate: false,
      requiresReview: false,
      confidenceScore: 0
    };
    
  } catch (error) {
    console.error('Error in findDuplicatesOptimized:', error);
    throw error;
  }
};

// Optimized save with transaction
export const saveNewCandidateOptimized = async (candidateData) => {
  try {
    console.log('Saving new candidate to Firestore:', candidateData.fullName);
    
    const candidateDoc = {
      fullName: candidateData.fullName || '',
      email: candidateData.email?.toLowerCase() || '',
      phone: candidateData.phone || '',
      appliedRole: candidateData.appliedRole || '',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {
        source: candidateData.metadata?.source || 'manual',
        duplicateCheckPerformed: true,
        checkDate: new Date()
      }
    };

    // Add CV data if available
    if (candidateData.cvData) {
      candidateDoc.cvData = {
        fileName: candidateData.cvData.fileName || '',
        fileUrl: candidateData.cvData.fileUrl || '',
        skills: candidateData.cvData.skills?.slice(0, 20) || [],
        experience: candidateData.cvData.experience || '',
        education: candidateData.cvData.education || []
      };
    }

    const docRef = await addDoc(collection(db, 'candidates'), candidateDoc);
    
    console.log('Candidate saved with ID:', docRef.id);
    
    return { 
      id: docRef.id, 
      ...candidateDoc 
    };
    
  } catch (error) {
    console.error('Error saving candidate:', error);
    throw error;
  }
};

// Create duplicate review ticket
export const createDuplicateTicket = async (existingCandidate, newCandidateData, confidenceScore, matchDetails) => {
  try {
    const ticketId = generateTicketId();
    
    const ticketData = {
      ticketId,
      primaryCandidateId: existingCandidate.id,
      duplicateCandidateId: null, // Will be set when we save the duplicate
      duplicateCandidateData: {
        fullName: newCandidateData.fullName || '',
        email: newCandidateData.email || '',
        phone: newCandidateData.phone || '',
        appliedRole: newCandidateData.appliedRole || '',
        source: newCandidateData.metadata?.source || 'manual'
      },
      confidenceScore: confidenceScore || 0,
      matchFields: {
        email: matchDetails.email || false,
        phone: matchDetails.phone || false,
        name: {
          similarity: matchDetails.name || 0
        }
      },
      status: 'pending',
      createdAt: new Date(),
      resolvedAt: null,
      resolvedBy: null,
      action: null,
      notes: ''
    };
    
    const docRef = await addDoc(collection(db, 'duplicate_tickets'), ticketData);
    console.log('Duplicate ticket created:', ticketId);
    
    return { id: docRef.id, ...ticketData };
    
  } catch (error) {
    console.error('Error creating duplicate ticket:', error);
    throw error;
  }
};

// Main optimized function to process new candidate
export const processNewCandidate = async (candidateData) => {
  const startTime = Date.now();
  
  try {
    console.log('Processing candidate (optimized):', candidateData.fullName);
    
    // Validate required fields
    if (!candidateData.fullName || !candidateData.email) {
      throw new Error('Missing required fields: fullName and email are required');
    }
    
    // Step 1: Quick duplicate check
    const duplicateResult = await findDuplicatesOptimized(candidateData);
    
    console.log(`Duplicate check took ${Date.now() - startTime}ms`);
    
    // Step 2: Handle duplicate found
    if (duplicateResult.isDuplicate && duplicateResult.existingCandidate) {
      // Create review ticket
      const ticket = await createDuplicateTicket(
        duplicateResult.existingCandidate,
        candidateData,
        duplicateResult.confidenceScore,
        duplicateResult.matchDetails
      );
      
      return {
        success: false,
        isDuplicate: true,
        requiresReview: true,
        ticket,
        existingCandidate: duplicateResult.existingCandidate,
        confidenceScore: duplicateResult.confidenceScore,
        matches: duplicateResult.matchDetails
      };
    }
    
    // Step 3: Handle medium confidence
    if (duplicateResult.requiresReview) {
      return {
        success: false,
        isDuplicate: false,
        requiresReview: true,
        potentialMatch: duplicateResult.potentialMatch,
        confidenceScore: duplicateResult.confidenceScore,
        message: 'Potential duplicate found. Please review before saving.'
      };
    }
    
    // Step 4: No duplicate - save the candidate
    console.log('No duplicate found. Saving candidate...');
    const newCandidate = await saveNewCandidateOptimized(candidateData);
    
    console.log(`Total processing time: ${Date.now() - startTime}ms`);
    
    return {
      success: true,
      isDuplicate: false,
      requiresReview: false,
      candidate: newCandidate,
      message: 'Candidate submitted successfully!'
    };
    
  } catch (error) {
    console.error('Error processing candidate:', error);
    console.log(`Failed after ${Date.now() - startTime}ms`);
    
    return {
      success: false,
      error: error.message,
      message: 'Failed to process candidate. Please try again.'
    };
  }
};

// Helper functions
export const getAllCandidates = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'candidates'));
    const candidates = [];
    querySnapshot.forEach((doc) => {
      candidates.push({ id: doc.id, ...doc.data() });
    });
    return candidates;
  } catch (error) {
    console.error('Error getting candidates:', error);
    return [];
  }
};

export const getCandidateById = async (candidateId) => {
  try {
    const docRef = doc(db, 'candidates', candidateId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting candidate:', error);
    return null;
  }
};

export const getPendingDuplicateTickets = async () => {
  try {
    const q = query(
      collection(db, 'duplicate_tickets'),
      where('status', '==', 'pending'),
      limit(50)
    );
    const querySnapshot = await getDocs(q);
    const tickets = [];
    querySnapshot.forEach((doc) => {
      tickets.push({ id: doc.id, ...doc.data() });
    });
    return tickets;
  } catch (error) {
    console.error('Error getting tickets:', error);
    return [];
  }
};