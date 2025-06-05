const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: false // only if not every driver has a bus immediately
    },
    // busId: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    assignedBus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Added userId
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);


// name, email, phone, busId, licenseNumber, password