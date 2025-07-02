require('dotenv').config();
process.env.NODE_ENV = 'test';
if (!process.env.MONGO_URI_TEST) {
  process.env.MONGO_URI_TEST = process.env.MONGO_URI;
}
process.env.MONGO_URI = 'mongodb://localhost:27017/weather_earthquake_test';
process.env.OPENWEATHER_API_KEY = 'test_key';
process.env.WEATHERAPI_API_KEY = 'test_key';
process.env.JWT_SECRET = 'test_jwt_secret';
process.env.JWT_EXPIRES_IN = '5m'; 