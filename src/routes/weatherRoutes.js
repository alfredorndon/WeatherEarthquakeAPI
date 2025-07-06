const express = require('express');
const router = express.Router();
const weatherReportController = require('../controllers/weatherReportController');
const weatherController = require('../controllers/weatherController');
const { validateWeatherReport, validateWeatherReportUpdate } = require('../middleware/weatherValidation');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /weather/reports:
 *   post:
 *     summary: Crear un nuevo reporte meteorológico personalizado
 *     description: Crea un reporte meteorológico personalizado asociado al usuario autenticado
 *     tags: [Weather Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WeatherReport'
 *     responses:
 *       201:
 *         description: Reporte creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WeatherReport'
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
router.post('/reports', protect, validateWeatherReport, weatherReportController.createReport);

/**
 * @swagger
 * /weather/reports:
 *   get:
 *     summary: Obtener todos los reportes meteorológicos del usuario
 *     description: Obtiene una lista paginada de reportes meteorológicos con opciones de filtrado y ordenamiento
 *     tags: [Weather Reports]
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
 *         name: city
 *         schema:
 *           type: string
 *         description: Filtrar por ciudad
 *       - in: query
 *         name: condition
 *         schema:
 *           type: string
 *           enum: [Soleado, Nublado, Lluvioso, Tormenta]
 *         description: Filtrar por condición meteorológica
 *       - in: query
 *         name: minTemp
 *         schema:
 *           type: number
 *         description: Temperatura mínima para filtrar
 *       - in: query
 *         name: maxTemp
 *         schema:
 *           type: number
 *         description: Temperatura máxima para filtrar
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [date, temperature, city, createdAt]
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
 *               $ref: '#/components/schemas/PaginatedWeatherResponse'
 *       401:
 *         description: No autorizado - Token requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/reports', protect, weatherReportController.getAllReports);

/**
 * @swagger
 * /weather/reports/history/{city}:
 *   get:
 *     summary: Obtener historial de reportes por ciudad
 *     description: Obtiene el historial completo de reportes meteorológicos para una ciudad específica
 *     tags: [Weather Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre de la ciudad
 *     responses:
 *       200:
 *         description: Historial obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WeatherReport'
 *       401:
 *         description: No autorizado - Token requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: No se encontraron reportes para la ciudad especificada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/reports/history/:city', protect, weatherReportController.getHistoryByCity);

/**
 * @swagger
 * /weather/reports/{id}:
 *   put:
 *     summary: Actualizar un reporte meteorológico
 *     description: Actualiza un reporte meteorológico existente del usuario autenticado
 *     tags: [Weather Reports]
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
 *             $ref: '#/components/schemas/WeatherReportUpdate'
 *     responses:
 *       200:
 *         description: Reporte actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WeatherReport'
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
router.put('/reports/:id', protect, validateWeatherReportUpdate, weatherReportController.updateReport);

/**
 * @swagger
 * /weather/reports/{id}:
 *   delete:
 *     summary: Eliminar un reporte meteorológico
 *     description: Elimina un reporte meteorológico del usuario autenticado
 *     tags: [Weather Reports]
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
router.delete('/reports/:id', protect, weatherReportController.deleteReport);

/**
 * @swagger
 * /weather:
 *   get:
 *     summary: Obtener datos climáticos en tiempo real
 *     description: Obtiene datos climáticos en tiempo real de APIs externas (OpenWeatherMap o WeatherAPI)
 *     tags: [External Weather Data]
 *     parameters:
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *           enum: [openweathermap, weatherapi]
 *         required: true
 *         description: Fuente de la API (openweathermap o weatherapi)
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre de la ciudad
 *     responses:
 *       200:
 *         description: Datos climáticos obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExternalWeatherData'
 *       400:
 *         description: Parámetros inválidos o faltantes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Ciudad no encontrada en la fuente
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
router.get('/', weatherController.getWeatherData);

module.exports = router; 