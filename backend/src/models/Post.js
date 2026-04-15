const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  author: {
    id:          { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'author.type' },
    type:        { type: String, enum: ['User', 'Organization'], required: true },
    displayName: String,
    username:    String,
    avatar:      String,
    primaryRole: String,
    isVerified:  Boolean,
  },

  // ── Content ───────────────────────────────────────────────────────────────
  content:     { type: String, maxlength: 3000 },
  postType:    { type: String, enum: ['text', 'image', 'video', 'achievement', 'highlight', 'announcement', 'job_share', 'poll'], default: 'text' },

  media: [{
    type:      { type: String, enum: ['image', 'video', 'gif'] },
    url:       String,
    thumbnail: String,
    duration:  Number, // for video, in seconds
    width:     Number,
    height:    Number,
  }],

  // ── Achievement Share ─────────────────────────────────────────────────────
  achievement: {
    title:    String,
    game:     String,
    tier:     String,
    position: String, // '1st in BGIS 2024'
    proofUrl: String,
  },

  // ── Tags & Discovery ──────────────────────────────────────────────────────
  tags:        [String],
  gameTag:     String, // gameId
  mentions:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // ── Engagement ────────────────────────────────────────────────────────────
  likes:       [{ type: mongoose.Schema.Types.ObjectId, refPath: 'likedByType' }],
  likesCount:  { type: Number, default: 0 },
  comments: [{
    authorId:    { type: mongoose.Schema.Types.ObjectId },
    authorType:  { type: String, enum: ['User', 'Organization'] },
    displayName: String,
    avatar:      String,
    content:     { type: String, maxlength: 1000 },
    createdAt:   { type: Date, default: Date.now },
    likes:       { type: Number, default: 0 },
  }],
  commentsCount: { type: Number, default: 0 },
  sharesCount:   { type: Number, default: 0 },
  views:         { type: Number, default: 0 },

  // ── Visibility ────────────────────────────────────────────────────────────
  visibility:  { type: String, enum: ['public', 'followers', 'private'], default: 'public' },
  isActive:    { type: Boolean, default: true },
  isPinned:    { type: Boolean, default: false },
  isFeatured:  { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

PostSchema.index({ 'author.id': 1, createdAt: -1 });
PostSchema.index({ gameTag: 1, createdAt: -1 });
PostSchema.index({ tags: 1 });
PostSchema.index({ isFeatured: -1, createdAt: -1 });

module.exports = mongoose.model('Post', PostSchema);
