const express = require('express');
const router = express.Router();
const { 
  createCandidateProfile, 
  signInCandidate,
  verifyEmail,
  resendVerification,
  getStats,  
  getRecentJobs,
  getCandidateProfile,  // Add this
  getCandidateStats,    // Add this
  getRecentActivity 
} = require('../controllers/candidateController');

router.post('/register', createCandidateProfile);
router.post('/login', signInCandidate);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
// Homepage routes
router.get('/stats', getStats);
router.get('/recent-jobs', getRecentJobs);

// Candidate routes
router.get('/profile/:email', getCandidateProfile);
router.get('/stats/:uid', getCandidateStats);
router.get('/activity/:uid', getRecentActivity);

module.exports = router;