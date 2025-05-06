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
    const { name, location, route } = req.body;
    try {
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
