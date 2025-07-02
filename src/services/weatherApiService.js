const axios = require('axios');
const handleAxiosError = require('./axiosErrorHandler');

const API_KEY = process.env.WEATHERAPI_API_KEY;
const BASE_URL = 'http://api.weatherapi.com/v1';

exports.getWeatherDataByCity = async (city) => {
    try {
        const response = await axios.get(`${BASE_URL}/current.json`, {
            params: {
                key: API_KEY,
                q: city,
                aqi: 'no',
                lang: 'es'
            }
        });
        const data = response.data;
        return {
            source: 'WeatherAPI',
            city: data.location.name,
            country: data.location.country,
            temperature: data.current.temp_c,
            feelsLike: data.current.feelslike_c,
            humidity: data.current.humidity,
            pressure: data.current.pressure_mb,
            windSpeed: data.current.wind_kph,
            condition: data.current.condition.text,
            icon: data.current.condition.icon,
            timestamp: new Date(data.current.last_updated_epoch * 1000)
        };
    } catch (error) {
        console.error('Error fetching data from WeatherAPI:', error.message);
        throw handleAxiosError(error, 'WeatherAPI');
    }
}; 