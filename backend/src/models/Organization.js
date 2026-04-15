const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ORG_TYPES, GAMES, INDIAN_STATES } = require('../config/constants');

const OrgAchievementSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  tournament:  String,
  year:        Number,
  placement:   String, // '1st', 'Runner-up', 'Top 4'
  game:        String,
  prizePool:   String,
  mediaUrl:    String,
}, { _id: true });

const OrganizationSchema = new mongoose.Schema({
  // ── Auth ──────────────────────────────────────────────────────────────────
  email:        { type: String, required: true, unique: true, lowercase: true },
  password:     { type: String, required: true, select: false },
  accountType:  { type: String, default: 'organization' },
  isVerified:   { type: Boolean, default: false },
  verifyToken:  String,
  refreshTokens:[String],

  // ── Org Identity ─────────────────────────────────────────────────────────
  orgName:      { type: String, required: true, trim: true },
  slug:         { type: String, unique: true, sparse: true },
  logo:         { type: String, default: '' },
  bannerImage:  { type: String, default: '' },
  tagline:      { type: String, maxlength: 150 },
  description:  { type: String, maxlength: 2000 },
  orgType:      { type: String, enum: ORG_TYPES },

  // ── Legal / Business ─────────────────────────────────────────────────────
  foundedYear:  Number,
  registrationNo: String, // GST / company reg
  pan:          { type: String, select: false },
  contactPerson:{
    name:  String,
    role:  String,
    phone: String,
    email: String,
  },

  // ── Location ──────────────────────────────────────────────────────────────
  state:        { type: String, enum: INDIAN_STATES },
  city:         String,
  address:      String,
  country:      { type: String, default: 'India' },

  // ── Games & Esports ───────────────────────────────────────────────────────
  activeGames:  [{ type: String }], // game IDs
  rosters: [{
    gameId:   String,
    gameName: String,
    members: [{
      userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      username:  String,
      role:      String,
      joinedAt:  Date,
      isCaptain: Boolean,
    }],
  }],

  achievements: [OrgAchievementSchema],

  // ── Social & Media ─────────────────────────────────────────────────────────
  social: {
    youtube:   String,
    instagram: String,
    twitter:   String,
    discord:   String,
    twitch:    String,
    website:   String,
    linkedin:  String,
  },

  // ── Sponsorships ──────────────────────────────────────────────────────────
  sponsors: [{
    name:    String,
    logoUrl: String,
    website: String,
    tier:    { type: String, enum: ['Title', 'Co', 'Associate', 'Partner'] },
  }],

  // ── Stats ─────────────────────────────────────────────────────────────────
  followersCount: { type: Number, default: 0 },
  profileViews:   { type: Number, default: 0 },
  totalJobs:      { type: Number, default: 0 },
  activeJobs:     { type: Number, default: 0 },

  // ── Verification ──────────────────────────────────────────────────────────
  isVerifiedOrg:  { type: Boolean, default: false }, // Admin-verified badge
  planTier:       { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },

  createdAt:    { type: Date, default: Date.now },
  updatedAt:    { type: Date, default: Date.now },
}, { timestamps: true });

// ── Indexes ───────────────────────────────────────────────────────────────────
OrganizationSchema.index({ slug: 1 });
OrganizationSchema.index({ orgType: 1, state: 1 });
OrganizationSchema.index({ activeGames: 1 });

// ── Pre-save: Hash password ───────────────────────────────────────────────────
OrganizationSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

OrganizationSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Organization', OrganizationSchema);
