const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const busRoutes = require('./routes/busRoutes');
const stopRoutes = require('./routes/stopRoutes');
const driverRoutes = require('./routes/driverRoutes');
const authMiddleware = require('./middlewares/authMiddleware');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/stops', stopRoutes);
app.use('/api/drivers', driverRoutes);
// Apply the authMiddleware to protect all routes before applying checkRole
app.use('/api/drivers', authMiddleware, driverRoutes);

module.exports = app;
