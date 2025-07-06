const openWeatherMapService = require('../services/openWeatherMapService');
const weatherApiService = require('../services/weatherApiService');
const logger = require('../config/logger');

/**
 * @swagger
 * tags:
 * name: External Weather Data
 * description: Endpoints para obtener datos climáticos en tiempo real de APIs externas.
 */

/**
 * @swagger
 * /api/weather:
 * get:
 * summary: Obtiene datos climáticos en tiempo real de una API externa.
 * tags: [External Weather Data]
 * parameters:
 * - in: query
 * name: source
 * schema:
 * type: string
 * enum: [openweathermap, weatherapi]
 * required: true
 * description: Fuente de la API (openweathermap o weatherapi).
 * - in: query
 * name: city
 * schema:
 * type: string
 * required: true
 * description: Nombre de la ciudad para la cual obtener el clima.
 * responses:
 * 200:
 * description: Datos climáticos obtenidos exitosamente.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * source: { type: string, example: "OpenWeatherMap" }
 * city: { type: string, example: "London" }
 * temperature: { type: number, format: float, example: 15.2 }
 * humidity: { type: number, example: 80 }
 * condition: { type: string, example: "Clouds" }
 * windSpeed: { type: number, format: float, example: 4.1 }
 * 400:
 * description: Parámetros inválidos o faltantes.
 * 404:
 * description: Ciudad no encontrada.
 * 500:
 * description: Error interno del servidor.
 * 502:
 * description: Error de la API externa (Bad Gateway).
 * 504:
 * description: Tiempo de espera excedido o sin respuesta de la API externa (Gateway Timeout).
 */
exports.getWeatherData = async (req, res) => {
    const { source, city } = req.query;

    if (!source || !city) {
        logger.warn('Missing source or city in weather data request', { query: req.query });
        return res.status(400).json({ message: 'Fuente y ciudad son parámetros requeridos.' });
    }

    try {
        let data;
        if (source === 'openweathermap') {
            data = await openWeatherMapService.getWeatherDataByCity(city);
        } else if (source === 'weatherapi') {
            data = await weatherApiService.getWeatherDataByCity(city);
        } else {
            logger.warn('Invalid weather API source provided', { source });
            return res.status(400).json({ message: 'Fuente climática inválida. Use "openweathermap" o "weatherapi".' });
        }

        if (data) {
            logger.info(`Weather data successfully fetched for ${source} and ${city}`);
        }

        res.status(200).json(data);

    } catch (error) {
        logger.error(`Error in weatherController for ${source} and ${city}:`, { error: error.message, query: req.query });
        if (error.message.includes('not found')) {
            res.status(404).json({ message: 'Ciudad no encontrada o error en la API externa.' });
        } else if (error.message.includes('API error')) {
            res.status(502).json({ message: `Error de la API externa (${source}): ${error.message}` });
        } else if (error.message.includes('No response')) {
            res.status(504).json({ message: `Tiempo de espera excedido o sin respuesta de la API externa (${source}).` });
        } else {
            res.status(500).json({ message: 'Error interno del servidor al obtener datos climáticos.' });
        }
    }
}; 