const WeatherReport = require('../models/WeatherReport');
const weatherReportService = require('../services/weatherReportService');
const { validationResult } = require('express-validator'); // Para manejar errores de validación
const logger = require('../config/logger'); // Importa el logger

/**
 * @swagger
 * tags:
 * name: Weather Reports
 * description: Endpoints para gestionar reportes climáticos personalizados (CRUD).
 */

/**
 * @swagger
 * /api/weather/reports:
 * post:
 * summary: Guarda un reporte climático personalizado.
 * tags: [Weather Reports]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/WeatherReport'
 * responses:
 * 201:
 * description: Reporte creado exitosamente.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/WeatherReport'
 * 400:
 * description: Datos de entrada inválidos.
 * 401:
 * description: No autorizado, token faltante o inválido.
 */
exports.createReport = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.warn('Validation error during weather report creation', { errors: errors.array(), body: req.body });
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const savedReport = await weatherReportService.createWeatherReport(req.body);
        logger.info('Weather report created successfully', { reportId: savedReport._id, user: req.user ? req.user.email : 'N/A' });
        res.status(201).json(savedReport);
    } catch (error) {
        logger.error('Error creating weather report', { error: error.message, body: req.body, user: req.user ? req.user.email : 'N/A' });
        res.status(500).json({ message: 'Error interno del servidor al crear el reporte climático.', error: error.message });
    }
};

/**
 * @swagger
 * /api/weather/reports:
 * get:
 * summary: Retorna todos los reportes climáticos personalizados con paginación, filtrado y ordenamiento.
 * tags: [Weather Reports]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: query
 * name: city
 * schema: { type: string }
 * description: Filtra por ciudad.
 * - in: query
 * name: minTemperature
 * schema: { type: number }
 * description: Temperatura mínima para filtrar.
 * - in: query
 * name: maxTemperature
 * schema: { type: number }
 * description: Temperatura máxima para filtrar.
 * - in: query
 * name: condition
 * schema: { type: string, enum: ['Soleado', 'Nublado', 'Lluvioso', 'Tormenta'] }
 * description: Filtra por condición climática.
 * - in: query
 * name: startDate
 * schema: { type: string, format: date }
 * description: Fecha de inicio para filtrar (YYYY-MM-DD).
 * - in: query
 * name: endDate
 * schema: { type: string, format: date }
 * description: Fecha de fin para filtrar (YYYY-MM-DD).
 * - in: query
 * name: sortBy
 * schema: { type: string, enum: ['date', 'temperature', 'city'] }
 * description: Campo por el cual ordenar los resultados.
 * - in: query
 * name: sortOrder
 * schema: { type: string, enum: ['asc', 'desc'] }
 * description: Orden de clasificación (ascendente o descendente).
 * - in: query
 * name: page
 * schema: { type: integer, default: 1 }
 * description: Número de página.
 * - in: query
 * name: limit
 * schema: { type: integer, default: 10 }
 * description: Número de elementos por página.
 * responses:
 * 200:
 * description: Lista de reportes climáticos.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * totalCount: { type: integer, example: 50 }
 * page: { type: integer, example: 1 }
 * limit: { type: integer, example: 10 }
 * totalPages: { type: integer, example: 5 }
 * data:
 * type: array
 * items:
 * $ref: '#/components/schemas/WeatherReport'
 * 500:
 * description: Error interno del servidor.
 * 401:
 * description: No autorizado, token faltante o inválido.
 */
exports.getAllReports = async (req, res) => {
    try {
        const options = {
            page: req.query.page,
            limit: req.query.limit,
            city: req.query.city,
            condition: req.query.condition,
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder
        };

        const result = await weatherReportService.getAllWeatherReports(options);
        
        logger.info('Weather reports fetched successfully with filters', { options, totalCount: result.totalCount, user: req.user ? req.user.email : 'N/A' });
        res.status(200).json(result);
    } catch (error) {
        logger.error('Error fetching all weather reports', { error: error.message, query: req.query, user: req.user ? req.user.email : 'N/A' });
        res.status(500).json({ message: 'Error interno del servidor al obtener los reportes climáticos.', error: error.message });
    }
};

