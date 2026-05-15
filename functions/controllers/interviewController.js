const admin = require('../config/firebase');
const db = admin.firestore();

const INTERVIEWS_COLLECTION = 'interviews';
const INTERVIEW_TRACKS_COLLECTION = 'interview_tracks';

// Schedule an interview
exports.scheduleInterview = async (req, res) => {
  try {
    const {
      candidateId,
      scheduledBy,
      scheduledByName,
      stage,
      scheduledDate,
      duration,
      interviewer,
      interviewerName,
      location,
      meetingLink,
      description,
    } = req.body;

    if (
      !candidateId ||
      !stage ||
      !scheduledDate ||
      !interviewer
    ) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const newInterview = {
      candidateId,
      scheduledBy,
      scheduledByName,
      stage,
      scheduledDate: new Date(scheduledDate),
      duration,
      interviewer,
      interviewerName,
      location,
      meetingLink,
      description,
      status: 'scheduled',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db
      .collection(INTERVIEWS_COLLECTION)
      .add(newInterview);

    // Update interview track
    await updateInterviewTrack(candidateId, stage);

    res.status(201).json({
      success: true,
      message: 'Interview scheduled successfully',
      data: { id: docRef.id, ...newInterview },
    });
  } catch (error) {
    console.error('Error scheduling interview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to schedule interview',
      error: error.message,
    });
  }
};

// Get interviews for a candidate
exports.getInterviewsForCandidate = async (req, res) => {
  try {
    const { candidateId } = req.params;

    if (!candidateId) {
      return res.status(400).json({
        success: false,
        message: 'Candidate ID is required',
      });
    }

    const snapshot = await db
      .collection(INTERVIEWS_COLLECTION)
      .where('candidateId', '==', candidateId)
      .orderBy('scheduledDate', 'desc')
      .get();

    const interviews = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      scheduledDate: doc.data().scheduledDate?.toDate(),
    }));

    res.status(200).json({
      success: true,
      data: interviews,
    });
  } catch (error) {
    console.error('Error fetching interviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch interviews',
      error: error.message,
    });
  }
};

// Add interview feedback
exports.addInterviewFeedback = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const {
      technicalScore,
      communicationScore,
      cultureFitScore,
      overallScore,
      feedbackText,
      recommendedForNextRound,
      interviewerName,
    } = req.body;

    if (!interviewId || !overallScore || !feedbackText) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const feedback = {
      interviewId,
      technicalScore,
      communicationScore,
      cultureFitScore,
      overallScore,
      feedbackText,
      recommendedForNextRound,
      interviewerName,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection(INTERVIEWS_COLLECTION).doc(interviewId).update({
      feedback,
      status: 'completed',
    });

    res.status(200).json({
      success: true,
      message: 'Feedback added successfully',
      data: feedback,
    });
  } catch (error) {
    console.error('Error adding feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add feedback',
      error: error.message,
    });
  }
};

// Cancel interview
exports.cancelInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;

    if (!interviewId) {
      return res.status(400).json({
        success: false,
        message: 'Interview ID is required',
      });
    }

    await db.collection(INTERVIEWS_COLLECTION).doc(interviewId).update({
      status: 'cancelled',
    });

    res.status(200).json({
      success: true,
      message: 'Interview cancelled successfully',
    });
  } catch (error) {
    console.error('Error cancelling interview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel interview',
      error: error.message,
    });
  }
};

// Helper function to update interview track
async function updateInterviewTrack(candidateId, currentStage) {
  try {
    const trackRef = db
      .collection(INTERVIEW_TRACKS_COLLECTION)
      .doc(candidateId);
    const trackDoc = await trackRef.get();

    if (!trackDoc.exists()) {
      await trackRef.set({
        candidateId,
        currentStage,
        interviews: [],
        passedStages: [],
        failedStages: [],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      await trackRef.update({
        currentStage,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('Error updating interview track:', error);
    throw error;
  }
}
