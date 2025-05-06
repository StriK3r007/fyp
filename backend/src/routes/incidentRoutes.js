const express = require('express');
const { reportIncident, getIncidents, updateIncident } = require('../controllers/incidentController');
const { checkRole } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', reportIncident);
router.get('/', checkRole(['admin', 'super-admin']), getIncidents);
router.put('/:id', checkRole(['admin', 'super-admin']), updateIncident);

module.exports = router;
