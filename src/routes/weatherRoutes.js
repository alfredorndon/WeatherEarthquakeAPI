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
/**
 * @swagger
 * tags:
 *   name: External Weather Data
 *   description: Endpoints para obtener datos climáticos en tiempo real de APIs externas.
 * /api/weather:
 *   get:
 *     summary: Obtiene datos climáticos en tiempo real de una API externa.
 *     tags: [External Weather Data]
 *     parameters:
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *           enum: [openweathermap, weatherapi]
 *         required: true
 *         description: Fuente de la API (openweathermap o weatherapi).
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre de la ciudad.
 *     responses:
 *       200:
 *         description: Datos climáticos obtenidos exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 source: { type: string, example: "OpenWeatherMap" }
 *                 city: { type: string, example: "Caracas" }
 *                 country: { type: string, example: "VE" }
 *                 temperature: { type: number, format: float, example: 25.5 }
 *                 feelsLike: { type: number, format: float, example: 26.0 }
 *                 minTemp: { type: number, format: float, example: 24.0 }
 *                 maxTemp: { type: number, format: float, example: 27.0 }
 *                 humidity: { type: number, example: 70 }
 *                 pressure: { type: number, example: 1012 }
 *                 windSpeed: { type: number, example: 5.5 }
 *                 condition: { type: string, example: "Soleado" }
 *                 icon: { type: string, example: "http://openweathermap.org/img/wn/01d.png" }
 *                 timestamp: { type: string, format: date-time, example: "2023-11-20T12:00:00Z" }
 *       400:
 *         description: Parámetros inválidos o faltantes.
 *       404:
 *         description: Ciudad no encontrada en la fuente.
 *       500:
 *         description: Error interno del servidor.
 *       502:
 *         description: Error de la API externa (Bad Gateway).
 *       504:
 *         description: Tiempo de espera excedido o sin respuesta de la API externa (Gateway Timeout).
 */
router.get('/', weatherController.getWeatherData);

module.exports = router; 