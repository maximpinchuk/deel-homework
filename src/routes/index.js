const express = require('express');
const contractsRoutes = require('./contracts');
const jobsRoutes = require('./jobs');
const balancesRoutes = require('./balances');
const adminRoutes = require('./admin');

const router = express.Router();

router.use('/contracts', contractsRoutes);
router.use('/jobs', jobsRoutes);
router.use('/balances', balancesRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
