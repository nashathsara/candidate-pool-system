// functions/src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// GET request to fetch data when the settings page loads
router.get('/profile/:uid', adminController.getAdminProfile);

// PATCH request for updating profile form details
router.patch('/update-profile', adminController.updateAdminProfile);

// POST request for password changes
router.post('/change-password', adminController.changePassword);

module.exports = router;