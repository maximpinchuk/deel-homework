const express = require('express');
const { getProfile } = require('../middleware/getProfile');
const jobsController = require('../controllers/jobs');

const router = express.Router();

router.get('/unpaid', getProfile, jobsController.getUnpaidJobsByProfileId);
router.post('/:job_id/pay', getProfile, jobsController.payForJob);

module.exports = router;
