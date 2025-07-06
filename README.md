# WeatherEarthquakeAPI

## Descripción
API RESTful para centralizar datos meteorológicos y sismológicos, permitiendo la gestión de reportes personalizados y la consulta de datos en tiempo real desde APIs externas (OpenWeatherMap, WeatherAPI, USGS). Incluye documentación interactiva con Swagger.

## Estructura de Carpetas
```
WeatherEarthquakeAPI1/
  ├── src/
  │   ├── config/           # Configuración de la base de datos y logger
  │   │   ├── db.js
  │   │   └── logger.js
  │   ├── controllers/      # Lógica de manejo de solicitudes HTTP
  │   │   ├── authController.js
  │   │   ├── earthquakeController.js
  │   │   ├── earthquakeReportController.js
  │   │   ├── weatherController.js
  │   │   └── weatherReportController.js
  │   ├── middleware/       # Middlewares de autenticación y validación
  │   │   ├── authMiddleware.js
  │   │   ├── earthquakeValidation.js
  │   │   └── weatherValidation.js
  │   ├── models/           # Modelos de Mongoose
  │   │   ├── EarthquakeReport.js
  │   │   ├── User.js
  │   │   └── WeatherReport.js
  │   ├── routes/           # Rutas de la API (endpoints CRUD y externos)
  │   │   ├── authRoutes.js
  │   │   ├── earthquakeRoutes.js
  │   │   └── weatherRoutes.js
  │   ├── services/         # Lógica de negocio y consumo de APIs externas
  │   │   ├── axiosErrorHandler.js
  │   │   ├── earthquakeReportService.js
  │   │   ├── openWeatherMapService.js
  │   │   ├── usgsService.js
  │   │   ├── weatherApiService.js
  │   │   └── weatherReportService.js
  │   ├── utils/            # Funciones de utilidad (vacío actualmente)
  │   └── index.js          # Archivo principal de Express
  ├── tests/
  │   ├── auth.test.js      # Prueba de autenticación
  │   ├── unit/             # Pruebas unitarias de servicios
  │   │   ├── earthquakeReportService.test.js
  │   │   └── weatherReportService.test.js
  │   └── integration/      # Pruebas de integración de endpoints
  │       ├── earthquakeReports.test.js
  │       ├── externalEarthquake.test.js
  │       ├── externalWeather.test.js
  │       └── weatherReports.test.js
  ├── logs/                 # Archivos de logs generados por Winston
  │   ├── combined.log
  │   ├── error.log
  │   ├── exceptions.log
  │   └── rejections.log
  ├── package.json
  ├── package-lock.json
  ├── README.md
  └── test-mongo.js         # Script de prueba de conexión a MongoDB
```

## Endpoints Principales
- `/api/weather/reports` (CRUD de reportes personalizados de clima)
- `/api/weather` (Consulta de datos climáticos en tiempo real de OpenWeatherMap y WeatherAPI)
- `/api/earthquakes/reports` (CRUD de reportes personalizados de sismos)
- `/api/earthquakes` (Consulta de datos sísmicos en tiempo real de USGS)

## Documentación Swagger
La documentación interactiva está disponible en: [https://localhost:5000/api-docs](https://localhost:5000/api-docs)

## Variables de Entorno
Crea un archivo `.env` con las siguientes variables:
```
OPENWEATHER_API_KEY=f1b1b57805fcedf5f43375aeb152d669
WEATHERAPI_API_KEY=91ae9ee117764a9bba0192139252406
MONGO_URI=tu_uri_de_mongodb
JWT_SECRET=tu_clave_secreta_generada_aqui_una_cadena_larga_y_aleatoria_no_la_pierdas_y_no_la_subas_a_github
JWT_EXPIRES_IN=1h # Puedes ajustar esto, ej. 8h, 1d
```

## Instalación de Dependencias
```