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
```

## Instalación de Dependencias
```
npm install
```

## Ejecución
```
npm start
```

## Pruebas
- Ejecuta todas las pruebas con:
```
npm test
```
- Las pruebas de integración para APIs externas usan mocks y no consumen tus créditos de API.

## Resumen de Cambios Recientes
- Integración de servicios y controladores para OpenWeatherMap, WeatherAPI y USGS.
- Nuevos endpoints RESTful para datos externos y CRUD.
- Documentación Swagger interactiva.
- Pruebas de integración y unitarias para servicios y endpoints principales.
- Uso de variables de entorno para las API keys.
