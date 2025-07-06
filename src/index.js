require('dotenv').config();
// console.log("aaaaa");
// console.log('TEST ENV:', process.env.WEATHERAPI_KEY);
const express = require('express');
const connectDB = require('./config/db'); // Asumiendo que guardaste el archivo de conexión ahí
const weatherRoutes = require('./routes/weatherRoutes');
const earthquakeRoutes = require('./routes/earthquakeRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const authRoutes = require('./routes/authRoutes');
const { protect } = require('./middleware/authMiddleware');
const logger = require('./config/logger'); // Importa el logger
const morgan = require('morgan'); // Para logs de solicitudes HTTP

const app = express();

// Conectar a la base de datos solo si no estamos en modo test
if (process.env.NODE_ENV !== 'test') {
    connectDB();
}

// Middleware para parsear JSON en las solicitudes
app.use(express.json());

// Middleware de logging con Morgan
// Usa 'combined' para formato detallado o 'dev' para desarrollo
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

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
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
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
                WeatherReportUpdate: {
                    type: 'object',
                    properties: {
                        city: { type: 'string', example: 'Caracas' },
                        temperature: { type: 'number', format: 'float', example: 25.5 },
                        humidity: { type: 'number', example: 70 },
                        condition: { type: 'string', enum: ['Soleado', 'Nublado', 'Lluvioso', 'Tormenta'], example: 'Soleado' },
                        date: { type: 'string', format: 'date-time', example: '2023-11-20T12:00:00Z' }
                    }
                },
                PaginatedWeatherResponse: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/WeatherReport' }
                        },
                        totalCount: { type: 'integer', example: 50 },
                        page: { type: 'integer', example: 1 },
                        limit: { type: 'integer', example: 10 },
                        totalPages: { type: 'integer', example: 5 }
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
                },
                EarthquakeReportUpdate: {
                    type: 'object',
                    properties: {
                        magnitude: { type: 'number', format: 'float', example: 5.8 },
                        depth: { type: 'number', format: 'float', example: 35.2 },
                        location: { type: 'string', example: 'Santiago, Chile' },
                        date: { type: 'string', format: 'date-time', example: '2023-11-19T08:30:00Z' }
                    }
                },
                PaginatedEarthquakeResponse: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/EarthquakeReport' }
                        },
                        totalCount: { type: 'integer', example: 50 },
                        page: { type: 'integer', example: 1 },
                        limit: { type: 'integer', example: 10 },
                        totalPages: { type: 'integer', example: 5 }
                    }
                },
                User: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '60d0fe4f5311236168a109cc' },
                        email: { type: 'string', format: 'email', example: 'usuario@ejemplo.com' },
                        createdAt: { type: 'string', format: 'date-time', example: '2023-11-20T12:00:00.000Z' },
                        updatedAt: { type: 'string', format: 'date-time', example: '2023-11-20T12:00:00.000Z' }
                    }
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '60d0fe4f5311236168a109cc' },
                        email: { type: 'string', format: 'email', example: 'usuario@ejemplo.com' },
                        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
                    }
                },
                ExternalWeatherData: {
                    type: 'object',
                    properties: {
                        source: { type: 'string', example: 'OpenWeatherMap' },
                        city: { type: 'string', example: 'London' },
                        country: { type: 'string', example: 'GB' },
                        temperature: { type: 'number', format: 'float', example: 15.2 },
                        feelsLike: { type: 'number', format: 'float', example: 14.0 },
                        minTemp: { type: 'number', format: 'float', example: 12.0 },
                        maxTemp: { type: 'number', format: 'float', example: 18.0 },
                        humidity: { type: 'number', example: 80 },
                        pressure: { type: 'number', example: 1012 },
                        windSpeed: { type: 'number', format: 'float', example: 4.1 },
                        condition: { type: 'string', example: 'Clouds' },
                        icon: { type: 'string', example: 'https://openweathermap.org/img/wn/02d.png' },
                        timestamp: { type: 'string', format: 'date-time', example: '2023-11-20T12:00:00Z' }
                    }
                },
                ExternalEarthquakeData: {
                    type: 'object',
                    properties: {
                        source: { type: 'string', example: 'USGS' },
                        id: { type: 'string', example: 'usgs-12345' },
                        magnitude: { type: 'number', format: 'float', example: 6.2 },
                        location: { type: 'string', example: '30km SW of Santiago, Chile' },
                        time: { type: 'string', format: 'date-time', example: '2023-11-20T10:00:00Z' },
                        tzOffset: { type: 'number', example: -240 },
                        url: { type: 'string', example: 'https://earthquake.usgs.gov/earthquakes/eventpage/usgs-12345' },
                        longitude: { type: 'number', example: -71.5 },
                        latitude: { type: 'number', example: -33.5 },
                        depth: { type: 'number', example: 50.0 }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'Error description' },
                        errors: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    field: { type: 'string', example: 'email' },
                                    message: { type: 'string', example: 'Invalid email format' }
                                }
                            }
                        }
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
app.use('/api/auth', authRoutes);

app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
    logger.error('Unhandled application error', {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        user: req.user ? req.user.email : 'N/A' // Si tienes el user en req
    });

    // ... (Tu lógica de respuesta de error existente)
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Algo salió mal en el servidor!', error: err.message });
});

// Solo iniciar el servidor si no estamos en modo test
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
}

module.exports = app;