require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db'); // Asumiendo que guardaste el archivo de conexión ahí
const weatherRoutes = require('./routes/weatherRoutes');
const earthquakeRoutes = require('./routes/earthquakeRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

// Conectar a la base de datos
connectDB();

// Middleware para parsear JSON en las solicitudes
app.use(express.json());

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Weather Earthquake API',
            version: '1.0.0',
            description: 'API RESTful para centralizar datos meteorológicos y sismológicos, con gestión de reportes personalizados y datos en tiempo real de APIs externas.',
            contact: {
                name: 'Tu Equipo',
                url: 'https://github.com/tu_usuario/WeatherEarthquakeAPI'
            }
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 5000}/api`,
                description: 'Servidor de Desarrollo Local'
            }
        ],
        components: {
            schemas: {
                WeatherReport: {
                    type: 'object',
                    required: ['city', 'temperature', 'humidity', 'condition'],
                    properties: {
                        _id: { type: 'string', example: '60d0fe4f5311236168a109ca' },
                        city: { type: 'string', example: 'Caracas' },
                        temperature: { type: 'number', format: 'float', example: 25.5 },
                        humidity: { type: 'number', example: 70 },
                        condition: { type: 'string', enum: ['Soleado', 'Nublado', 'Lluvioso', 'Tormenta'], example: 'Soleado' },
                        date: { type: 'string', format: 'date-time', example: '2023-11-20T12:00:00Z' },
                        createdAt: { type: 'string', format: 'date-time', example: '2023-11-20T12:00:00.000Z' },
                        updatedAt: { type: 'string', format: 'date-time', example: '2023-11-20T12:00:00.000Z' }
                    }
                },
                EarthquakeReport: {
                    type: 'object',
                    required: ['magnitude', 'depth', 'location', 'date'],
                    properties: {
                        _id: { type: 'string', example: '60d0fe4f5311236168a109cb' },
                        magnitude: { type: 'number', format: 'float', example: 5.8 },
                        depth: { type: 'number', format: 'float', example: 35.2 },
                        location: { type: 'string', example: 'Santiago, Chile' },
                        date: { type: 'string', format: 'date-time', example: '2023-11-19T08:30:00Z' },
                        createdAt: { type: 'string', format: 'date-time', example: '2023-11-19T08:30:00.000Z' },
                        updatedAt: { type: 'string', format: 'date-time', example: '2023-11-19T08:30:00.000Z' }
                    }
                }
            }
        }
    },
    apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/', (req, res) => {
    res.send('WeatherEarthquakeAPI is running...');
});

app.use('/api/weather', weatherRoutes);
app.use('/api/earthquakes', earthquakeRoutes);

app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Algo salió mal en el servidor!', error: err.message });
});

const PORT = process.env.PORT || 5000; // Usa el puerto del .env o 5000 por defecto

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));