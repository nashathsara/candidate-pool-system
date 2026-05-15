const express = require('express');
const router = express.Router();
const { 
    createCandidateProfile, 
    signInCandidate, 
    getCandidateProfile, 
    updateCandidateProfile,
    setUserRole
} = require('../controllers/candidateController');

router.post('/register', createCandidateProfile);

router.post('/login', signInCandidate);

router.get('/profile/:email', getCandidateProfile);
router.patch('/profile/update/:email', updateCandidateProfile);

// Admin endpoint to set user roles
router.post('/set-role', setUserRole);

module.exports = router;