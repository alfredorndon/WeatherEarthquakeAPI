const express = require('express');
const router = express.Router();
const earthquakeReportController = require('../controllers/earthquakeReportController');
const { validateEarthquakeReport } = require('../middleware/earthquakeValidation');

// Rutas para reportes personalizados de sismos
router.post('/', validateEarthquakeReport, earthquakeReportController.createReport); // Guarda un reporte de sismo personalizado
router.get('/', earthquakeReportController.getAllReports); // Obtiene todos los reportes
router.get('/history/:location', earthquakeReportController.getHistoryByLocation); // Historial por ubicación
router.delete('/:id', earthquakeReportController.deleteReport); // Elimina un reporte

module.exports = router; 