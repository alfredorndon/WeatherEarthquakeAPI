const EarthquakeReport = require('../models/EarthquakeReport');
const earthquakeReportService = require('../services/earthquakeReportService');
const { validationResult } = require('express-validator'); // Para manejar errores de validación
const logger = require('../config/logger'); // Importa el logger

/**
 * @swagger
 * tags:
 * name: Earthquake Reports
 * description: Endpoints para gestionar reportes sísmicos personalizados (CRUD).
 */

/**
 * @swagger
 * /api/earthquakes/reports:
 * post:
 * summary: Guarda un reporte sísmico personalizado.
 * tags: [Earthquake Reports]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/EarthquakeReport'
 * responses:
 * 201:
 * description: Reporte creado exitosamente.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/EarthquakeReport'
 * 400:
 * description: Datos de entrada inválidos.
 * 401:
 * description: No autorizado, token faltante o inválido.
 */
exports.createReport = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.warn('Validation error during earthquake report creation', { errors: errors.array(), body: req.body });
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const savedReport = await earthquakeReportService.createEarthquakeReport(req.body);
        logger.info('Earthquake report created successfully', { reportId: savedReport._id, user: req.user ? req.user.email : 'N/A' });
        res.status(201).json(savedReport);
    } catch (error) {
        logger.error('Error creating earthquake report', { error: error.message, body: req.body, user: req.user ? req.user.email : 'N/A' });
        res.status(500).json({ message: 'Error interno del servidor al crear el reporte sísmico.', error: error.message });
    }
};

/**
 * @swagger
 * /api/earthquakes/reports:
 * get:
 * summary: Retorna todos los reportes sísmicos personalizados con paginación, filtrado y ordenamiento.
 * tags: [Earthquake Reports]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: query
 * name: minMagnitude
 * schema: { type: number }
 * description: Magnitud mínima para filtrar.
 * - in: query
 * name: maxMagnitude
 * schema: { type: number }
 * description: Magnitud máxima para filtrar.
 * - in: query
 * name: minDepth
 * schema: { type: number }
 * description: Profundidad mínima para filtrar.
 * - in: query
 * name: maxDepth
 * schema: { type: number }
 * description: Profundidad máxima para filtrar.
 * - in: query
 * name: location
 * schema: { type: string }
 * description: Filtra por ubicación (ej. ciudad o país).
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
 * schema: { type: string, enum: ['date', 'magnitude', 'depth', 'location'] }
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
 * description: Lista de reportes sísmicos.
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
 * $ref: '#/components/schemas/EarthquakeReport'
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
            location: req.query.location,
            minMagnitude: req.query.minMagnitude,
            maxMagnitude: req.query.maxMagnitude,
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder
        };

        const result = await earthquakeReportService.getAllEarthquakeReports(options);
        
        logger.info('Earthquake reports fetched successfully with filters', { options, totalCount: result.totalCount, user: req.user ? req.user.email : 'N/A' });
        res.status(200).json(result);
    } catch (error) {
        logger.error('Error fetching all earthquake reports', { error: error.message, query: req.query, user: req.user ? req.user.email : 'N/A' });
        res.status(500).json({ message: 'Error interno del servidor al obtener los reportes sísmicos.', error: error.message });
    }
};

/**
 * @swagger
 * /api/earthquakes/reports/history/{country}:
 * get:
 * summary: Retorna todos los sismos reportados en un país específico.
 * tags: [Earthquake Reports]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: country
 * schema:
 * type: string
 * required: true
 * description: Nombre del país.
 * responses:
 * 200:
 * description: Historial de sismos.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/EarthquakeReport'
 * 500:
 * description: Error interno del servidor.
 * 401:
 * description: No autorizado, token faltante o inválido.
 */
exports.getHistoryByCountry = async (req, res) => {
    try {
        const country = req.params.country;
        const reports = await EarthquakeReport.find({ location: { $regex: country, $options: 'i' } }).sort({ date: -1 });
        logger.info('Earthquake history fetched successfully for country', { country, count: reports.length, user: req.user ? req.user.email : 'N/A' });
        res.status(200).json(reports);
    } catch (error) {
        logger.error('Error fetching earthquake history by country', { error: error.message, country: req.params.country, user: req.user ? req.user.email : 'N/A' });
        res.status(500).json({ message: 'Error interno del servidor al obtener el historial sísmico.', error: error.message });
    }
};

/**
 * @swagger
 * /api/earthquakes/reports/{id}:
 * put:
 * summary: Actualiza un reporte sísmico personalizado por ID.
 * tags: [Earthquake Reports]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * schema:
 * type: string
 * required: true
 * description: ID del reporte sísmico.
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/EarthquakeReport'
 * responses:
 * 200:
 * description: Reporte actualizado exitosamente.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/EarthquakeReport'
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
        logger.warn('Validation error during earthquake report update', { errors: errors.array(), body: req.body, reportId: req.params.id });
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id } = req.params;
        const updatedReport = await earthquakeReportService.updateEarthquakeReport(id, req.body);

        if (!updatedReport) {
            logger.info('Earthquake report not found for update', { reportId: id, user: req.user ? req.user.email : 'N/A' });
            return res.status(404).json({ message: 'Reporte sísmico no encontrado.' });
        }
        logger.info('Earthquake report updated successfully', { reportId: updatedReport._id, user: req.user ? req.user.email : 'N/A' });
        res.status(200).json(updatedReport);
    } catch (error) {
        logger.error('Error updating earthquake report', { error: error.message, reportId: req.params.id, body: req.body, user: req.user ? req.user.email : 'N/A' });
        res.status(500).json({ message: 'Error interno del servidor al actualizar el reporte sísmico.', error: error.message });
    }
};

/**
 * @swagger
 * /api/earthquakes/reports/{id}:
 * delete:
 * summary: Elimina un registro sísmico personalizado por ID.
 * tags: [Earthquake Reports]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * schema:
 * type: string
 * required: true
 * description: ID del reporte sísmico.
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
        const deletedReport = await EarthquakeReport.findByIdAndDelete(id);

        if (!deletedReport) {
            logger.info('Earthquake report not found for deletion', { reportId: id, user: req.user ? req.user.email : 'N/A' });
            return res.status(404).json({ message: 'Reporte sísmico no encontrado.' });
        }
        logger.info('Earthquake report deleted successfully', { reportId: deletedReport._id, user: req.user ? req.user.email : 'N/A' });
        res.status(200).json({ message: 'Reporte eliminado exitosamente.' });
    } catch (error) {
        logger.error('Error deleting earthquake report', { error: error.message, reportId: req.params.id, user: req.user ? req.user.email : 'N/A' });
        res.status(500).json({ message: 'Error interno del servidor al eliminar el reporte sísmico.', error: error.message });
    }
}; 