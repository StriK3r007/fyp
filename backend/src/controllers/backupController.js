const Bus = require('../models/busModel');
const Stop = require('../models/stopModel');
const Driver = require('../models/driverModel');

exports.backupData = async (req, res) => {
    try {
        const buses = await Bus.find();
        const stops = await Stop.find();
        const drivers = await Driver.find();

        res.status(200).json({
            buses,
            stops,
            drivers,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.restoreData = async (req, res) => {
    const { buses, stops, drivers } = req.body;
    try {
        if (buses) {
            await Bus.deleteMany();
            await Bus.insertMany(buses);
        }
        if (stops) {
            await Stop.deleteMany();
            await Stop.insertMany(stops);
        }
        if (drivers) {
            await Driver.deleteMany();
            await Driver.insertMany(drivers);
        }

        res.status(200).json({ message: 'Data restored successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
