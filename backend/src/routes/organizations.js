const express = require('express');
const router = express.Router();
const { protect, requireOrg, optionalAuth } = require('../middleware/auth');
const orgController = require('../controllers/orgController');

router.get('/', optionalAuth, orgController.getOrganizations);
router.get('/:slug', optionalAuth, orgController.getOrgBySlug);
router.put('/profile', protect, requireOrg, orgController.updateProfile);

module.exports = router;