import { db } from '../config/firebase';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import type {
  Comment,
  CandidateRating,
  Collaboration,
} from '../utils/collaborationTypes';

const COLLABORATIONS_COLLECTION = 'collaborations';

// Add a comment
export const addComment = async (
  candidateId: string,
  comment: Omit<Comment, 'id' | 'timestamp'>
): Promise<string> => {
  try {
    const collaborationRef = doc(db, COLLABORATIONS_COLLECTION, candidateId);
    const commentsRef = collection(collaborationRef, 'comments');
    const newComment = {
      ...comment,
      timestamp: Timestamp.now(),
    };
    const docRef = await addDoc(commentsRef, newComment);
    return docRef.id;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Get comments for a candidate
export const getComments = async (candidateId: string): Promise<Comment[]> => {
  try {
    const collaborationRef = doc(db, COLLABORATIONS_COLLECTION, candidateId);
    const commentsRef = collection(collaborationRef, 'comments');
    const snapshot = await getDocs(commentsRef);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as any),
      timestamp: doc.data().timestamp?.toDate() || new Date(),
    }));
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

// Update comment
export const updateComment = async (
  candidateId: string,
  commentId: string,
  updates: Partial<Comment>
): Promise<void> => {
  try {
    const collaborationRef = doc(db, COLLABORATIONS_COLLECTION, candidateId);
    const commentRef = doc(collection(collaborationRef, 'comments'), commentId);
    await updateDoc(commentRef, updates);
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
};

// Delete comment
export const deleteComment = async (
  candidateId: string,
  commentId: string
): Promise<void> => {
  try {
    const collaborationRef = doc(db, COLLABORATIONS_COLLECTION, candidateId);
    const commentRef = doc(collection(collaborationRef, 'comments'), commentId);
    await deleteDoc(commentRef);
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

// Add rating
export const addRating = async (
  candidateId: string,
  rating: Omit<CandidateRating, 'timestamp'>
): Promise<string> => {
  try {
    const collaborationRef = doc(db, COLLABORATIONS_COLLECTION, candidateId);
    const ratingsRef = collection(collaborationRef, 'ratings');
    const newRating = {
      ...rating,
      timestamp: Timestamp.now(),
    };
    const docRef = await addDoc(ratingsRef, newRating);
    return docRef.id;
  } catch (error) {
    console.error('Error adding rating:', error);
    throw error;
  }
};

// Get ratings for a candidate
export const getRatings = async (candidateId: string): Promise<CandidateRating[]> => {
  try {
    const collaborationRef = doc(db, COLLABORATIONS_COLLECTION, candidateId);
    const ratingsRef = collection(collaborationRef, 'ratings');
    const snapshot = await getDocs(ratingsRef);
    return snapshot.docs.map((doc) => ({
      ...(doc.data() as any),
      timestamp: doc.data().timestamp?.toDate() || new Date(),
    }));
  } catch (error) {
    console.error('Error fetching ratings:', error);
    throw error;
  }
};

// Calculate average rating
export const getAverageRating = async (candidateId: string): Promise<number> => {
  try {
    const ratings = await getRatings(candidateId);
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    return sum / ratings.length;
  } catch (error) {
    console.error('Error calculating average rating:', error);
    throw error;
  }
};

// Get collaboration data for candidate
export const getCollaboration = async (candidateId: string): Promise<Collaboration> => {
  try {
    const comments = await getComments(candidateId);
    const ratings = await getRatings(candidateId);

    return {
      candidateId,
      comments,
      ratings,
      teamMembers: [], // Will be populated from admin users
      lastUpdated: new Date(),
    };
  } catch (error) {
    console.error('Error fetching collaboration data:', error);
    throw error;
  }
};
