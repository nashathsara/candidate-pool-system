const admin = require('../config/firebase');
const db = admin.firestore();

const COLLABORATIONS_COLLECTION = 'collaborations';

// Add a comment
exports.addComment = async (req, res) => {
  try {
    const {
      candidateId,
      authorId,
      authorName,
      authorEmail,
      content,
      taggedUsers,
    } = req.body;

    if (!candidateId || !authorId || !content) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const collaborationRef = db
      .collection(COLLABORATIONS_COLLECTION)
      .doc(candidateId);
    const commentsRef = collaborationRef.collection('comments');

    const newComment = {
      candidateId,
      authorId,
      authorName,
      authorEmail,
      content,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      taggedUsers: taggedUsers || [],
      resolved: false,
    };

    const docRef = await commentsRef.add(newComment);

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: { id: docRef.id, ...newComment },
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add comment',
      error: error.message,
    });
  }
};

// Get comments for candidate
exports.getComments = async (req, res) => {
  try {
    const { candidateId } = req.params;

    if (!candidateId) {
      return res.status(400).json({
        success: false,
        message: 'Candidate ID is required',
      });
    }

    const collaborationRef = db
      .collection(COLLABORATIONS_COLLECTION)
      .doc(candidateId);
    const commentsRef = collaborationRef.collection('comments');

    const snapshot = await commentsRef.get();
    const comments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate(),
    }));

    res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch comments',
      error: error.message,
    });
  }
};

// Add rating
exports.addRating = async (req, res) => {
  try {
    const {
      candidateId,
      raterId,
      raterName,
      rating,
      category,
      comment,
    } = req.body;

    if (!candidateId || !raterId || !rating || !category) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const collaborationRef = db
      .collection(COLLABORATIONS_COLLECTION)
      .doc(candidateId);
    const ratingsRef = collaborationRef.collection('ratings');

    const newRating = {
      candidateId,
      raterId,
      raterName,
      rating,
      category,
      comment,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await ratingsRef.add(newRating);

    res.status(201).json({
      success: true,
      message: 'Rating added successfully',
      data: { id: docRef.id, ...newRating },
    });
  } catch (error) {
    console.error('Error adding rating:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add rating',
      error: error.message,
    });
  }
};

// Get ratings for candidate
exports.getRatings = async (req, res) => {
  try {
    const { candidateId } = req.params;

    if (!candidateId) {
      return res.status(400).json({
        success: false,
        message: 'Candidate ID is required',
      });
    }

    const collaborationRef = db
      .collection(COLLABORATIONS_COLLECTION)
      .doc(candidateId);
    const ratingsRef = collaborationRef.collection('ratings');

    const snapshot = await ratingsRef.get();
    const ratings = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate(),
    }));

    res.status(200).json({
      success: true,
      data: ratings,
    });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ratings',
      error: error.message,
    });
  }
};

// Get average rating
exports.getAverageRating = async (req, res) => {
  try {
    const { candidateId } = req.params;

    if (!candidateId) {
      return res.status(400).json({
        success: false,
        message: 'Candidate ID is required',
      });
    }

    const collaborationRef = db
      .collection(COLLABORATIONS_COLLECTION)
      .doc(candidateId);
    const ratingsRef = collaborationRef.collection('ratings');

    const snapshot = await ratingsRef.get();
    const ratings = snapshot.docs.map((doc) => doc.data());

    if (ratings.length === 0) {
      return res.status(200).json({
        success: true,
        data: { averageRating: 0, count: 0 },
      });
    }

    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    const averageRating = sum / ratings.length;

    res.status(200).json({
      success: true,
      data: {
        averageRating,
        count: ratings.length,
      },
    });
  } catch (error) {
    console.error('Error calculating average rating:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate average rating',
      error: error.message,
    });
  }
};

// Delete comment
exports.deleteComment = async (req, res) => {
  try {
    const { candidateId, commentId } = req.params;

    if (!candidateId || !commentId) {
      return res.status(400).json({
        success: false,
        message: 'Candidate ID and Comment ID are required',
      });
    }

    const collaborationRef = db
      .collection(COLLABORATIONS_COLLECTION)
      .doc(candidateId);
    const commentRef = collaborationRef.collection('comments').doc(commentId);

    await commentRef.delete();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete comment',
      error: error.message,
    });
  }
};

// Update comment
exports.updateComment = async (req, res) => {
  try {
    const { candidateId, commentId } = req.params;
    const updates = req.body;

    if (!candidateId || !commentId) {
      return res.status(400).json({
        success: false,
        message: 'Candidate ID and Comment ID are required',
      });
    }

    const collaborationRef = db
      .collection(COLLABORATIONS_COLLECTION)
      .doc(candidateId);
    const commentRef = collaborationRef.collection('comments').doc(commentId);

    await commentRef.update(updates);

    res.status(200).json({
      success: true,
      message: 'Comment updated successfully',
    });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update comment',
      error: error.message,
    });
  }
};
