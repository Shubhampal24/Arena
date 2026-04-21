const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const authController = require('../controllers/authController');

// ── POST /api/auth/register/user ──────────────────────────────────────────────
router.post('/register/user', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('username').isLength({ min: 3, max: 30 }).matches(/^[a-zA-Z0-9_]+$/),
  body('displayName').notEmpty().trim(),
], authController.registerUser);

// ── POST /api/auth/register/org ───────────────────────────────────────────────
router.post('/register/org', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('orgName').notEmpty().trim(),
  body('orgType').notEmpty(),
], authController.registerOrg);

// ── POST /api/auth/login ──────────────────────────────────────────────────────
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  body('accountType').isIn(['user', 'organization']),
], authController.loginUser);

// ── POST /api/auth/refresh ────────────────────────────────────────────────────
router.post('/refresh', authController.refreshToken);

// ── POST /api/auth/logout ─────────────────────────────────────────────────────
router.post('/logout', protect, authController.logoutUser);

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
router.get('/me', protect, authController.getMe);

module.exports = router;
