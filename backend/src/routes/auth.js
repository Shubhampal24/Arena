const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Organization = require('../models/Organization');
const { protect } = require('../middleware/auth');

const generateTokens = (id, accountType) => {
  const access = jwt.sign({ id, accountType }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });
  const refresh = jwt.sign({ id, accountType }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, { expiresIn: '30d' });
  return { access, refresh };
};

// ── POST /api/auth/register/user ──────────────────────────────────────────────
router.post('/register/user', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('username').isLength({ min: 3, max: 30 }).matches(/^[a-zA-Z0-9_]+$/),
  body('displayName').notEmpty().trim(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  const { email, password, username, displayName, primaryRole, primaryGame, state, city } = req.body;

  const exists = await User.findOne({ $or: [{ email }, { username }] });
  if (exists) {
    const field = exists.email === email ? 'Email' : 'Username';
    return res.status(409).json({ success: false, message: `${field} already registered.` });
  }

  const user = await User.create({ email, password, username, displayName, primaryRole, primaryGame, state, city });
  const { access, refresh } = generateTokens(user._id, 'user');

  user.refreshTokens.push(refresh);
  await user.save({ validateBeforeSave: false });

  res.status(201).json({ success: true, message: 'Account created!', token: access, refreshToken: refresh, accountType: 'user', user: user.toPublicProfile() });
});

// ── POST /api/auth/register/org ───────────────────────────────────────────────
router.post('/register/org', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('orgName').notEmpty().trim(),
  body('orgType').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  const { email, password, orgName, orgType, description, state, city, activeGames, foundedYear } = req.body;

  const exists = await Organization.findOne({ email });
  if (exists) return res.status(409).json({ success: false, message: 'Email already registered.' });

  const slugify = require('slugify');
  const baseSlug = slugify(orgName, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;
  while (await Organization.findOne({ slug })) { slug = `${baseSlug}-${counter++}`; }

  const org = await Organization.create({ email, password, orgName, slug, orgType, description, state, city, activeGames, foundedYear });
  const { access, refresh } = generateTokens(org._id, 'organization');

  org.refreshTokens.push(refresh);
  await org.save({ validateBeforeSave: false });

  res.status(201).json({ success: true, message: 'Organization registered!', token: access, refreshToken: refresh, accountType: 'organization', org });
});

// ── POST /api/auth/login ──────────────────────────────────────────────────────
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  body('accountType').isIn(['user', 'organization']),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  const { email, password, accountType } = req.body;
  const isOrg = accountType === 'organization';

  const Model = isOrg ? Organization : User;
  const account = await Model.findOne({ email }).select('+password +refreshTokens');

  if (!account || !(await account.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  // Update last active for users
  if (!isOrg) { account.lastActive = new Date(); }

  const { access, refresh } = generateTokens(account._id, accountType);
  account.refreshTokens = account.refreshTokens.filter(t => {
    try { jwt.verify(t, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET); return true; }
    catch { return false; }
  }).slice(-5); // Keep max 5 refresh tokens
  account.refreshTokens.push(refresh);
  await account.save({ validateBeforeSave: false });

  const payload = isOrg ? account : account.toPublicProfile();
  res.json({ success: true, message: 'Welcome back! 🎮', token: access, refreshToken: refresh, accountType, [isOrg ? 'org' : 'user']: payload });
});

// ── POST /api/auth/refresh ────────────────────────────────────────────────────
router.post('/refresh', async (req, res) => {
  const { refreshToken, accountType } = req.body;
  if (!refreshToken) return res.status(401).json({ success: false, message: 'Refresh token required.' });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    const Model = accountType === 'organization' ? Organization : User;
    const account = await Model.findById(decoded.id).select('+refreshTokens');

    if (!account || !account.refreshTokens.includes(refreshToken)) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token.' });
    }

    const { access, refresh: newRefresh } = generateTokens(account._id, decoded.accountType);
    account.refreshTokens = account.refreshTokens.filter(t => t !== refreshToken);
    account.refreshTokens.push(newRefresh);
    await account.save({ validateBeforeSave: false });

    res.json({ success: true, token: access, refreshToken: newRefresh });
  } catch {
    res.status(401).json({ success: false, message: 'Refresh token expired or invalid.' });
  }
});

// ── POST /api/auth/logout ─────────────────────────────────────────────────────
router.post('/logout', protect, async (req, res) => {
  const { refreshToken } = req.body;
  const account = req.user || req.org;
  const Model = req.accountType === 'organization' ? Organization : User;

  if (refreshToken) {
    const acc = await Model.findById(account._id).select('+refreshTokens');
    acc.refreshTokens = acc.refreshTokens.filter(t => t !== refreshToken);
    await acc.save({ validateBeforeSave: false });
  }

  res.json({ success: true, message: 'Logged out successfully.' });
});

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
router.get('/me', protect, async (req, res) => {
  const account = req.user || req.org;
  res.json({ success: true, accountType: req.accountType, data: account });
});

module.exports = router;
