const axios = require('axios');
const handleAxiosError = require('./axiosErrorHandler');

const BASE_URL = 'https://earthquake.usgs.gov/fdsnws/event/1/query';

exports.getEarthquakes = async (params = {}) => {
    try {
        const defaultParams = {
            format: 'geojson',
            minmagnitude: 4,
            limit: 10,
            orderby: 'time'
        };
        const response = await axios.get(BASE_URL, {
            params: { ...defaultParams, ...params }
        });
        return response.data.features.map(feature => ({
            source: 'USGS',
            id: feature.id,
            magnitude: feature.properties.mag,
            location: feature.properties.place,
            time: new Date(feature.properties.time),
            tzOffset: feature.properties.tz,
            url: feature.properties.url,
            longitude: feature.geometry.coordinates[0],
            latitude: feature.geometry.coordinates[1],
            depth: feature.geometry.coordinates[2]
        }));
    } catch (error) {
        console.error('Error fetching data from USGS:', error.message);
        throw handleAxiosError(error, 'USGS');
    }
}; 