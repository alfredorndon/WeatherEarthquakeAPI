const express = require('express');
const router = express.Router();
const weatherReportController = require('../controllers/weatherReportController');
const weatherController = require('../controllers/weatherController');
const { validateWeatherReport } = require('../middleware/weatherValidation');

// Rutas para reportes personalizados (CRUD)
router.post('/reports', validateWeatherReport, weatherReportController.createReport);
router.get('/reports', weatherReportController.getAllReports);
router.get('/reports/history/:city', weatherReportController.getHistoryByCity);
router.delete('/reports/:id', weatherReportController.deleteReport);

// Rutas para datos climáticos de APIs externas
router.get('/', weatherController.getWeatherData);

module.exports = router; 