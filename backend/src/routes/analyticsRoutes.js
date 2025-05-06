const express = require('express');
const { getAnalytics } = require('../controllers/analyticsController');
const { checkRole } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', checkRole(['admin', 'super-admin']), getAnalytics);

module.exports = router;