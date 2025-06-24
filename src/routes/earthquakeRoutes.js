const express = require('express');
const router = express.Router();
const earthquakeReportController = require('../controllers/earthquakeReportController');
const earthquakeController = require('../controllers/earthquakeController');
const { validateEarthquakeReport } = require('../middleware/earthquakeValidation');

// Rutas para reportes personalizados (CRUD)
router.post('/reports', validateEarthquakeReport, earthquakeReportController.createReport);
router.get('/reports', earthquakeReportController.getAllReports);
// Historial por país (opcional, puedes implementar getHistoryByCountry en el controlador si lo deseas)
// router.get('/reports/history/:country', earthquakeReportController.getHistoryByCountry);
router.delete('/reports/:id', earthquakeReportController.deleteReport);

// Rutas para datos sísmicos de APIs externas
router.get('/', earthquakeController.getEarthquakeData);

module.exports = router; 