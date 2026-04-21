const User = require('../models/User');
const Organization = require('../models/Organization');
const Job = require('../models/Job');

exports.searchAll = async (req, res) => {
  const { q, type = 'all', limit = 10 } = req.query;
  if (!q) return res.status(400).json({ success: false, message: 'Query required.' });

  const regex = new RegExp(q, 'i');
  const results = {};

  if (type === 'all' || type === 'users') {
    results.users = await User.find({ $or: [{ username: regex }, { displayName: regex }, { primaryRole: regex }], isPublic: true })
      .select('username displayName avatar primaryRole primaryGame state profileScore')
      .limit(Number(limit));
  }
  if (type === 'all' || type === 'orgs') {
    results.organizations = await Organization.find({ $or: [{ orgName: regex }, { description: regex }] })
      .select('orgName slug logo orgType state isVerifiedOrg')
      .limit(Number(limit));
  }
  if (type === 'all' || type === 'jobs') {
    results.jobs = await Job.find({ isActive: true, $text: { $search: q } })
      .select('title specificRole gameName locationType workType createdAt')
      .limit(Number(limit));
  }

  res.json({ success: true, query: q, data: results });
};
