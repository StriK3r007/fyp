const Stop = require('../models/stopModel');

// Get all Stops
exports.getStops = async (req, res) => {
    try {
        const stops = await Stop.find();
        res.status(200).json(stops);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a Stop
exports.createStop = async (req, res) => {
    console.log('--- createStop function called ---'); 
    const { name, location, route } = req.body;
    try {
        // Ensure the user has the correct role to create a stops
        if (req.user.role !== 'admin') {
            console.log('Access denied: not admin');
            return res.status(403).json({ message: 'You do not have permission to create stops' });
        }

        // --- SERVER-SIDE VALIDATION ---
        if (!name || name.trim() === '') {
            return res.status(400).json({ message: 'Stop Name is required.' });
        }
        if (!location || typeof location !== 'object' || location === null || !('latitude' in location) || !('longitude' in location)) {
            return res.status(400).json({ message: 'Stop Location is required.' });
        }
        const latitude = location.latitude;
        const longitude = location.longitude;
        if (typeof latitude !== 'number' || isNaN(latitude)) {
            return res.status(400).json({ message: 'Latitude must be a valid number.' });
        }
        if (typeof longitude !== 'number' || isNaN(longitude)) {
            return res.status(400).json({ message: 'Longitude must be a valid number.' });
        }
        // Check if the stop already exists
        const existingStop = await Stop.findOne({ name });
        if (existingStop) {
            console.log('Stop with this name already exists');
            return res.status(400).json({ message: 'Stop with this name already exists' });
        }
        // Check if no route
        if (!route) {
            return res.status(400).json({ message: 'Route is required.' });
        }
        // --- END OF VALIDATION ---

        const stop = new Stop({ name, location, route });
        await stop.save();
        res.status(201).json(stop);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Update a Stop
exports.updateStop = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const stop = await Stop.findByIdAndUpdate(id, updates, { new: true });
        if (!stop) return res.status(404).json({ error: 'Stop not found' });
        res.status(200).json(stop);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete a Stop
exports.deleteStop = async (req, res) => {
    const { id } = req.params;
    try {
        const stop = await Stop.findByIdAndDelete(id);
        if (!stop) return res.status(404).json({ error: 'Stop not found' });
        res.status(200).json({ message: 'Stop deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Public GET for MapView
exports.getPublicStops = async (req, res) => {
    try {
        const stops = await Stop.find();
        res.status(200).json(stops);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch stops', error: err.message });
    }
};
