import { db } from '../config/firebase';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import type {
  Interview,
  InterviewFeedback,
  CandidateInterviewTrack,
} from '../utils/interviewTypes';

const INTERVIEWS_COLLECTION = 'interviews';
const INTERVIEW_TRACKS_COLLECTION = 'interview_tracks';

// Schedule interview
export const scheduleInterview = async (
  interview: Omit<Interview, 'id'>
): Promise<string> => {
  try {
    const newInterview = {
      ...interview,
      scheduledDate: Timestamp.fromDate(new Date(interview.scheduledDate)),
      status: 'scheduled',
    };
    const docRef = await addDoc(collection(db, INTERVIEWS_COLLECTION), newInterview);
    
    // Update interview track
    await updateInterviewTrack(interview.candidateId, interview.stage);
    
    return docRef.id;
  } catch (error) {
    console.error('Error scheduling interview:', error);
    throw error;
  }
};

// Get interviews for candidate
export const getInterviewsForCandidate = async (
  candidateId: string
): Promise<Interview[]> => {
  try {
    const q = query(
      collection(db, INTERVIEWS_COLLECTION),
      where('candidateId', '==', candidateId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as any),
      scheduledDate: doc.data().scheduledDate?.toDate() || new Date(),
    }));
  } catch (error) {
    console.error('Error fetching interviews:', error);
    throw error;
  }
};

// Update interview
export const updateInterview = async (
  interviewId: string,
  updates: Partial<Interview>
): Promise<void> => {
  try {
    const interviewRef = doc(db, INTERVIEWS_COLLECTION, interviewId);
    const processedUpdates = {
      ...updates,
      scheduledDate: updates.scheduledDate
        ? Timestamp.fromDate(new Date(updates.scheduledDate))
        : undefined,
    };
    await updateDoc(interviewRef, processedUpdates);
  } catch (error) {
    console.error('Error updating interview:', error);
    throw error;
  }
};

// Cancel interview
export const cancelInterview = async (interviewId: string): Promise<void> => {
  try {
    const interviewRef = doc(db, INTERVIEWS_COLLECTION, interviewId);
    await updateDoc(interviewRef, { status: 'cancelled' });
  } catch (error) {
    console.error('Error cancelling interview:', error);
    throw error;
  }
};

// Add interview feedback
export const addInterviewFeedback = async (
  interviewId: string,
  feedback: Omit<InterviewFeedback, 'timestamp'>
): Promise<void> => {
  try {
    const interviewRef = doc(db, INTERVIEWS_COLLECTION, interviewId);
    await updateDoc(interviewRef, {
      feedback: {
        ...feedback,
        timestamp: Timestamp.now(),
      },
      status: 'completed',
    });
  } catch (error) {
    console.error('Error adding interview feedback:', error);
    throw error;
  }
};

// Get interview track for candidate
export const getInterviewTrack = async (
  candidateId: string
): Promise<CandidateInterviewTrack | null> => {
  try {
    const trackRef = doc(db, INTERVIEW_TRACKS_COLLECTION, candidateId);
    const trackDoc = await (await import('firebase/firestore')).getDoc(trackRef);
    
    if (!trackDoc.exists()) {
      return null;
    }

    const data = trackDoc.data();
    return {
      candidateId,
      ...data,
      interviews: await getInterviewsForCandidate(candidateId),
    } as CandidateInterviewTrack;
  } catch (error) {
    console.error('Error fetching interview track:', error);
    throw error;
  }
};

// Update interview track
export const updateInterviewTrack = async (
  candidateId: string,
  currentStage: string
): Promise<void> => {
  try {
    const trackRef = doc(db, INTERVIEW_TRACKS_COLLECTION, candidateId);
    await updateDoc(trackRef, {
      currentStage,
      lastUpdated: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating interview track:', error);
    throw error;
  }
};

// Initialize interview track for new candidate
export const initializeInterviewTrack = async (candidateId: string): Promise<void> => {
  try {
    const trackRef = doc(db, INTERVIEW_TRACKS_COLLECTION, candidateId);
    await updateDoc(trackRef, {
      candidateId,
      currentStage: 'phone_screen',
      interviews: [],
      passedStages: [],
      failedStages: [],
      createdDate: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error initializing interview track:', error);
    throw error;
  }
};

// Mark interview stage as passed
export const markStagePassed = async (
  candidateId: string,
  stage: string
): Promise<void> => {
  try {
    const trackRef = doc(db, INTERVIEW_TRACKS_COLLECTION, candidateId);
    const track = await getInterviewTrack(candidateId);
    
    if (track) {
      const passedStages = [...(track.passedStages || []), stage];
      await updateDoc(trackRef, {
        passedStages,
        lastUpdated: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error('Error marking stage passed:', error);
    throw error;
  }
};

// Mark interview stage as failed
export const markStageFailed = async (
  candidateId: string,
  stage: string
): Promise<void> => {
  try {
    const trackRef = doc(db, INTERVIEW_TRACKS_COLLECTION, candidateId);
    const track = await getInterviewTrack(candidateId);
    
    if (track) {
      const failedStages = [...(track.failedStages || []), stage];
      await updateDoc(trackRef, {
        failedStages,
        lastUpdated: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error('Error marking stage failed:', error);
    throw error;
  }
};
