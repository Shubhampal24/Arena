const { GAMES, PROFESSIONAL_ROLES, DEVICES, ORG_TYPES, INDIAN_STATES, JOB_FIELDS } = require('../config/constants');

exports.getGames = (req, res) => res.json({ success: true, data: GAMES });
exports.getRoles = (req, res) => res.json({ success: true, data: PROFESSIONAL_ROLES });
exports.getDevices = (req, res) => res.json({ success: true, data: DEVICES });
exports.getOrgTypes = (req, res) => res.json({ success: true, data: ORG_TYPES });
exports.getStates = (req, res) => res.json({ success: true, data: INDIAN_STATES });
exports.getJobFields = (req, res) => res.json({ success: true, data: JOB_FIELDS });

exports.getGameById = (req, res) => {
  const game = GAMES.find(g => g.id === req.params.id);
  if (!game) return res.status(404).json({ success: false, message: 'Game not found.' });
  res.json({ success: true, data: game });
};
