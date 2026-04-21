const Organization = require('../models/Organization');

exports.getOrganizations = async (req, res) => {
  const { type, game, state, verified, page = 1, limit = 20 } = req.query;
  const query = {};
  if (type)     query.orgType = type;
  if (game)     query.activeGames = game;
  if (state)    query.state = state;
  if (verified) query.isVerifiedOrg = true;

  const orgs = await Organization.find(query)
    .select('orgName slug logo tagline orgType state city activeGames isVerifiedOrg followersCount')
    .sort({ isVerifiedOrg: -1, followersCount: -1 })
    .skip((page - 1) * limit).limit(Number(limit));

  const total = await Organization.countDocuments(query);
  res.json({ success: true, total, data: orgs });
};

exports.getOrgBySlug = async (req, res) => {
  const org = await Organization.findOne({ slug: req.params.slug });
  if (!org) return res.status(404).json({ success: false, message: 'Org not found.' });
  org.profileViews += 1; await org.save({ validateBeforeSave: false });
  res.json({ success: true, data: org });
};

exports.updateProfile = async (req, res) => {
  const SAFE = ['orgName','tagline','description','logo','bannerImage','state','city','social','activeGames','sponsors'];
  const updates = {};
  SAFE.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
  const org = await Organization.findByIdAndUpdate(req.org._id, updates, { new: true });
  res.json({ success: true, data: org });
};
