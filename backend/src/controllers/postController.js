const Post = require('../models/Post');

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public (Optional Auth)
exports.getPosts = async (req, res) => {
  const { game, type, page = 1, limit = 20, featured } = req.query;
  const query = { isActive: true, visibility: 'public' };
  if (game)     query.gameTag = game;
  if (type)     query.postType = type;
  if (featured) query.isFeatured = true;

  const posts = await Post.find(query)
    .sort({ isFeatured: -1, createdAt: -1 })
    .skip((page - 1) * limit).limit(Number(limit));

  const total = await Post.countDocuments(query);
  res.json({ success: true, total, data: posts });
};

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res) => {
  const account = req.user || req.org;
  const post = await Post.create({
    ...req.body,
    author: {
      id:          account._id,
      type:        req.accountType === 'organization' ? 'Organization' : 'User',
      displayName: req.user ? req.user.displayName : req.org.orgName,
      username:    req.user ? req.user.username : req.org.slug,
      avatar:      req.user ? req.user.avatar : req.org.logo,
      primaryRole: req.user?.primaryRole,
      isVerified:  req.org?.isVerifiedOrg || false,
    },
  });
  res.status(201).json({ success: true, data: post });
};

// @desc    Like or Unlike a post
// @route   PUT /api/posts/:id/like
// @access  Private
exports.likePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });
  const idx = post.likes.indexOf(req.authId);
  if (idx > -1) { post.likes.splice(idx, 1); post.likesCount--; }
  else          { post.likes.push(req.authId); post.likesCount++; }
  await post.save();
  res.json({ success: true, likesCount: post.likesCount });
};

// @desc    Comment on a post
// @route   POST /api/posts/:id/comment
// @access  Private
exports.commentOnPost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });
  const account = req.user || req.org;
  post.comments.push({ 
    authorId: req.authId, 
    authorType: req.accountType === 'organization' ? 'Organization' : 'User', 
    displayName: req.user ? req.user.displayName : req.org.orgName, 
    avatar: account.avatar || account.logo, 
    content: req.body.content 
  });
  post.commentsCount++;
  await post.save();
  res.json({ success: true, data: post.comments });
};
