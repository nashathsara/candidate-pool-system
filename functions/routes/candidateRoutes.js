const express = require('express');
const router = express.Router();
const {
  createCandidateProfile,
  getCandidateProfile,
  getProfileSettings,
  listCandidateProfiles,
  updateCandidateProfile,
  updateProfilePassword,
  updateProfileSettings,
} = require('../controllers/candidateController');

router.get('/', listCandidateProfiles);
router.post('/register', createCandidateProfile);
router.get('/settings/profile', getProfileSettings);
router.patch('/settings/profile', updateProfileSettings);
router.patch('/settings/password', updateProfilePassword);
router.get('/:id', getCandidateProfile);
router.patch('/:id', updateCandidateProfile);
router.patch('/:id/status', updateCandidateProfile);

module.exports = router;
