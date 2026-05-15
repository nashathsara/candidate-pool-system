const express = require('express');
const router = express.Router();
const { 
    createCandidateProfile, 
    signInCandidate, 
    getCandidateProfile, 
    updateCandidateProfile 
} = require('../controllers/candidateController');

router.post('/register', createCandidateProfile);

router.post('/login', signInCandidate);

router.get('/profile/:email', getCandidateProfile);
router.patch('/profile/update/:email', updateCandidateProfile);


module.exports = router;