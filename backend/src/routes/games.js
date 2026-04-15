const express = require('express');
const router = express.Router();
const { GAMES, PROFESSIONAL_ROLES, DEVICES, ORG_TYPES, INDIAN_STATES, JOB_FIELDS } = require('../config/constants');

router.get('/', (req, res) => res.json({ success: true, data: GAMES }));
router.get('/roles', (req, res) => res.json({ success: true, data: PROFESSIONAL_ROLES }));
router.get('/devices', (req, res) => res.json({ success: true, data: DEVICES }));
router.get('/org-types', (req, res) => res.json({ success: true, data: ORG_TYPES }));
router.get('/states', (req, res) => res.json({ success: true, data: INDIAN_STATES }));
router.get('/job-fields', (req, res) => res.json({ success: true, data: JOB_FIELDS }));
router.get('/:id', (req, res) => {
  const game = GAMES.find(g => g.id === req.params.id);
  if (!game) return res.status(404).json({ success: false, message: 'Game not found.' });
  res.json({ success: true, data: game });
});

module.exports = router;