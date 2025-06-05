const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware'); // Import the authMiddleware
const checkRole = require('../middlewares/checkRole');
const { getBuses, createBus, updateBus, deleteBus, logTrip, getPublicBuses, updateBusLocation } = require('../controllers/busController');
const Bus = require('../models/busModel'); // Import the Bus model here

// ✅ Public route for MapView
router.get('/public', getPublicBuses);

// 🔒 Protected admin routes
router.get('/', authMiddleware, checkRole(['admin', 'super-admin']), getBuses);
router.post('/', authMiddleware, checkRole(['admin', 'super-admin']), createBus);
router.put('/:id', authMiddleware, checkRole(['admin', 'super-admin']), updateBus);
router.delete('/:id', authMiddleware, checkRole(['admin', 'super-admin']), deleteBus);
router.post('/:id/logTrip', authMiddleware, checkRole(['admin', 'super-admin']), logTrip);
router.post('/:id/location', authMiddleware, checkRole(['driver']), updateBusLocation);

// Test route to explicitly fetch one bus and populate driver
router.get('/test-populate/:id', async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id).populate('driver', '_id name');
    console.log('Test Bus with Driver:', JSON.stringify(bus, null, 2));
    res.status(200).json(bus);
  } catch (error) {
    console.error('Error fetching test bus:', error);
    res.status(500).json({ message: 'Failed to fetch test bus', error: error.message });
  }
});

module.exports = router;