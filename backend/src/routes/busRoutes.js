const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware'); // Import the authMiddleware
const checkRole = require('../middlewares/checkRole');
const { getBuses, createBus, updateBus, deleteBus, logTrip } = require('../controllers/busController');

router.get('/', authMiddleware, checkRole(['admin', 'super-admin']), getBuses);
router.post('/', authMiddleware, checkRole(['admin', 'super-admin']), createBus);
router.put('/:id', authMiddleware, checkRole(['admin', 'super-admin']), updateBus);
router.delete('/:id', authMiddleware, checkRole(['admin', 'super-admin']), deleteBus);
router.post('/:id/logTrip', authMiddleware, checkRole(['admin', 'super-admin']), logTrip);


module.exports = router;
