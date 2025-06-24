const openWeatherMapService = require('../services/openWeatherMapService');
const weatherApiService = require('../services/weatherApiService');

exports.getWeatherData = async (req, res) => {
    const { source, city } = req.query;
    if (!city) {
        return res.status(400).json({ message: 'El parámetro "city" es requerido.' });
    }
    try {
        let data;
        if (source === 'openweathermap') {
            data = await openWeatherMapService.getWeatherDataByCity(city);
        } else if (source === 'weatherapi') {
            data = await weatherApiService.getWeatherDataByCity(city);
        } else {
            return res.status(400).json({ message: 'Fuente climática inválida o faltante. Use "openweathermap" o "weatherapi".' });
        }
        res.status(200).json(data);
    } catch (error) {
        console.error(`Error en weatherController para ${source}:`, error.message);
        if (error.message.includes('404') || error.message.includes('not found') || error.message.includes('No matching location')) {
            res.status(404).json({ message: `Ciudad no encontrada en la fuente "${source}".` });
        } else if (error.message.includes('API error')) {
            res.status(502).json({ message: `Error de la API externa (${source}): ${error.message}` });
        } else if (error.message.includes('No response')) {
            res.status(504).json({ message: `Tiempo de espera excedido o sin respuesta de la API externa (${source}).` });
        } else {
            res.status(500).json({ message: 'Error interno del servidor al obtener datos climáticos.' });
        }
    }
}; 