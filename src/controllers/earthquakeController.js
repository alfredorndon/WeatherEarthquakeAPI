const usgsService = require('../services/usgsService');

exports.getEarthquakeData = async (req, res) => {
    const { source, country, minmagnitude, limit, starttime, endtime } = req.query;
    if (minmagnitude !== undefined && minmagnitude !== '' && isNaN(Number(minmagnitude))) {
        return res.status(400).json({ message: 'El parámetro "minmagnitude" debe ser numérico.' });
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
            if (country) {
                data = data.filter(eq => eq.location && eq.location.toLowerCase().includes(country.toLowerCase()));
            }
        } else {
            return res.status(400).json({ message: 'Fuente sísmica inválida o faltante. Use "usgs".' });
        }
        res.status(200).json(data);
    } catch (error) {
        console.error(`Error en earthquakeController para ${source}:`, error.message);
        if (error.message.includes('API error')) {
            res.status(502).json({ message: `Error de la API externa (${source}): ${error.message}` });
        } else if (error.message.includes('No response')) {
            res.status(504).json({ message: `Tiempo de espera excedido o sin respuesta de la API externa (${source}).` });
        } else {
            res.status(500).json({ message: 'Error interno del servidor al obtener datos sísmicos.' });
        }
    }
}; 