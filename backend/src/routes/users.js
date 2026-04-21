// users.js
const express = require('express');
const router = express.Router();
const { protect, requireUser, optionalAuth } = require('../middleware/auth');
const userController = require('../controllers/userController');

// GET /api/users/:username
router.get('/:username', optionalAuth, userController.getUserProfile);

// PUT /api/users/profile — update profile
router.put('/profile', protect, requireUser, userController.updateProfile);

// PUT /api/users/game-profile — add/update a game profile
router.put('/game-profile', protect, requireUser, userController.updateGameProfile);

// POST /api/users/achievement — add achievement
router.post('/achievement', protect, requireUser, userController.addAchievement);

// POST /api/users/portfolio — add portfolio item
router.post('/portfolio', protect, requireUser, userController.addPortfolio);

// GET /api/users — discover gamers
router.get('/', optionalAuth, userController.discoverUsers);

module.exports = router;
