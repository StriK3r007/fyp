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

        const driver = new Driver({ name, email, phone, busId, licenseNumber, assignedBus: busId, userId: user._id, createdBy: req.user._id}); // Assign busId to assignedBus
        await driver.save();
        console.log('Driver saved:', driver);

        res.status(201).json({ message: 'Driver and user account created', driver });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating driver', error: err.message }); 
    }
};

// Get all Drivers
exports.getDrivers = async (req, res) => {
    try {
        const drivers = await Driver.find().populate('busId');
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
        // Find the driver by ID
        const driver = await Driver.findById(id);
        if (!driver) {
            return res.status(404).json({ error: 'Driver not found' });
        }

        // Update the Driver document
        const updatedDriver = await Driver.findByIdAndUpdate(id, updates, { new: true });

        // Update the corresponding User (matched by email)
        const user = await User.findOne({ email: driver.email });
        if (user) {
            const userUpdates = {
                name: updates.name || user.name,
                email: updates.email || user.email,
            };

            // If the email is being updated, change it
            if (updates.email && updates.email !== user.email) {
                const emailExists = await User.findOne({ email: updates.email });
                if (emailExists && emailExists._id.toString() !== user._id.toString()) {
                    return res.status(400).json({ error: 'Email is already in use by another user' });
                }
                userUpdates.email = updates.email;
            }

            await User.findByIdAndUpdate(user._id, userUpdates, { new: true });
        }

        // const driver = await Driver.findByIdAndUpdate(id, updates, { new: true });
        // if (!driver) return res.status(404).json({ error: 'Driver not found' });
        res.status(200).json(updatedDriver);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete a Driver
exports.deleteDriver = async (req, res) => {
    const { id } = req.params;
    try {
        // 1. Find the driver by ID
        const driver = await Driver.findById(id);
        if (!driver) return res.status(404).json({ error: 'Driver not found' });

        // 2. Delete the corresponding user by email
        const deletedUser = await User.findOneAndDelete({ email: driver.email });
        if (!deletedUser) {
            console.warn('Associated user not found or already deleted');
        }

        // 3. Delete the driver record
        await Driver.findByIdAndDelete(id);
        console.log(`Deleted driver ${driver.name} and user ${deletedUser?.email}`);
        // const driver = await Driver.findByIdAndDelete(id);
        // if (!driver) return res.status(404).json({ error: 'Driver not found' });
        res.status(200).json({ message: 'Driver deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};