const express = require('express');
const router = express.Router();
const { protect, requireOrg, optionalAuth } = require('../middleware/auth');
const jobController = require('../controllers/jobController');

// ── GET /api/jobs — list with filters ────────────────────────────────────────
router.get('/', optionalAuth, jobController.getJobs);

// ── GET /api/jobs/:id ─────────────────────────────────────────────────────────
router.get('/:id', optionalAuth, jobController.getJobById);

// ── POST /api/jobs — create ───────────────────────────────────────────────────
router.post('/', protect, requireOrg, jobController.createJob);

// ── PUT /api/jobs/:id ─────────────────────────────────────────────────────────
router.put('/:id', protect, requireOrg, jobController.updateJob);

// ── DELETE /api/jobs/:id ──────────────────────────────────────────────────────
router.delete('/:id', protect, requireOrg, jobController.deleteJob);

module.exports = router;

