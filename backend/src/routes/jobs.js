const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { protect, requireOrg, optionalAuth } = require('../middleware/auth');

// ── GET /api/jobs — list with filters ────────────────────────────────────────
router.get('/', optionalAuth, async (req, res) => {
  const {
    page = 1, limit = 20, game, role, category, state, workType,
    locationType, search, featured, sort = 'recent'
  } = req.query;

  const query = { isActive: true };
  if (game)         query.gameId = game;
  if (role)         query.specificRole = new RegExp(role, 'i');
  if (category)     query.roleCategory = category;
  if (state)        query['location.state'] = state;
  if (workType)     query.workType = workType;
  if (locationType) query.locationType = locationType;
  if (featured)     query.isFeatured = true;
  if (search)       query.$text = { $search: search };

  const sortOptions = {
    recent:   { isFeatured: -1, createdAt: -1 },
    popular:  { applicantCount: -1, createdAt: -1 },
    deadline: { deadline: 1 },
  };

  const total = await Job.countDocuments(query);
  const jobs  = await Job.find(query)
    .sort(sortOptions[sort] || sortOptions.recent)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .lean();

  res.json({ success: true, total, page: Number(page), pages: Math.ceil(total / limit), data: jobs });
});

// ── GET /api/jobs/:id ─────────────────────────────────────────────────────────
router.get('/:id', optionalAuth, async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });
  job.views += 1;
  await job.save();
  res.json({ success: true, data: job });
});

// ── POST /api/jobs — create ───────────────────────────────────────────────────
router.post('/', protect, requireOrg, async (req, res) => {
  const slugify = require('slugify');
  const org = req.org;
  const body = req.body;

  const baseSlug = slugify(body.title, { lower: true, strict: true });
  let slug = `${baseSlug}-${Date.now()}`;

  const job = await Job.create({
    ...body,
    slug,
    postedBy: {
      type:    'organization',
      orgId:   org._id,
      orgName: org.orgName,
      orgLogo: org.logo,
    },
  });

  // Update org job counts
  const Organization = require('../models/Organization');
  await Organization.findByIdAndUpdate(org._id, { $inc: { totalJobs: 1, activeJobs: 1 } });

  res.status(201).json({ success: true, message: 'Job posted!', data: job });
});

// ── PUT /api/jobs/:id ─────────────────────────────────────────────────────────
router.put('/:id', protect, requireOrg, async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });
  if (String(job.postedBy.orgId) !== String(req.org._id)) {
    return res.status(403).json({ success: false, message: 'Not authorized.' });
  }
  Object.assign(job, req.body);
  await job.save();
  res.json({ success: true, data: job });
});

// ── DELETE /api/jobs/:id ──────────────────────────────────────────────────────
router.delete('/:id', protect, requireOrg, async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });
  if (String(job.postedBy.orgId) !== String(req.org._id)) {
    return res.status(403).json({ success: false, message: 'Not authorized.' });
  }
  job.isActive = false;
  await job.save();
  const Organization = require('../models/Organization');
  await Organization.findByIdAndUpdate(req.org._id, { $inc: { activeJobs: -1 } });
  res.json({ success: true, message: 'Job closed.' });
});

module.exports = router;
