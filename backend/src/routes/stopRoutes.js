const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware'); // Import the authMiddleware
const checkRole = require('../middlewares/checkRole');
const { getStops, createStop, updateStop, deleteStop  } = require('../controllers/stopController');

router.get('/', authMiddleware, checkRole(['admin', 'super-admin']), getStops);
router.post('/', authMiddleware, checkRole(['admin', 'super-admin']), createStop);
router.put('/:id', authMiddleware, checkRole(['admin', 'super-admin']), updateStop);
router.delete('/:id', authMiddleware, checkRole(['admin', 'super-admin']), deleteStop);

module.exports = router;
