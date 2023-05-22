const express = require('express');
const { getProfile } = require('../middleware/getProfile');
const contractsController = require('../controllers/contracts');

const router = express.Router();

router.get('/', getProfile, contractsController.getByUser);
router.get('/:id', getProfile, contractsController.getById);

module.exports = router;
