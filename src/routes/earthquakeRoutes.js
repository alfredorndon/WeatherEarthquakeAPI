const express = require('express');
const router = express.Router();
const earthquakeReportController = require('../controllers/earthquakeReportController');
const earthquakeController = require('../controllers/earthquakeController');
// const { validateEarthquakeReport } = require('../middleware/earthquakeValidation'); // Si tienes un middleware de validación para reportes

// ======================================
// Rutas para Reportes Sísmicos PERSONALIZADOS (CRUD - tu base de datos)
// ======================================
/**
 * @swagger
 * tags:
 *   name: Earthquake Reports
 *   description: Endpoints para gestionar reportes sísmicos personalizados (CRUD).
 * /api/earthquakes/reports:
 *   post:
 *     summary: Guarda un reporte sísmico personalizado.
 *     tags: [Earthquake Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               magnitude: { type: number, format: float, example: 5.5 }
 *               depth: { type: number, format: float, example: 10.2 }
 *               location: { type: string, example: "Chile, Valparaíso" }
 *               date: { type: string, format: date-time, example: "2023-10-26T14:30:00Z" }
 *             required:
 *               - magnitude
 *               - depth
 *               - location
 *               - date
 *     responses:
 *       201:
 *         description: Reporte creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EarthquakeReport'
 *       400:
 *         description: Datos de entrada inválidos.
 */
router.post('/reports', /* validateEarthquakeReport, */ earthquakeReportController.createReport);

/**
 * @swagger
 * /api/earthquakes/reports:
 *   get:
 *     summary: Retorna todos los reportes sísmicos personalizados.
 *     tags: [Earthquake Reports]
 *     responses:
 *       200:
 *         description: Lista de reportes sísmicos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EarthquakeReport'
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/reports', earthquakeReportController.getAllReports);

/**
 * @swagger
 * /api/earthquakes/reports/history/{country}:
 *   get:
 *     summary: Retorna todos los sismos reportados en un país específico.
 *     tags: [Earthquake Reports]
 *     parameters:
 *       - in: path
 *         name: country
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre del país.
 *     responses:
 *       200:
 *         description: Historial de sismos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EarthquakeReport'
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/reports/history/:country', earthquakeReportController.getHistoryByCountry);

/**
 * @swagger
 * /api/earthquakes/reports/{id}:
 *   delete:
 *     summary: Elimina un registro sísmico personalizado por ID.
 *     tags: [Earthquake Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del reporte sísmico.
 *     responses:
 *       200:
 *         description: Reporte eliminado exitosamente.
 *       404:
 *         description: Reporte no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.delete('/reports/:id', earthquakeReportController.deleteReport);

// ======================================
// Rutas para Datos Sísmicos de APIs EXTERNAS (en tiempo real)
// ======================================
/**
 * @swagger
 * tags:
 *   name: External Earthquake Data
 *   description: Endpoints para obtener datos sísmicos en tiempo real de APIs externas.
 * /api/earthquakes:
 *   get:
 *     summary: Obtiene datos sísmicos en tiempo real de una API externa.
 *     tags: [External Earthquake Data]
 *     parameters:
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *           enum: [usgs, emsc]
 *         required: true
 *         description: Fuente de la API (usgs o emsc).
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         required: false
 *         description: Nombre del país para filtrar los sismos. (Nota: USGS no filtra directamente por país, se filtra post-request)
 *       - in: query
 *         name: minmagnitude
 *         schema:
 *           type: number
 *           format: float
 *         required: false
 *         description: Magnitud mínima del sismo.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Número máximo de resultados.
 *       - in: query
 *         name: starttime
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Fecha de inicio para la búsqueda (YYYY-MM-DD).
 *       - in: query
 *         name: endtime
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Fecha de fin para la búsqueda (YYYY-MM-DD).
 *     responses:
 *       200:
 *         description: Datos sísmicos obtenidos exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   source: { type: string, example: "USGS" }
 *                   id: { type: string, example: "usgs-12345" }
 *                   magnitude: { type: number, format: float, example: 6.2 }
 *                   location: { type: string, example: "30km SW of Santiago, Chile" }
 *                   time: { type: string, format: "date-time", example: "2023-11-20T10:00:00Z" }
 *                   tzOffset: { type: number, example: -240 }
 *                   url: { type: string, example: "https://earthquake.usgs.gov/earthquakes/eventpage/usgs-12345" }
 *                   longitude: { type: number, example: -71.5 }
 *                   latitude: { type: number, example: -33.5 }
 *                   depth: { type: number, example: 50.0 }
 *       400:
 *         description: Parámetros inválidos o faltantes.
 *       500:
 *         description: Error interno del servidor.
 *       501:
 *         description: La fuente de la API no está implementada.
 *       502:
 *         description: Error de la API externa (Bad Gateway).
 *       504:
 *         description: Tiempo de espera excedido o sin respuesta de la API externa (Gateway Timeout).
 */
router.get('/', earthquakeController.getEarthquakeData);

module.exports = router; 