require('dotenv').config();
process.env.NODE_ENV = 'test';

// Configurar variables de entorno para pruebas
process.env.MONGO_URI = 'mongodb://localhost:27017/weather_earthquake_test';
process.env.MONGO_URI_TEST = 'mongodb://localhost:27017/weather_earthquake_test';
process.env.OPENWEATHER_API_KEY = 'test_key';
process.env.WEATHERAPI_API_KEY = 'test_key';
process.env.JWT_SECRET = 'test_jwt_secret';
process.env.JWT_EXPIRES_IN = '5m';

// Configurar timeouts más largos para las pruebas
jest.setTimeout(30000);

// Silenciar logs de Winston durante las pruebas
const logger = require('./src/config/logger');
logger.silent = true; 