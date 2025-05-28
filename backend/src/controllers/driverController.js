const Driver = require('../models/driverModel');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

// Create a Driver
exports.createDriver = async (req, res) => {
    try {
        console.log('Creating driver...');

        // Ensure the user has the correct role to create a driver
        if (req.user.role !== 'admin') {
            console.log('Access denied: not admin');
            return res.status(403).json({ message: 'You do not have permission to create drivers' });
        }
        
        const { name, email, phone, busId, licenseNumber } = req.body;
        console.log('Payload:', { name, email, phone, busId, licenseNumber });

        // --- SERVER-SIDE VALIDATION ---
        if (!name || name.trim() === '') {
            return res.status(400).json({ message: 'Name is required.' });
        }
        if (!email || email.trim() === '') {
            return res.status(400).json({ message: 'Email is required.' });
        }
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User with email already exists');
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        // Basic email format check (we might want a more robust one)
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: 'Invalid email format.' });
        }
        // Check if no phone
        if (!phone || phone.trim() === '') {
            return res.status(400).json({ message: 'Phone number is required.' });
        }
        // Check if no busId
        if (!busId) {
            return res.status(400).json({ message: 'Bus ID is required.' });
        }
        // Check if no licenseNumber
        if (!licenseNumber || licenseNumber.trim() === '') {
            return res.status(400).json({ message: 'License number is required.' });
        }
        
        // --- END OF VALIDATION ---


        // Create Driver Account
        // Hash the phone number as password
        const hashedPassword = await bcrypt.hash(phone, 10);
        // Create user account for driver
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: 'driver'
        });
        await user.save();
        console.log('User saved:', user);

        const driver = new Driver({ name, email, phone, busId, licenseNumber, createdBy: req.user._id});
        await driver.save();
        console.log('Driver saved:', driver);


        // res.status(201).json(driver);
        res.status(201).json({ message: 'Driver and user account created', driver });
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