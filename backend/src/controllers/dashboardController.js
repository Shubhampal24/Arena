const Job = require('../models/Job');
const Application = require('../models/Application');
const Post = require('../models/Post');

exports.getDashboardData = async (req, res) => {
  if (req.accountType === 'organization') {
    const [jobs, applications] = await Promise.all([
      Job.find({ 'postedBy.orgId': req.org._id }).sort({ createdAt: -1 }).limit(10),
      Application.find({ orgId: req.org._id, status: 'submitted' }).populate('userId', 'username displayName avatar primaryRole').populate('jobId', 'title').limit(10),
    ]);
    return res.json({ success: true, data: { org: req.org, activeJobs: req.org.activeJobs, totalJobs: req.org.totalJobs, recentJobs: jobs, pendingApplications: applications } });
  }

  const [applications, posts] = await Promise.all([
    Application.find({ userId: req.user._id }).populate('jobId', 'title specificRole postedBy').sort({ createdAt: -1 }).limit(5),
    Post.find({ 'author.id': req.user._id }).sort({ createdAt: -1 }).limit(5),
  ]);

  res.json({ success: true, data: { user: req.user.toPublicProfile(), profileScore: req.user.profileScore, applications, recentPosts: posts } });
};
