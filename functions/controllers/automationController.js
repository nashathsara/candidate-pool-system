const admin = require('../config/firebase');
const db = admin.firestore();

const AUTOMATION_RULES_COLLECTION = 'automation_rules';
const NOTIFICATIONS_COLLECTION = 'notifications';
const AUTOSHORTLIST_RULES_COLLECTION = 'autoshortlist_rules';

// Create automation rule
exports.createAutomationRule = async (req, res) => {
  try {
    const {
      name,
      description,
      enabled,
      createdBy,
      trigger,
      actions,
      conditions,
    } = req.body;

    if (!name || !trigger || !actions) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const newRule = {
      name,
      description,
      enabled,
      createdBy,
      trigger,
      actions,
      conditions,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db
      .collection(AUTOMATION_RULES_COLLECTION)
      .add(newRule);

    res.status(201).json({
      success: true,
      message: 'Automation rule created successfully',
      data: { id: docRef.id, ...newRule },
    });
  } catch (error) {
    console.error('Error creating automation rule:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create automation rule',
      error: error.message,
    });
  }
};

// Get all automation rules
exports.getAutomationRules = async (req, res) => {
  try {
    const snapshot = await db
      .collection(AUTOMATION_RULES_COLLECTION)
      .get();

    const rules = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
    }));

    res.status(200).json({
      success: true,
      data: rules,
    });
  } catch (error) {
    console.error('Error fetching automation rules:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch automation rules',
      error: error.message,
    });
  }
};

// Update automation rule
exports.updateAutomationRule = async (req, res) => {
  try {
    const { ruleId } = req.params;
    const updates = req.body;

    if (!ruleId) {
      return res.status(400).json({
        success: false,
        message: 'Rule ID is required',
      });
    }

    await db
      .collection(AUTOMATION_RULES_COLLECTION)
      .doc(ruleId)
      .update(updates);

    res.status(200).json({
      success: true,
      message: 'Automation rule updated successfully',
    });
  } catch (error) {
    console.error('Error updating automation rule:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update automation rule',
      error: error.message,
    });
  }
};

// Delete automation rule
exports.deleteAutomationRule = async (req, res) => {
  try {
    const { ruleId } = req.params;

    if (!ruleId) {
      return res.status(400).json({
        success: false,
        message: 'Rule ID is required',
      });
    }

    await db.collection(AUTOMATION_RULES_COLLECTION).doc(ruleId).delete();

    res.status(200).json({
      success: true,
      message: 'Automation rule deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting automation rule:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete automation rule',
      error: error.message,
    });
  }
};

// Create notification
exports.createNotification = async (req, res) => {
  try {
    const {
      candidateId,
      type,
      title,
      message,
      recipient,
    } = req.body;

    if (!candidateId || !type || !title || !message || !recipient) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const newNotification = {
      candidateId,
      type,
      title,
      message,
      recipient,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db
      .collection(NOTIFICATIONS_COLLECTION)
      .add(newNotification);

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: { id: docRef.id, ...newNotification },
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create notification',
      error: error.message,
    });
  }
};

// Get notifications for user
exports.getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50 } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }

    const snapshot = await db
      .collection(NOTIFICATIONS_COLLECTION)
      .where('recipient', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .get();

    const notifications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      sentDate: doc.data().sentDate?.toDate(),
    }));

    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message,
    });
  }
};

// Update notification status
exports.updateNotificationStatus = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { status, failureReason } = req.body;

    if (!notificationId || !status) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const updateData = {
      status,
      sentDate: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (failureReason) {
      updateData.failureReason = failureReason;
    }

    await db
      .collection(NOTIFICATIONS_COLLECTION)
      .doc(notificationId)
      .update(updateData);

    res.status(200).json({
      success: true,
      message: 'Notification status updated successfully',
    });
  } catch (error) {
    console.error('Error updating notification status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notification status',
      error: error.message,
    });
  }
};

// Create auto-shortlist rule
exports.createAutoShortlistRule = async (req, res) => {
  try {
    const {
      name,
      skillsRequired,
      minExperience,
      maxSalaryExpectation,
      minMatchPercentage,
      enabled,
    } = req.body;

    if (!name || !skillsRequired || minMatchPercentage === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const newRule = {
      name,
      skillsRequired,
      minExperience,
      maxSalaryExpectation,
      minMatchPercentage,
      enabled,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db
      .collection(AUTOSHORTLIST_RULES_COLLECTION)
      .add(newRule);

    res.status(201).json({
      success: true,
      message: 'Auto-shortlist rule created successfully',
      data: { id: docRef.id, ...newRule },
    });
  } catch (error) {
    console.error('Error creating auto-shortlist rule:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create auto-shortlist rule',
      error: error.message,
    });
  }
};

// Get auto-shortlist rules
exports.getAutoShortlistRules = async (req, res) => {
  try {
    const snapshot = await db
      .collection(AUTOSHORTLIST_RULES_COLLECTION)
      .where('enabled', '==', true)
      .get();

    const rules = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      data: rules,
    });
  } catch (error) {
    console.error('Error fetching auto-shortlist rules:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch auto-shortlist rules',
      error: error.message,
    });
  }
};
