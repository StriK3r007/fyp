const Bus = require('../models/busModel');
const Driver = require('../models/driverModel');

exports.getAnalytics = async (req, res) => {
    try {
        const activeBuses = await Bus.countDocuments({ isActive: true });

        const mostUsedRoutes = await Bus.aggregate([
            { $group: { _id: "$route", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
        ]);

        const driverPerformance = await Driver.aggregate([
            { $lookup: {
                from: "buses",
                localField: "_id",
                foreignField: "driver",
                as: "buses",
            }},
            { $unwind: "$buses" },
            { $group: {
                _id: "$name",
                trips: { $sum: { $size: "$buses.trips" } },
            }},
            { $sort: { trips: -1 } },
        ]);

        res.status(200).json({
            activeBuses,
            mostUsedRoutes,
            driverPerformance,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
