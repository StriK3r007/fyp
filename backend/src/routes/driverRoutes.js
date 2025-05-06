const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware'); // Import the authMiddleware
const checkRole = require('../middlewares/checkRole');
// const { checkRole } = require('../middlewares/authMiddleware');
const { getDrivers, createDriver, updateDriver, deleteDriver } = require('../controllers/driverController');

router.get('/', authMiddleware, checkRole(['admin', 'super-admin']), getDrivers);
router.post('/', authMiddleware, checkRole(['admin', 'super-admin']), createDriver);
router.put('/:id', authMiddleware, checkRole(['admin', 'super-admin']), updateDriver);
router.delete('/:id', authMiddleware, checkRole(['admin', 'super-admin']), deleteDriver);

// To test without authentication middleware // non protected
// router.get('/', getDrivers);
// router.post('/', createDriver);
// router.put('/:id', updateDriver);
// router.delete('/:id', deleteDriver);

module.exports = router;
