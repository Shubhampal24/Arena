const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const { protect, requireUser, requireOrg } = require('../middleware/auth');

// Apply for a job
router.post('/:jobId', protect, requireUser, async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job || !job.isActive) return res.status(404).json({ success: false, message: 'Job not found or closed.' });
  
  const exists = await Application.findOne({ jobId: req.params.jobId, userId: req.user._id });
  if (exists) return res.status(409).json({ success: false, message: 'Already applied.' });

  const app = await Application.create({
    jobId:  req.params.jobId,
    userId: req.user._id,
    orgId:  job.postedBy.orgId,
    ...req.body,
    statusHistory: [{ status: 'submitted', note: 'Application submitted' }],
  });

  await Job.findByIdAndUpdate(req.params.jobId, { $inc: { applicantCount: 1 } });
  res.status(201).json({ success: true, message: 'Application submitted!', data: app });
});

// Get my applications (user)
router.get('/my', protect, requireUser, async (req, res) => {
  const apps = await Application.find({ userId: req.user._id }).populate('jobId', 'title gameName specificRole postedBy');
  res.json({ success: true, data: apps });
});

// Get applications for a job (org)
router.get('/job/:jobId', protect, requireOrg, async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job || String(job.postedBy.orgId) !== String(req.org._id)) {
    return res.status(403).json({ success: false, message: 'Not authorized.' });
  }
  const apps = await Application.find({ jobId: req.params.jobId }).populate('userId', 'username displayName avatar primaryRole gameProfiles state city openToWork profileScore');
  res.json({ success: true, data: apps });
});

// Update application status (org)
router.put('/:appId/status', protect, requireOrg, async (req, res) => {
  const app = await Application.findById(req.params.appId);
  if (!app) return res.status(404).json({ success: false, message: 'Application not found.' });
  app.status = req.body.status;
  app.statusHistory.push({ status: req.body.status, note: req.body.note });
  if (req.body.orgNotes) app.orgNotes = req.body.orgNotes;
  await app.save();
  res.json({ success: true, data: app });
});

module.exports = router;