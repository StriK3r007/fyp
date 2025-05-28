const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
    },
    route: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Stop', stopSchema);