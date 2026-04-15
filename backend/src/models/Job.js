const mongoose = require('mongoose');
const { JOB_FIELDS } = require('../config/constants');

const JobSchema = new mongoose.Schema({
  // ── Posted By ─────────────────────────────────────────────────────────────
  postedBy: {
    type:    { type: String, enum: ['organization', 'user'], default: 'organization' },
    orgId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    orgName: String,
    orgLogo: String,
  },

  // ── Job Basics ────────────────────────────────────────────────────────────
  title:       { type: String, required: true, trim: true, maxlength: 120 },
  slug:        { type: String, unique: true },
  description: { type: String, required: true, maxlength: 5000 },
  roleCategory:{ type: String, required: true }, // from PROFESSIONAL_ROLES keys
  specificRole:{ type: String, required: true }, // exact role string

  // ── Game Context ──────────────────────────────────────────────────────────
  gameId:       String,
  gameName:     String,
  gameRoles:    [String], // in-game roles required
  minTier:      String,   // minimum rank required

  // ── Device / Tech Requirements ────────────────────────────────────────────
  deviceRequirements: {
    requiredDevice: String, // 'Must have iPhone 13+'
    minRAM:         String, // '8GB minimum'
    minProcessor:   String,
    internetSpeed:  String, // '50 Mbps+, stable'
    peripherals:    [String], // ['Mechanical Keyboard', 'Gaming Mouse', 'Headset']
    softwareTools:  [String], // ['Adobe Premiere', 'OBS', 'DaVinci Resolve']
    customNote:     String,
  },

  // ── Terms ─────────────────────────────────────────────────────────────────
  workType:      { type: String, enum: JOB_FIELDS.WORK_TYPE },
  locationType:  { type: String, enum: JOB_FIELDS.LOCATION_TYPE },
  location: {
    state:   String,
    city:    String,
    country: { type: String, default: 'India' },
  },
  language:      { type: String, enum: JOB_FIELDS.LANGUAGE },
  availability:  String,
  trialPeriod:   String, // '2-week tryout period'

  // ── Compensation ──────────────────────────────────────────────────────────
  salary: {
    type:     { type: String, enum: JOB_FIELDS.SALARY_TYPE },
    min:      Number,
    max:      Number,
    currency: { type: String, default: 'INR' },
    isNegotiable: Boolean,
  },
  perks: [String], // ['Gaming equipment', 'Paid tournaments', 'Travel covered']

  // ── Requirements ─────────────────────────────────────────────────────────
  requirements: {
    experienceLevel: { type: String, enum: JOB_FIELDS.EXPERIENCE_LEVEL },
    minAge:          Number,
    maxAge:          Number,
    gender:          { type: String, default: 'Any' },
    languages:       [String],
    education:       String, // optional for most esports roles
    statRequirements: mongoose.Schema.Types.Mixed, // {'kd': '>3.5', 'winRate': '>60%'}
    synergyExp:      String, // 'Experience with IGL coordination preferred'
    portfolioRequired: Boolean,
    socialFollowing:  String, // 'Min 10k followers on any platform'
    certifications:  [String],
  },
  mustHaves:    [String], // non-negotiable bullet points
  niceToHaves:  [String], // optional bonus qualifications

  // ── Application Process ───────────────────────────────────────────────────
  applicationProcess: {
    steps: [String], // ['Submit form', 'Trial match', 'Interview', 'Offer']
    portfolioLink:   Boolean,
    videoIntro:      Boolean,
    trialMatch:      Boolean,
    hiringTestLink:  String,
  },
  deadline:        Date,
  openSlots:       { type: Number, default: 1 },

  // ── Metadata ──────────────────────────────────────────────────────────────
  tags:            [String], // ['BGMI', 'IGL', 'Remote', 'Fresher OK']
  isActive:        { type: Boolean, default: true },
  isFeatured:      { type: Boolean, default: false },
  applicantCount:  { type: Number, default: 0 },
  views:           { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

// ── Indexes ───────────────────────────────────────────────────────────────────
JobSchema.index({ roleCategory: 1, isActive: 1 });
JobSchema.index({ gameId: 1, isActive: 1 });
JobSchema.index({ 'location.state': 1, isActive: 1 });
JobSchema.index({ workType: 1, locationType: 1 });
JobSchema.index({ tags: 1 });
JobSchema.index({ createdAt: -1 });
JobSchema.index({ isFeatured: -1, createdAt: -1 });

// ── Text search index ─────────────────────────────────────────────────────────
JobSchema.index({ title: 'text', description: 'text', specificRole: 'text', tags: 'text' });

module.exports = mongoose.model('Job', JobSchema);
