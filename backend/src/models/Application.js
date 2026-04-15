const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  jobId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orgId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },

  // ── Application Data ──────────────────────────────────────────────────────
  coverNote:       { type: String, maxlength: 1000 },
  portfolioLinks:  [String],
  videoIntroUrl:   String,
  resumeUrl:       String,
  highlightClip:   String,
  discordId:       String,
  availability:    String,

  // ── Game-Specific Data ────────────────────────────────────────────────────
  gameStats: {
    currentTier: String,
    kd:          Number,
    winRate:     Number,
    matches:     Number,
    screenshotUrl: String,
    customStats:  mongoose.Schema.Types.Mixed,
  },

  // ── Status Pipeline ───────────────────────────────────────────────────────
  status: {
    type: String,
    enum: ['submitted', 'under_review', 'shortlisted', 'trial_scheduled', 'offer_extended', 'accepted', 'rejected', 'withdrawn'],
    default: 'submitted',
  },

  statusHistory: [{
    status:    String,
    changedAt: { type: Date, default: Date.now },
    note:      String,
  }],

  orgNotes:  { type: String, select: false }, // internal org notes
  rating:    { type: Number, min: 1, max: 5 }, // org rates candidate

  // ── Trial / Interview ─────────────────────────────────────────────────────
  trialScheduled: {
    date:     Date,
    platform: String, // 'Discord', 'In-game', 'Bootcamp'
    roomId:   String,
    notes:    String,
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

ApplicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });
ApplicationSchema.index({ userId: 1, status: 1 });
ApplicationSchema.index({ orgId: 1, status: 1 });

module.exports = mongoose.model('Application', ApplicationSchema);
