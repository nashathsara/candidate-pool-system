const express = require('express');
const router = express.Router();
const { 
    createCandidateProfile, 
    signInCandidate, 
    getCandidateProfile, 
    updateCandidateProfile 
} = require('../controllers/candidateController');

// 1. ලියාපදිංචිය (Register)
router.post('/register', createCandidateProfile);

// 2. ඇතුළු වීම (Login)
router.post('/login', signInCandidate);

// candidateRoutes.js
router.get('/profile/:email', getCandidateProfile);
router.patch('/profile/update/:email', updateCandidateProfile);


module.exports = router;