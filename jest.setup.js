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

// Mock console.error to suppress expected error messages during tests
const originalConsoleError = console.error;
let mockedConsoleError;

beforeAll(() => {
  mockedConsoleError = jest.spyOn(console, 'error').mockImplementation((...args) => {
    const errorMsg = typeof args[0] === 'string' ? args[0] : '';
    if (
      errorMsg.includes('Error fetching data from OpenWeatherMap') ||
      errorMsg.includes('Error fetching data from USGS')
    ) {
      return;
    }
    originalConsoleError(...args);
  });
});

afterAll(() => {
  mockedConsoleError.mockRestore();
}); 