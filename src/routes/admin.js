const express = require('express');
const { getProfile } = require('../middleware/getProfile');
const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/best-profession', getProfile, adminController.getBestProfession);
router.get('/best-clients', getProfile, adminController.getBestClients);

module.exports = router;
