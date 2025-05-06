const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
    reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, default: 'Pending' },
});

module.exports = mongoose.model('Incident', incidentSchema);
