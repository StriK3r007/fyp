const Driver = require('../models/driverModel');

// Create a Driver
exports.createDriver = async (req, res) => {
    try {
        // Ensure the user has the correct role to create a driver
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You do not have permission to create drivers' });
        }

        const { name, email, phone, busId, licenseNumber } = req.body;

        const driver = new Driver({ name, email, phone, busId, licenseNumber, createdBy: req.user._id});
        await driver.save();
        res.status(201).json(driver);
    } catch (err) {
        res.status(400).json({ error: err.message });
        console.error(err);
        res.status(500).json({ message: 'Error creating driver' });
    }
};

// Get all Drivers
exports.getDrivers = async (req, res) => {
    try {
        const drivers = await Driver.find().populate('assignedBus');
        res.status(200).json(drivers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a Driver
exports.updateDriver = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const driver = await Driver.findByIdAndUpdate(id, updates, { new: true });
        if (!driver) return res.status(404).json({ error: 'Driver not found' });
        res.status(200).json(driver);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete a Driver
exports.deleteDriver = async (req, res) => {
    const { id } = req.params;
    try {
        const driver = await Driver.findByIdAndDelete(id);
        if (!driver) return res.status(404).json({ error: 'Driver not found' });
        res.status(200).json({ message: 'Driver deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
