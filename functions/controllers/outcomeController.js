const admin = require('../config/firebase');
const db = admin.firestore();

const OUTCOMES_COLLECTION = 'candidate_outcomes';
const OUTCOME_TIMELINE_COLLECTION = 'outcome_timeline';

// Initialize outcome for candidate
exports.initializeOutcome = async (req, res) => {
  try {
    const { candidateId } = req.body;

    if (!candidateId) {
      return res.status(400).json({
        success: false,
        message: 'Candidate ID is required',
      });
    }

    const outcome = {
      candidateId,
      status: 'pipeline',
      currentStage: 'initial_review',
      timeline: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection(OUTCOMES_COLLECTION).doc(candidateId).set(outcome);

    res.status(201).json({
      success: true,
      message: 'Outcome initialized successfully',
      data: outcome,
    });
  } catch (error) {
    console.error('Error initializing outcome:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initialize outcome',
      error: error.message,
    });
  }
};

// Get candidate outcome
exports.getCandidateOutcome = async (req, res) => {
  try {
    const { candidateId } = req.params;

    if (!candidateId) {
      return res.status(400).json({
        success: false,
        message: 'Candidate ID is required',
      });
    }

    const doc = await db
      .collection(OUTCOMES_COLLECTION)
      .doc(candidateId)
      .get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Outcome not found',
      });
    }

    const data = doc.data();
    res.status(200).json({
      success: true,
      data: {
        candidateId,
        ...data,
        decisionDate: data.decisionDate?.toDate(),
        hiringDate: data.hiringDate?.toDate(),
        startDate: data.startDate?.toDate(),
      },
    });
  } catch (error) {
    console.error('Error fetching outcome:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch outcome',
      error: error.message,
    });
  }
};

// Update candidate status
exports.updateCandidateStatus = async (req, res) => {
  try {
    const {
      candidateId,
      status,
      stage,
      updatedBy,
      updatedByName,
      notes,
    } = req.body;

    if (!candidateId || !status || !stage) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Add to timeline
    const timelineEntry = {
      candidateId,
      status,
      stage,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      notes,
      updatedBy,
      updatedByName,
    };

    const timelineId = `${candidateId}_${Date.now()}`;
    await db
      .collection(OUTCOME_TIMELINE_COLLECTION)
      .doc(timelineId)
      .set(timelineEntry);

    // Update main outcome
    await db.collection(OUTCOMES_COLLECTION).doc(candidateId).update({
      status,
      currentStage: stage,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      message: 'Candidate status updated successfully',
      data: timelineEntry,
    });
  } catch (error) {
    console.error('Error updating candidate status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update candidate status',
      error: error.message,
    });
  }
};

// Mark as hired
exports.markAsHired = async (req, res) => {
  try {
    const {
      candidateId,
      position,
      department,
      salary,
      startDate,
      hiringManagerName,
      updatedBy,
      updatedByName,
    } = req.body;

    if (!candidateId || !position || !department) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Add to timeline
    const timelineEntry = {
      candidateId,
      status: 'hired',
      stage: 'final',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      notes: `Hired for position: ${position}`,
      updatedBy,
      updatedByName,
    };

    const timelineId = `${candidateId}_hired_${Date.now()}`;
    await db
      .collection(OUTCOME_TIMELINE_COLLECTION)
      .doc(timelineId)
      .set(timelineEntry);

    // Update main outcome
    await db.collection(OUTCOMES_COLLECTION).doc(candidateId).update({
      status: 'hired',
      currentStage: 'final',
      finalDecision: 'hired',
      decisionDate: admin.firestore.FieldValue.serverTimestamp(),
      hiringDate: admin.firestore.Timestamp.fromDate(new Date(startDate)),
      hiringManagerName,
      position,
      department,
      salary,
      startDate: admin.firestore.Timestamp.fromDate(new Date(startDate)),
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      message: 'Candidate marked as hired successfully',
      data: timelineEntry,
    });
  } catch (error) {
    console.error('Error marking as hired:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark as hired',
      error: error.message,
    });
  }
};

// Mark as rejected
exports.markAsRejected = async (req, res) => {
  try {
    const {
      candidateId,
      reason,
      updatedBy,
      updatedByName,
    } = req.body;

    if (!candidateId || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Add to timeline
    const timelineEntry = {
      candidateId,
      status: 'rejected',
      stage: 'final',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      notes: reason,
      updatedBy,
      updatedByName,
    };

    const timelineId = `${candidateId}_rejected_${Date.now()}`;
    await db
      .collection(OUTCOME_TIMELINE_COLLECTION)
      .doc(timelineId)
      .set(timelineEntry);

    // Update main outcome
    await db.collection(OUTCOMES_COLLECTION).doc(candidateId).update({
      status: 'rejected',
      currentStage: 'final',
      finalDecision: 'rejected',
      decisionDate: admin.firestore.FieldValue.serverTimestamp(),
      decisionReason: reason,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      message: 'Candidate marked as rejected successfully',
      data: timelineEntry,
    });
  } catch (error) {
    console.error('Error marking as rejected:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark as rejected',
      error: error.message,
    });
  }
};

// Get hiring metrics
exports.getHiringMetrics = async (req, res) => {
  try {
    const snapshot = await db.collection(OUTCOMES_COLLECTION).get();

    const outcomes = snapshot.docs.map((doc) => ({
      candidateId: doc.id,
      ...doc.data(),
      decisionDate: doc.data().decisionDate?.toDate(),
      hiringDate: doc.data().hiringDate?.toDate(),
      startDate: doc.data().startDate?.toDate(),
    }));

    const hired = outcomes.filter((o) => o.status === 'hired').length;
    const rejected = outcomes.filter((o) => o.status === 'rejected').length;
    const withdrawn = outcomes.filter((o) => o.status === 'withdrawn').length;
    const interviewing = outcomes.filter((o) => o.status === 'interviewing').length;

    // Calculate average time to hire (placeholder)
    const avgTimeToHire = 30;

    // Build department breakdown
    const departmentMap = {};
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

    const metrics = {
      totalCandidatesProcessed: outcomes.length,
      hired,
      rejected,
      withdrawn,
      currentlyInterviewing: interviewing,
      averageTimeToHire: avgTimeToHire,
      offersPercentage:
        outcomes.length > 0 ? (hired / outcomes.length) * 100 : 0,
      acceptanceRate:
        outcomes.length > 0 ? (hired / outcomes.length) * 100 : 0,
      departmentBreakdown: departmentMap,
    };

    res.status(200).json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error('Error fetching hiring metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hiring metrics',
      error: error.message,
    });
  }
};
