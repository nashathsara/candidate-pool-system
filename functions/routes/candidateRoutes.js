const express = require('express');
const router = express.Router();
const { createCandidateProfile } = require('../controllers/candidateController');

router.post('/register', createCandidateProfile);

module.exports = router;