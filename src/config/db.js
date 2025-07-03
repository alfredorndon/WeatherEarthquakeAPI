require('dotenv').config(); // Asegúrate de que esto esté al principio si es un archivo separado
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/weather_earthquake_api';
    await mongoose.connect(mongoUri); // Mongoose 6+ ya no necesita opciones adicionales por defecto
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // Sale del proceso con error
  }
};

module.exports = connectDB;