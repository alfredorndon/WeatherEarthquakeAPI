# WeatherEarthquakeAPI

## Descripción
API RESTful para centralizar datos meteorológicos y sismológicos, permitiendo la gestión de reportes personalizados y la consulta de datos en tiempo real desde APIs externas (OpenWeatherMap, WeatherAPI, USGS). Incluye documentación interactiva con Swagger.

## Estructura de Carpetas
```
WeatherEarthquakeAPI/
  ├── src/
  │   ├── config/         # Configuración de la base de datos y variables de entorno
  │   ├── models/         # Modelos de Mongoose
  │   ├── routes/         # Rutas de la API (incluye endpoints CRUD y externos)
  │   ├── controllers/    # Lógica de manejo de solicitudes HTTP
  │   ├── services/       # Lógica de negocio y consumo de APIs externas
  │   ├── middleware/     # Middlewares de validación, etc.
  │   ├── utils/          # Funciones de utilidad
  │   └── index.js        # Archivo principal de Express
  ├── tests/
  │   ├── unit/           # Pruebas unitarias
  │   └── integration/    # Pruebas de integración
  ├── package.json
  ├── package-lock.json
  └── README.md
```

## Endpoints Principales
- `/api/weather/reports` (CRUD de reportes personalizados de clima)
- `/api/weather` (Consulta de datos climáticos en tiempo real de OpenWeatherMap y WeatherAPI)
- `/api/earthquakes/reports` (CRUD de reportes personalizados de sismos)
- `/api/earthquakes` (Consulta de datos sísmicos en tiempo real de USGS)

## Documentación Swagger
La documentación interactiva está disponible en: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

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