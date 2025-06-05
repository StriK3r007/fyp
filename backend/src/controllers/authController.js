const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Driver = require('../models/driverModel');
const Bus = require('../models/busModel');
const jwtUtils = require('../utils/jwtUtils');


// Register a User
exports.registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Validate role
    const validRoles = ['admin', 'driver', 'user'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already in use" });
        }

        // Hash the password and create a new user instance
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(400).json({ message: "Error registering user", error: err.message });
    }
};

// Get a User by ID
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Generate JWT token and send it back as response
        // const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const token = jwtUtils.generateToken({ id: user._id, role: user.role });


        // Send token and user info
        res.json({
            message: 'Login successful.',
            token,
            user: {
                id: user._id,
                name: user.name, // <-- Add this
                email: user.email,
                role: user.role,
            },
        });

        // res.status(200).json({ token });
    } catch (err) {
        // res.status(500).json({ error: err.message });
        res.status(500).json({ message: 'Internal server error.', error: err.message });
    }
};

// Update a User
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        // If password is being updated, hash it again
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        const user = await User.findByIdAndUpdate(id, updates, { new: true });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete a User
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndDelete(id, { isDeleted: true }, { new: true });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get logged in user
exports.getLoggedInUser = async (req, res) => {
    try {
        // 1. Find the User
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        // let driverInfo = null;
        let assignedBus = null;

        if (user.role === 'driver') {
            // 2. Find the corresponding Driver and populate assignedBus
            const driver = await Driver.findOne({ email: user.email }).populate('assignedBus');
            if (driver) {
                // driverInfo = { assignedBus: driver.assignedBus };
                assignedBus = driver.assignedBus;
            }
        }

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            assignedBus: assignedBus, // Include the assignedBus here
        });
    } catch (err) {
        console.error('Error fetching logged-in user:', err);
        res.status(500).json({ message: 'Error fetching user data', error: err.message });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // exclude password
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch users', error: err.message });
    }
};

// Update Password

exports.changePassword = async (req, res) => {
    console.log("Request hit changePassword");
    console.log("req.user:", req.user);
    console.log("req.body:", req.body);

    const { currentPassword, newPassword } = req.body;
    // Assuming you have a JWT middleware that populates req.user with the authenticated user's ID
    const userId = req.user.id; // This comes from your JWT token's payload

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current password and new password are required." });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            // This should ideally not happen if JWT middleware is working, but as a safeguard
            return res.status(404).json({ message: "User not found." });
        }

        // 1. Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect current password." });
        }

        // 2. Add New Password Validation
        if (newPassword.length < 8) { // Example: minimum 8 characters
            return res.status(400).json({ message: "New password must be at least 8 characters long." });
        }
        if (newPassword === currentPassword) { // Prevent changing to the same password
            return res.status(400).json({ message: "New password cannot be the same as the current password." });
        }

        // 3. Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 4. Update the user's password in the database
        user.password = hashedPassword;
        await user.save(); // Using .save() on the document is often preferred for middlewares

        // Optional: Invalidate old tokens / force re-login for security
        // For simplicity, we'll just send success message here

        res.status(200).json({ message: "Password updated successfully." });

    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: "Server error during password change.", error: error.message });
    }
};