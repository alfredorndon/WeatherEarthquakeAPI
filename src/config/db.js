
require('dotenv').config(); // Asegúrate de que esto esté al principio si es un archivo separado
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // Mongoose 6+ ya no necesita opciones adicionales por defecto
    console.log('MongoDB Atlas Connected...');
  } catch (err) {
    console.error('Error connecting to MongoDB Atlas:', err.message);
    process.exit(1); // Sale del proceso con error
  }
};

module.exports = connectDB;