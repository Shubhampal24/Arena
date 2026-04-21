const express = require('express');
const router = express.Router();
const { protect, requireUser, requireOrg } = require('../middleware/auth');
const applicationController = require('../controllers/applicationController');

// Apply for a job
router.post('/:jobId', protect, requireUser, applicationController.applyForJob);

// Get my applications (user)
router.get('/my', protect, requireUser, applicationController.getMyApplications);

// Get applications for a job (org)
router.get('/job/:jobId', protect, requireOrg, applicationController.getJobApplications);

// Update application status (org)
router.put('/:appId/status', protect, requireOrg, applicationController.updateApplicationStatus);

module.exports = router;