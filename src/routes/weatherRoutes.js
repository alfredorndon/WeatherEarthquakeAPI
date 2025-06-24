const express = require('express');
const router = express.Router();
const weatherReportController = require('../controllers/weatherReportController');
const { validateWeatherReport } = require('../middleware/weatherValidation');

// Rutas para reportes personalizados de clima
router.post('/', validateWeatherReport, weatherReportController.createReport); // Guarda un reporte climático personalizado
router.get('/', weatherReportController.getAllReports); // Obtiene todos los reportes
router.get('/history/:city', weatherReportController.getHistoryByCity); // Historial por ciudad
router.delete('/:id', weatherReportController.deleteReport); // Elimina un reporte

module.exports = router; 