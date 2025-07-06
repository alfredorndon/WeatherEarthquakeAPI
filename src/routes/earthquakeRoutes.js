const express = require('express');
const router = express.Router();
const earthquakeReportController = require('../controllers/earthquakeReportController');
const earthquakeController = require('../controllers/earthquakeController');
const { protect } = require('../middleware/authMiddleware');
const { validateEarthquakeReport, validateEarthquakeReportUpdate } = require('../middleware/earthquakeValidation');

/**
 * @swagger
 * /earthquakes/reports:
 *   post:
 *     summary: Crear un nuevo reporte sísmico personalizado
 *     description: Crea un reporte sísmico personalizado asociado al usuario autenticado
 *     tags: [Earthquake Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EarthquakeReport'
 *     responses:
 *       201:
 *         description: Reporte creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EarthquakeReport'
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado - Token requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/reports', protect, validateEarthquakeReport, earthquakeReportController.createReport);

/**
 * @swagger
 * /earthquakes/reports:
 *   get:
 *     summary: Obtener todos los reportes sísmicos del usuario
 *     description: Obtiene una lista paginada de reportes sísmicos con opciones de filtrado y ordenamiento
 *     tags: [Earthquake Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Número de elementos por página
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filtrar por ubicación
 *       - in: query
 *         name: minMagnitude
 *         schema:
 *           type: number
 *         description: Magnitud mínima para filtrar
 *       - in: query
 *         name: maxMagnitude
 *         schema:
 *           type: number
 *         description: Magnitud máxima para filtrar
 *       - in: query
 *         name: minDepth
 *         schema:
 *           type: number
 *         description: Profundidad mínima para filtrar
 *       - in: query
 *         name: maxDepth
 *         schema:
 *           type: number
 *         description: Profundidad máxima para filtrar
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [date, magnitude, depth, location, createdAt]
 *           default: createdAt
 *         description: Campo por el cual ordenar
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Orden de clasificación
 *     responses:
 *       200:
 *         description: Lista de reportes obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedEarthquakeResponse'
 *       401:
 *         description: No autorizado - Token requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/reports', protect, earthquakeReportController.getAllReports);

/**
 * @swagger
 * /earthquakes/reports/history/{country}:
 *   get:
 *     summary: Obtener historial de reportes por país
 *     description: Obtiene el historial completo de reportes sísmicos para un país específico
 *     tags: [Earthquake Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: country
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del país
 *     responses:
 *       200:
 *         description: Historial obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EarthquakeReport'
 *       401:
 *         description: No autorizado - Token requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: No se encontraron reportes para el país especificado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/reports/history/:country', protect, earthquakeReportController.getHistoryByCountry);

/**
 * @swagger
 * /earthquakes/reports/{id}:
 *   put:
 *     summary: Actualizar un reporte sísmico
 *     description: Actualiza un reporte sísmico existente del usuario autenticado
 *     tags: [Earthquake Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del reporte a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EarthquakeReportUpdate'
 *     responses:
 *       200:
 *         description: Reporte actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EarthquakeReport'
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado - Token requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Reporte no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: No autorizado - El reporte no pertenece al usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/reports/:id', protect, validateEarthquakeReportUpdate, earthquakeReportController.updateReport);

/**
 * @swagger
 * /earthquakes/reports/{id}:
 *   delete:
 *     summary: Eliminar un reporte sísmico
 *     description: Elimina un reporte sísmico del usuario autenticado
 *     tags: [Earthquake Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del reporte a eliminar
 *     responses:
 *       200:
 *         description: Reporte eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reporte eliminado exitosamente"
 *       401:
 *         description: No autorizado - Token requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Reporte no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: No autorizado - El reporte no pertenece al usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/reports/:id', protect, earthquakeReportController.deleteReport);

/**
 * @swagger
 * /earthquakes:
 *   get:
 *     summary: Obtener datos sísmicos en tiempo real
 *     description: Obtiene datos sísmicos en tiempo real de APIs externas (USGS)
 *     tags: [External Earthquake Data]
 *     parameters:
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *           enum: [usgs]
 *         required: true
 *         description: Fuente de la API (actualmente solo usgs)
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         required: false
 *         description: Nombre del país para filtrar los sismos
 *       - in: query
 *         name: minmagnitude
 *         schema:
 *           type: number
 *           format: float
 *         required: false
 *         description: Magnitud mínima del sismo
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Número máximo de resultados
 *       - in: query
 *         name: starttime
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Fecha de inicio para la búsqueda (YYYY-MM-DD)
 *       - in: query
 *         name: endtime
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Fecha de fin para la búsqueda (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Datos sísmicos obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ExternalEarthquakeData'
 *       400:
 *         description: Parámetros inválidos o faltantes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       501:
 *         description: La fuente de la API no está implementada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       502:
 *         description: Error de la API externa (Bad Gateway)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       504:
 *         description: Tiempo de espera excedido o sin respuesta de la API externa (Gateway Timeout)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', earthquakeController.getEarthquakeData);

module.exports = router; 