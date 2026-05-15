import { db } from '../config/firebase';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDocs,
  query,
  where,
  Timestamp,
  getDoc,
} from 'firebase/firestore';
import type {
  CandidateOutcome,
  OutcomeTimeline,
  HiringMetrics,
  DepartmentMetrics,
} from '../utils/outcomeTypes';

const OUTCOMES_COLLECTION = 'candidate_outcomes';
const OUTCOME_TIMELINE_COLLECTION = 'outcome_timeline';

// Initialize outcome for candidate
export const initializeOutcome = async (candidateId: string): Promise<void> => {
  try {
    const outcomeRef = doc(db, OUTCOMES_COLLECTION, candidateId);
    await setDoc(outcomeRef, {
      candidateId,
      status: 'pipeline',
      currentStage: 'initial_review',
      timeline: [],
      createdDate: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error initializing outcome:', error);
    throw error;
  }
};

// Get candidate outcome
export const getCandidateOutcome = async (
  candidateId: string
): Promise<CandidateOutcome | null> => {
  try {
    const outcomeRef = doc(db, OUTCOMES_COLLECTION, candidateId);
    const outcomeDoc = await getDoc(outcomeRef);

    if (!outcomeDoc.exists()) {
      return null;
    }

    const data = outcomeDoc.data();
    return {
      candidateId,
      status: data.status,
      currentStage: data.currentStage,
      finalDecision: data.finalDecision,
      decisionDate: data.decisionDate?.toDate(),
      decisionReason: data.decisionReason,
      hiringManagerName: data.hiringManagerName,
      hiringDate: data.hiringDate?.toDate(),
      position: data.position,
      department: data.department,
      salary: data.salary,
      startDate: data.startDate?.toDate(),
      timeline: data.timeline || [],
    } as CandidateOutcome;
  } catch (error) {
    console.error('Error fetching candidate outcome:', error);
    throw error;
  }
};

// Update candidate status
export const updateCandidateStatus = async (
  candidateId: string,
  status: string,
  stage: string,
  updatedBy: string,
  updatedByName: string,
  notes?: string
): Promise<void> => {
  try {
    const outcomeRef = doc(db, OUTCOMES_COLLECTION, candidateId);

    // Add to timeline
    const timelineEntry: OutcomeTimeline = {
      id: `${candidateId}_${Date.now()}`,
      candidateId,
      status,
      stage,
      timestamp: new Date(),
      notes,
      updatedBy,
      updatedByName,
    };

    const timelineRef = collection(db, OUTCOME_TIMELINE_COLLECTION);
    await setDoc(doc(timelineRef, timelineEntry.id), {
      ...timelineEntry,
      timestamp: Timestamp.now(),
    });

    // Update main outcome
    await updateDoc(outcomeRef, {
      status,
      currentStage: stage,
      lastUpdated: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating candidate status:', error);
    throw error;
  }
};

// Mark candidate as hired
export const markAsHired = async (
  candidateId: string,
  hireData: {
    position: string;
    department: string;
    salary: number;
    startDate: Date;
    hiringManagerName: string;
  },
  updatedBy: string,
  updatedByName: string
): Promise<void> => {
  try {
    const outcomeRef = doc(db, OUTCOMES_COLLECTION, candidateId);

    // Add to timeline
    const timelineEntry: OutcomeTimeline = {
      id: `${candidateId}_hired_${Date.now()}`,
      candidateId,
      status: 'hired',
      stage: 'final',
      timestamp: new Date(),
      updatedBy,
      updatedByName,
      notes: `Hired for position: ${hireData.position}`,
    };

    const timelineRef = collection(db, OUTCOME_TIMELINE_COLLECTION);
    await setDoc(doc(timelineRef, timelineEntry.id), {
      ...timelineEntry,
      timestamp: Timestamp.now(),
    });

    // Update main outcome
    await updateDoc(outcomeRef, {
      status: 'hired',
      currentStage: 'final',
      finalDecision: 'hired',
      decisionDate: Timestamp.now(),
      hiringDate: Timestamp.fromDate(hireData.startDate),
      hiringManagerName: hireData.hiringManagerName,
      position: hireData.position,
      department: hireData.department,
      salary: hireData.salary,
      startDate: Timestamp.fromDate(hireData.startDate),
      lastUpdated: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error marking candidate as hired:', error);
    throw error;
  }
};

// Mark candidate as rejected
export const markAsRejected = async (
  candidateId: string,
  reason: string,
  updatedBy: string,
  updatedByName: string
): Promise<void> => {
  try {
    const outcomeRef = doc(db, OUTCOMES_COLLECTION, candidateId);

    // Add to timeline
    const timelineEntry: OutcomeTimeline = {
      id: `${candidateId}_rejected_${Date.now()}`,
      candidateId,
      status: 'rejected',
      stage: 'final',
      timestamp: new Date(),
      updatedBy,
      updatedByName,
      notes: reason,
    };

    const timelineRef = collection(db, OUTCOME_TIMELINE_COLLECTION);
    await setDoc(doc(timelineRef, timelineEntry.id), {
      ...timelineEntry,
      timestamp: Timestamp.now(),
    });

    // Update main outcome
    await updateDoc(outcomeRef, {
      status: 'rejected',
      currentStage: 'final',
      finalDecision: 'rejected',
      decisionDate: Timestamp.now(),
      decisionReason: reason,
      lastUpdated: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error marking candidate as rejected:', error);
    throw error;
  }
};

// Get timeline for candidate
export const getCandidateTimeline = async (
  candidateId: string
): Promise<OutcomeTimeline[]> => {
  try {
    const q = query(
      collection(db, OUTCOME_TIMELINE_COLLECTION),
      where('candidateId', '==', candidateId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      ...(doc.data() as any),
      timestamp: doc.data().timestamp?.toDate() || new Date(),
    })) as OutcomeTimeline[];
  } catch (error) {
    console.error('Error fetching timeline:', error);
    throw error;
  }
};

// Get hiring metrics
export const getHiringMetrics = async (): Promise<HiringMetrics> => {
  try {
    const snapshot = await getDocs(collection(db, OUTCOMES_COLLECTION));
    const outcomes: CandidateOutcome[] = snapshot.docs.map((doc) => ({
      ...(doc.data() as any),
      decisionDate: doc.data().decisionDate?.toDate(),
      hiringDate: doc.data().hiringDate?.toDate(),
      startDate: doc.data().startDate?.toDate(),
    }));

    const hired = outcomes.filter((o) => o.status === 'hired').length;
    const rejected = outcomes.filter((o) => o.status === 'rejected').length;
    const withdrawn = outcomes.filter((o) => o.status === 'withdrawn').length;
    const interviewing = outcomes.filter((o) => o.status === 'interviewing').length;

    // Calculate average time to hire
    const hiredWithDates = outcomes
      .filter((o) => o.status === 'hired' && o.hiringDate)
      .map((o) => ({
        ...o,
        hiringDate: o.hiringDate || new Date(),
      }));

    const avgTimeToHire =
      hiredWithDates.length > 0
        ? hiredWithDates.reduce((sum, o) => {
            const createdDate = new Date(o.currentStage); // Approximate
            const daysToHire =
              (o.hiringDate!.getTime() - createdDate.getTime()) /
              (1000 * 60 * 60 * 24);
            return sum + daysToHire;
          }, 0) / hiredWithDates.length
        : 0;

    // Build department breakdown
    const departmentMap: Record<string, DepartmentMetrics> = {};
    outcomes.forEach((o) => {
      const dept = o.department || 'Unknown';
      if (!departmentMap[dept]) {
        departmentMap[dept] = {
          department: dept,
          totalCandidates: 0,
          hired: 0,
          rejected: 0,
          avgTimeToHire: 0,
        };
      }
      departmentMap[dept].totalCandidates++;
      if (o.status === 'hired') departmentMap[dept].hired++;
      if (o.status === 'rejected') departmentMap[dept].rejected++;
    });

    return {
      totalCandidatesProcessed: outcomes.length,
      hired,
      rejected,
      withdrawn,
      currentlyInterviewing: interviewing,
      averageTimeToHire: Math.round(avgTimeToHire),
      offersPercentage: outcomes.length > 0 ? (hired / outcomes.length) * 100 : 0,
      acceptanceRate: outcomes.length > 0 ? (hired / outcomes.length) * 100 : 0,
      departmentBreakdown: departmentMap,
    };
  } catch (error) {
    console.error('Error fetching hiring metrics:', error);
    throw error;
  }
};
