const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Organization = require('../models/Organization');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized. Please log in.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Load user or org based on accountType in token
    if (decoded.accountType === 'organization') {
      const org = await Organization.findById(decoded.id).select('-password -refreshTokens');
      if (!org) return res.status(401).json({ success: false, message: 'Organization not found.' });
      req.org = org;
      req.user = null;
      req.accountType = 'organization';
      req.authId = org._id;
    } else {
      const user = await User.findById(decoded.id).select('-password -refreshTokens');
      if (!user) return res.status(401).json({ success: false, message: 'User not found.' });
      req.user = user;
      req.org = null;
      req.accountType = decoded.accountType || 'user';
      req.authId = user._id;
    }

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
    }
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }
};

// Role-based middleware
const requireUser = (req, res, next) => {
  if (req.accountType !== 'user') {
    return res.status(403).json({ success: false, message: 'User account required.' });
  }
  next();
};

const requireOrg = (req, res, next) => {
  if (req.accountType !== 'organization') {
    return res.status(403).json({ success: false, message: 'Organization account required.' });
  }
  next();
};

const requireAdmin = (req, res, next) => {
  if (req.accountType !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required.' });
  }
  next();
};

// Optional auth — doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.accountType === 'organization') {
        req.org = await Organization.findById(decoded.id).select('-password');
      } else {
        req.user = await User.findById(decoded.id).select('-password');
      }
      req.accountType = decoded.accountType;
      req.authId = decoded.id;
    }
  } catch (_) {}
  next();
};

module.exports = { protect, requireUser, requireOrg, requireAdmin, optionalAuth };
