const express = require('express');
const { backupData, restoreData } = require('../controllers/backupController');
const { checkRole } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/backup', checkRole(['admin', 'super-admin']), backupData);
router.post('/restore', checkRole(['super-admin']), restoreData);

module.exports = router;
