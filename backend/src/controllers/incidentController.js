const Incident = require('../models/incidentModel');

exports.reportIncident = async (req, res) => {
    const { reporterId, description } = req.body;
    try {
        const incident = await Incident.create({ reporterId, description });
        res.status(201).json(incident);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getIncidents = async (req, res) => {
    try {
        const incidents = await Incident.find().populate('reporterId', 'name');
        res.status(200).json(incidents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateIncident = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const incident = await Incident.findByIdAndUpdate(id, { status }, { new: true });
        res.status(200).json(incident);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
