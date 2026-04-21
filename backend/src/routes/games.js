const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

router.get('/', gameController.getGames);
router.get('/roles', gameController.getRoles);
router.get('/devices', gameController.getDevices);
router.get('/org-types', gameController.getOrgTypes);
router.get('/states', gameController.getStates);
router.get('/job-fields', gameController.getJobFields);
router.get('/:id', gameController.getGameById);

module.exports = router;