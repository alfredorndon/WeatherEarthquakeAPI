const express = require('express');
const connectDB = require('./config/db'); // Asumiendo que guardaste el archivo de conexión ahí
const app = express();
const weatherRoutes = require('./routes/weatherRoutes');
const earthquakeRoutes = require('./routes/earthquakeRoutes');

// Conectar a la base de datos
connectDB();

// Middleware para parsear JSON en las solicitudes
app.use(express.json());

// Usar las rutas de reportes personalizados
app.use('/api/weather/reports', weatherRoutes);
app.use('/api/earthquakes/reports', earthquakeRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000; // Usa el puerto del .env o 5000 por defecto

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));