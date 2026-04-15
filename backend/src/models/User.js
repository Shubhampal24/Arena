const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { DEVICES, INDIAN_STATES } = require('../config/constants');

const GameProfileSchema = new mongoose.Schema({
  gameId:       { type: String, required: true },
  gameName:     { type: String, required: true },
  gameUsername: { type: String },
  currentTier:  { type: String },
  peakTier:     { type: String },
  inGameRoles:  [{ type: String }],
  device:       { type: String, enum: DEVICES },
  hoursPerWeek: { type: Number, min: 0, max: 168 },
  tournamentExp:{ type: String }, // e.g. "BGIS 2024 Quarter Finals"
  teamHistory:  [{ teamName: String, year: Number, role: String }],
  highlights:   [{ type: String }], // URLs to highlight clips
  stats: {
    kd:        Number,
    winRate:   Number,
    matches:   Number,
    customStats: mongoose.Schema.Types.Mixed, // game-specific stats
  },
}, { _id: true });

const AchievementSchema = new mongoose.Schema({
  title:        { type: String, required: true },
  description:  String,
  date:         Date,
  mediaUrl:     String, // image/video proof
  verifiedBy:   String, // org name
}, { _id: true });

const PortfolioItemSchema = new mongoose.Schema({
  type:       { type: String, enum: ['image', 'video', 'link', 'clip', 'article'], required: true },
  title:      String,
  url:        { type: String, required: true },
  thumbnail:  String,
  description:String,
  tags:       [String],
  likes:      { type: Number, default: 0 },
  uploadedAt: { type: Date, default: Date.now },
}, { _id: true });

const UserSchema = new mongoose.Schema({
  // ── Auth ──────────────────────────────────────────────────────────────────
  email:          { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:       { type: String, required: true, minlength: 8, select: false },
  accountType:    { type: String, enum: ['user', 'organization', 'admin'], default: 'user' },
  isVerified:     { type: Boolean, default: false },
  verifyToken:    String,
  resetToken:     String,
  resetExpires:   Date,
  refreshTokens:  [String],

  // ── Basic Profile ─────────────────────────────────────────────────────────
  username:       { type: String, unique: true, sparse: true, trim: true, minlength: 3, maxlength: 30 },
  displayName:    { type: String, trim: true, maxlength: 60 },
  avatar:         { type: String, default: '' },
  bannerImage:    { type: String, default: '' },
  bio:            { type: String, maxlength: 500 },
  tagline:        { type: String, maxlength: 100 }, // "India's #1 BGMI IGL"

  // ── Personal Info ─────────────────────────────────────────────────────────
  dateOfBirth:    Date,
  gender:         { type: String, enum: ['Male', 'Female', 'Non-binary', 'Prefer not to say'] },
  phone:          { type: String, select: false },
  state:          { type: String, enum: INDIAN_STATES },
  city:           String,
  country:        { type: String, default: 'India' },

  // ── Gaming Identity ───────────────────────────────────────────────────────
  primaryRole:    String, // from PROFESSIONAL_ROLES
  allRoles:       [String],
  primaryGame:    String, // gameId from GAMES
  gameProfiles:   [GameProfileSchema],
  openToWork:     { type: Boolean, default: false },
  lookingFor:     [String], // ['Team', 'Org', 'Sponsor', 'Collab', 'Tryout']
  availability:   { type: String, enum: ['Full-Time', 'Part-Time', 'Bootcamp', 'WFH Only', 'Tournament Only'] },

  // ── Social Links ──────────────────────────────────────────────────────────
  social: {
    youtube:    String,
    instagram:  String,
    twitter:    String,
    twitch:     String,
    discord:    String,
    linkedin:   String,
    website:    String,
    faceit:     String,
  },

  // ── Portfolio & Achievements ──────────────────────────────────────────────
  portfolio:    [PortfolioItemSchema],
  achievements: [AchievementSchema],
  skills:       [String], // ['Video Editing', 'Commentary', 'Graphic Design']

  // ── Profile Completion Score (0-100) ──────────────────────────────────────
  profileScore: { type: Number, default: 0, min: 0, max: 100 },

  // ── Stats ─────────────────────────────────────────────────────────────────
  followersCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 },
  postsCount:     { type: Number, default: 0 },
  profileViews:   { type: Number, default: 0 },

  // ── Applications Tracking ─────────────────────────────────────────────────
  appliedJobs:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],

  // ── Settings ─────────────────────────────────────────────────────────────
  isPublic:         { type: Boolean, default: true },
  emailNotifications: { type: Boolean, default: true },
  pushNotifications:  { type: Boolean, default: true },

  // ── Timestamps ────────────────────────────────────────────────────────────
  lastActive:   { type: Date, default: Date.now },
  createdAt:    { type: Date, default: Date.now },
  updatedAt:    { type: Date, default: Date.now },
}, { timestamps: true });

// ── Indexes ───────────────────────────────────────────────────────────────────
UserSchema.index({ username: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ primaryRole: 1, state: 1 });
UserSchema.index({ openToWork: 1, primaryGame: 1 });
UserSchema.index({ 'gameProfiles.gameId': 1, 'gameProfiles.currentTier': 1 });

// ── Pre-save: Hash password ───────────────────────────────────────────────────
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Pre-save: Calculate profile score ────────────────────────────────────────
UserSchema.pre('save', function (next) {
  let score = 0;
  if (this.displayName)     score += 10;
  if (this.avatar)          score += 10;
  if (this.bio)             score += 10;
  if (this.primaryRole)     score += 10;
  if (this.primaryGame)     score += 10;
  if (this.gameProfiles?.length > 0) score += 15;
  if (this.achievements?.length > 0) score += 10;
  if (this.portfolio?.length > 0)    score += 10;
  if (Object.values(this.social || {}).some(v => v)) score += 10;
  if (this.state && this.city) score += 5;
  this.profileScore = Math.min(score, 100);
  next();
});

// ── Method: Compare password ──────────────────────────────────────────────────
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ── Method: Public profile ────────────────────────────────────────────────────
UserSchema.methods.toPublicProfile = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.phone;
  delete obj.refreshTokens;
  delete obj.verifyToken;
  delete obj.resetToken;
  return obj;
};

module.exports = mongoose.model('User', UserSchema);