/**
 * @swagger
 * /api/weather/reports/history/{city}:
 * get:
 * summary: Retorna todos los reportes climáticos en una ciudad específica.
 * tags: [Weather Reports]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: city
 * schema:
 * type: string
 * required: true
 * description: Nombre de la ciudad.
 * responses:
 * 200:
 * description: Historial de reportes climáticos.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/WeatherReport'
 * 500:
 * description: Error interno del servidor.
 * 401:
 * description: No autorizado, token faltante o inválido.
 */
exports.getHistoryByCity = async (req, res) => {
    try {
        const city = req.params.city;
        const reports = await WeatherReport.find({ city: { $regex: city, $options: 'i' } }).sort({ date: -1 });
        logger.info('Weather history fetched successfully for city', { city, count: reports.length, user: req.user ? req.user.email : 'N/A' });
        res.status(200).json(reports);
    } catch (error) {
        logger.error('Error fetching weather history by city', { error: error.message, city: req.params.city, user: req.user ? req.user.email : 'N/A' });
        res.status(500).json({ message: 'Error interno del servidor al obtener el historial climático.', error: error.message });
    }
};

/**
 * @swagger
 * /api/weather/reports/{id}:
 * put:
 * summary: Actualiza un reporte climático personalizado por ID.
 * tags: [Weather Reports]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * schema:
 * type: string
 * required: true
 * description: ID del reporte climático.
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/WeatherReport'
 * responses:
 * 200:
 * description: Reporte actualizado exitosamente.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/WeatherReport'
 * 400:
 * description: Datos de entrada inválidos.
 * 404:
 * description: Reporte no encontrado.
 * 401:
 * description: No autorizado, token faltante o inválido.
 * 500:
 * description: Error interno del servidor.
 */
exports.updateReport = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.warn('Validation error during weather report update', { errors: errors.array(), body: req.body, reportId: req.params.id });
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id } = req.params;
        const updatedReport = await weatherReportService.updateWeatherReport(id, req.body);

        if (!updatedReport) {
            logger.info('Weather report not found for update', { reportId: id, user: req.user ? req.user.email : 'N/A' });
            return res.status(404).json({ message: 'Reporte climático no encontrado.' });
        }
        logger.info('Weather report updated successfully', { reportId: updatedReport._id, user: req.user ? req.user.email : 'N/A' });
        res.status(200).json(updatedReport);
    } catch (error) {
        logger.error('Error updating weather report', { error: error.message, reportId: req.params.id, body: req.body, user: req.user ? req.user.email : 'N/A' });
        res.status(500).json({ message: 'Error interno del servidor al actualizar el reporte climático.', error: error.message });
    }
};

/**
 * @swagger
 * /api/weather/reports/{id}:
 * delete:
 * summary: Elimina un registro climático personalizado por ID.
 * tags: [Weather Reports]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * schema:
 * type: string
 * required: true
 * description: ID del reporte climático.
 * responses:
 * 200:
 * description: Reporte eliminado exitosamente.
 * 404:
 * description: Reporte no encontrado.
 * 401:
 * description: No autorizado, token faltante o inválido.
 * 500:
 * description: Error interno del servidor.
 */
exports.deleteReport = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedReport = await WeatherReport.findByIdAndDelete(id);

        if (!deletedReport) {
            logger.info('Weather report not found for deletion', { reportId: id, user: req.user ? req.user.email : 'N/A' });
            return res.status(404).json({ message: 'Reporte climático no encontrado.' });
        }
        logger.info('Weather report deleted successfully', { reportId: deletedReport._id, user: req.user ? req.user.email : 'N/A' });
        res.status(200).json({ message: 'Reporte eliminado exitosamente.' });
    } catch (error) {
        logger.error('Error deleting weather report', { error: error.message, reportId: req.params.id, user: req.user ? req.user.email : 'N/A' });
        res.status(500).json({ message: 'Error interno del servidor al eliminar el reporte climático.', error: error.message });
    }
}; 