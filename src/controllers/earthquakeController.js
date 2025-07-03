const usgsService = require('../services/usgsService');
// const emscService = require('../services/emscService'); // Mantén esto comentado si no lo vas a implementar
const logger = require('../config/logger'); // Importa el logger

/**
 * @swagger
 * tags:
 * name: External Earthquake Data
 * description: Endpoints para obtener datos sísmicos en tiempo real de APIs externas.
 */

/**
 * @swagger
 * /api/earthquakes:
 * get:
 * summary: Obtiene datos sísmicos en tiempo real de una API externa.
 * tags: [External Earthquake Data]
 * parameters:
 * - in: query
 * name: source
 * schema:
 * type: string
 * enum: [usgs, emsc]
 * required: true
 * description: Fuente de la API (usgs o emsc).
 * - in: query
 * name: country
 * schema:
 * type: string
 * required: false
 * description: Nombre del país para filtrar los sismos. (Nota: USGS no filtra directamente por país, se filtra post-request)
 * - in: query
 * name: minmagnitude
 * schema:
 * type: number
 * format: float
 * required: false
 * description: Magnitud mínima del sismo.
 * - in: query
 * name: limit
 * schema:
 * type: integer
 * required: false
 * description: Número máximo de resultados.
 * - in: query
 * name: starttime
 * schema:
 * type: string
 * format: date
 * required: false
 * description: Fecha de inicio para la búsqueda (YYYY-MM-DD).
 * - in: query
 * name: endtime
 * schema:
 * type: string
 * format: date
 * required: false
 * description: Fecha de fin para la búsqueda (YYYY-MM-DD).
 * responses:
 * 200:
 * description: Datos sísmicos obtenidos exitosamente.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * type: object
 * properties:
 * source: { type: string, example: "USGS" }
 * id: { type: string, example: "usgs-12345" }
 * magnitude: { type: number, format: float, example: 6.2 }
 * location: { type: string, example: "30km SW of Santiago, Chile" }
 * time: { type: string, format: "date-time", example: "2023-11-20T10:00:00Z" }
 * tzOffset: { type: number, example: -240 }
 * url: { type: string, example: "https://earthquake.usgs.gov/earthquakes/eventpage/usgs-12345" }
 * longitude: { type: number, example: -71.5 }
 * latitude: { type: number, example: -33.5 }
 * depth: { type: number, example: 50.0 }
 * 400:
 * description: Parámetros inválidos o faltantes.
 * 500:
 * description: Error interno del servidor.
 * 501:
 * description: La fuente de la API no está implementada.
 * 502:
 * description: Error de la API externa (Bad Gateway).
 * 504:
 * description: Tiempo de espera excedido o sin respuesta de la API externa (Gateway Timeout).
 */
exports.getEarthquakeData = async (req, res) => {
    // Ejemplo de parámetros de consulta:
    // /api/earthquakes?source=usgs&minmagnitude=5&limit=20&country=Chile&starttime=2024-01-01
    const { source, country, minmagnitude, limit, starttime, endtime } = req.query;

    if (!source) {
        logger.warn('Missing source in earthquake data request', { query: req.query });
        return res.status(400).json({ message: 'Fuente sísmica inválida o faltante. Use "usgs".' });
    }

    try {
        let data;
        const queryParams = {
            minmagnitude: minmagnitude ? parseFloat(minmagnitude) : undefined,
            limit: limit ? parseInt(limit) : undefined,
            starttime: starttime,
            endtime: endtime
        };

        if (source === 'usgs') {
            data = await usgsService.getEarthquakes(queryParams);
            // USGS no filtra directamente por "country" en la API (solo por coordenadas).
            // Así que, si se especificó un país, filtramos los resultados obtenidos post-request.
            if (country) {
                logger.info(`Filtering USGS data by country: ${country}`);
                data = data.filter(eq => eq.location && eq.location.toLowerCase().includes(country.toLowerCase()));
            }
        } else if (source === 'emsc') {
            // Si decides implementar EMSC en el futuro, el código iría aquí.
            // Por ahora, devolvemos un mensaje de no implementación.
            logger.warn('EMSC integration not fully implemented or requires specific parsing.', { source });
            return res.status(501).json({ message: 'La integración con EMSC no está completamente implementada o requiere un parseo específico. Por favor, use "usgs" por ahora.' });
        } else {
            logger.warn('Invalid earthquake API source provided', { source });
            return res.status(400).json({ message: 'Fuente sísmica inválida o faltante. Use "usgs".' });
        }

        // Si se obtienen datos, registrarlos
        if (data) {
            logger.info(`Earthquake data successfully fetched for ${source}`);
        }

        res.status(200).json(data);
    } catch (error) {
        logger.error(`Error in earthquakeController for ${source}:`, { error: error.message, query: req.query });
        if (error.message.includes('API error')) {
            res.status(502).json({ message: `Error de la API externa (${source}): ${error.message}` });
        } else if (error.message.includes('No response')) {
            res.status(504).json({ message: `Tiempo de espera excedido o sin respuesta de la API externa (${source}).` });
        } else {
            res.status(500).json({ message: 'Error interno del servidor al obtener datos sísmicos.' });
        }
    }
}; 