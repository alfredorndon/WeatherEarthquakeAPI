const axios = require('axios');
const handleAxiosError = require('./axiosErrorHandler');

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

exports.getWeatherDataByCity = async (city) => {
    try {
        const response = await axios.get(`${BASE_URL}/weather`, {
            params: {
                q: city,
                appid: API_KEY,
                units: 'metric',
                lang: 'es'
            }
        });
        const data = response.data;
        return {
            source: 'OpenWeatherMap',
            city: data.name,
            country: data.sys.country,
            temperature: data.main.temp,
            feelsLike: data.main.feels_like,
            minTemp: data.main.temp_min,
            maxTemp: data.main.temp_max,
            humidity: data.main.humidity,
            pressure: data.main.pressure,
            windSpeed: data.wind.speed,
            condition: data.weather[0].description,
            icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
            timestamp: new Date(data.dt * 1000)
        };
    } catch (error) {
        console.error('Error fetching data from OpenWeatherMap:', error.message);
        throw handleAxiosError(error, 'OpenWeatherMap');
    }
}; 