require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI_TEST || process.env.MONGO_URI)
  .then(() => {
    console.log('Conexión exitosa a MongoDB Atlas');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error de conexión:', err.message);
    process.exit(1);
  }); 