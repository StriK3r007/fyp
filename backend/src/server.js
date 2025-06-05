const express = require("express");
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const app = require('./app');
const mongoose = require('mongoose');
const mongoURI = process.env.MONGO_URI;
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const Driver = require('./models/driverModel'); //driverModel
const Bus = require('./models/busModel'); //busModel
// const app = express();


const PORT = process.env.PORT || 5000;

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// App setup
const server = http.createServer(app); // Use the existing 'app' created in './app'

// old Code
/*
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Update this to your frontend's URL
    methods: ["GET", "POST"]
  }
});
*/

// new Code 
const io = require('socket.io')(server, {
  cors: { origin: 'http://localhost:5173' }
});

// Middleware
app.use(cors());
app.use(express.json());

// Socket.IO connection (old)
/*
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for location updates from drivers
  socket.on('busLocationUpdate', (data) => {
    console.log('Bus location update:', data);
    // Check if the bus is nearing a stop
    const { busId, latitude, longitude, stopLocation } = data;
    const distance = calculateDistance(latitude, longitude, stopLocation.latitude, stopLocation.longitude);
    if (distance < 500) { // Example: Notify if within 500 meters
      io.emit('notification', {
        message: `Bus ${busId} is nearing stop ${stopLocation.name}`,
      });
    }

    io.emit('locationUpdate', data); // Broadcast location to all connected clients
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
*/

io.on('connection', (socket) => {
  console.log('Driver connected');
  socket.emit('testEvent', { message: 'Hello from server!' }); // Emit on connection

  socket.on('locationUpdate', async ({ latitude, longitude, driverId }) => {
    console.log(`Received location from driver  ${driverId}:`, latitude, longitude);
    console.log('Driver ID received in locationUpdate:', driverId); // ADD THIS LINE
    socket.emit('testEvent', { message: 'Hello from server!' });

    // Update driver/bus location in DB or in-memory store
    await Driver.findByIdAndUpdate(driverId, {
      currentLocation: { latitude, longitude },
    });

    // Optionally: Save to DB if needed
    await Bus.findOneAndUpdate({ driver: driverId  }, {
      // $set: {
      //   "location.latitude": latitude,
      //   "location.longitude": longitude
      // }
      currentLocation: { latitude, longitude },
    });

    // You can also emit it to public map viewers
    io.emit('busLocationUpdate', { driverId, latitude, longitude });
  });

  socket.on('disconnect', () => {
    console.log('Driver disconnected');
  });
});

// Helper function to calculate distance
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371e3; // Earth radius in meters
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

// MongoDB connection
if (!mongoURI) {
  console.error('MongoDB URI is not defined in .env file!');
  process.exit(1); // Exit if the URI is not defined
}

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// 
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Server start
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));