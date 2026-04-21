const User = require('../models/User');

// @desc    Get public profile by username
// @route   GET /api/users/:username
// @access  Public
exports.getUserProfile = async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user || (!user.isPublic && !req.authId?.equals(user._id))) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }
  user.profileViews += 1;
  await user.save({ validateBeforeSave: false });
  res.json({ success: true, data: user.toPublicProfile() });
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  const SAFE_FIELDS = [
    'displayName', 'bio', 'tagline', 'avatar', 'bannerImage',
    'primaryRole', 'allRoles', 'primaryGame', 'state', 'city',
    'openToWork', 'lookingFor', 'availability', 'social', 'skills',
    'isPublic', 'emailNotifications', 'gender',
  ];
  const updates = {};
  SAFE_FIELDS.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
  res.json({ success: true, data: user.toPublicProfile() });
};

// @desc    Add or update a game profile
// @route   PUT /api/users/game-profile
// @access  Private
exports.updateGameProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  const existing = user.gameProfiles.find(g => g.gameId === req.body.gameId);
  if (existing) {
    Object.assign(existing, req.body);
  } else {
    user.gameProfiles.push(req.body);
  }
  await user.save();
  res.json({ success: true, data: user.toPublicProfile() });
};

// @desc    Add achievement
// @route   POST /api/users/achievement
// @access  Private
exports.addAchievement = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.achievements.push(req.body);
  await user.save();
  res.json({ success: true, data: user.achievements });
};

// @desc    Add portfolio item
// @route   POST /api/users/portfolio
// @access  Private
exports.addPortfolio = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.portfolio.push(req.body);
  await user.save();
  res.json({ success: true, data: user.portfolio });
};

// @desc    Discover gamers
// @route   GET /api/users
// @access  Public
exports.discoverUsers = async (req, res) => {
  const { role, game, state, openToWork, page = 1, limit = 20 } = req.query;
  const query = { isPublic: true };
  if (role)       query.primaryRole = new RegExp(role, 'i');
  if (game)       query.primaryGame = game;
  if (state)      query.state = state;
  if (openToWork) query.openToWork = true;

  const users = await User.find(query)
    .select('username displayName avatar primaryRole primaryGame state city profileScore openToWork tagline')
    .sort({ profileScore: -1, followersCount: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await User.countDocuments(query);
  res.json({ success: true, total, data: users });
};
