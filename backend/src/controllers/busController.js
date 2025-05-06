const Bus = require('../models/busModel');

// Create a Bus
exports.createBus = async (req, res) => {
    const { number, route, currentLocation } = req.body;
    try {
        // Ensure the user has the correct role to create a driver
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You do not have permission to create drivers' });
        }

        const bus = new Bus({ number, route, currentLocation, createdBy: req.user._id});
        await bus.save();
        res.status(201).json(bus);
    } catch (err) {
        res.status(400).json({ error: err.message });
        console.error(err);
        res.status(500).json({ message: 'Error creating driver' });
    }
};

// Get all Buses with their Drivers
exports.getBuses = async (req, res) => {
    try {
        const buses = await Bus.find().populate('driver');
        res.status(200).json(buses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a Bus
exports.updateBus = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const bus = await Bus.findByIdAndUpdate(id, updates, { new: true });
        if (!bus) return res.status(404).json({ error: 'Bus not found' });
        res.status(200).json(bus);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete a Bus
exports.deleteBus = async (req, res) => {
    const { id } = req.params;
    try {
        const bus = await Bus.findByIdAndDelete(id);
        if (!bus) return res.status(404).json({ error: 'Bus not found' });
        res.status(200).json({ message: 'Bus deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.logTrip = async (req, res) => {
    const { id } = req.params;
    const { startTime, endTime, startLocation, endLocation } = req.body;
    try {
        const bus = await Bus.findById(id);
        if (!bus) return res.status(404).json({ error: 'Bus not found' });

        bus.trips.push({ startTime, endTime, startLocation, endLocation });
        await bus.save();
        res.status(200).json(bus);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Geofencing
// const isWithinGeofence = (latitude, longitude, geofence) => {
//     // Example logic to check if bus is within geofence
//     return true; // Replace with actual calculation
// };

// exports.checkGeofence = async (req, res) => {
//     const { latitude, longitude, geofence } = req.body;
//     try {
//         const withinGeofence = isWithinGeofence(latitude, longitude, geofence);
//         res.status(200).json({ withinGeofence });
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// };
// router.post('/check-geofence', checkGeofence);