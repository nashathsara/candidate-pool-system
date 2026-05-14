const express = require('express');
const router = express.Router();
const { createCandidateProfile } = require('../controllers/candidateController');
const { signInCandidate } = require('../controllers/candidateController')

router.post('/register', createCandidateProfile);
router.post('/login', signInCandidate);

module.exports = router;