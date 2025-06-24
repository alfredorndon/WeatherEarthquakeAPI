# WeatherEarthquakeAPI

## Descripción General del Proyecto

Este proyecto consiste en el desarrollo de una API REST robusta utilizando Node.js y Express.js, con MongoDB como base de datos. El objetivo principal de esta API es centralizar y gestionar datos meteorológicos y sismológicos, integrándose con diversas fuentes externas y permitiendo la gestión de reportes personalizados.

La API está diseñada para ser escalable, eficiente y fácil de usar, proporcionando endpoints para consultar información climática y sísmica, así como para que los usuarios puedan crear y gestionar sus propios reportes personalizados. Se ha puesto un énfasis particular en la calidad del código, la mantenibilidad y una documentación exhaustiva.

## Características Principales

* **API RESTful** construida con Node.js y Express.js.
* **Base de Datos NoSQL** MongoDB, con Mongoose como ODM, para la gestión de datos.
* **Integración con APIs Externas:**
    * **Meteorología:** OpenWeatherMap, WeatherAPI.
    * **Sismología:** USGS Earthquake API, EMSC.
* **Gestión de Reportes Personalizados:** Funcionalidad CRUD (Crear, Leer, Actualizar, Eliminar) para reportes de clima y sismos.
* **Autenticación y Autorización** de usuarios mediante JWT y `bcrypt` para contraseñas seguras.
* **Optimización del Rendimiento:**
    * Caché con Redis para reducir la carga en APIs externas.
    * Compresión de respuestas con Gzip.
    * Paginación y filtrado para la gestión de datos.
* **Seguridad:** Limitación de solicitudes (Rate Limiting) para prevenir abusos.
* **Logging** para monitoreo y depuración.
* **Desarrollo Guiado por Pruebas (TDD):** Se escribirán pruebas unitarias antes de implementar el código, asegurando la cobertura y el correcto funcionamiento. Las pruebas se realizarán con Jest y Supertest.
* **Documentación Interactiva** de la API generada con Swagger (OpenAPI).
* **Control de Versiones Profesional** utilizando Git y GitHub con una estrategia GitFlow estricta.

## Tecnologías Utilizadas

* **Backend:** Node.js (versión LTS)
* **Framework:** Express.js
* **Base de Datos:** MongoDB
* **ODM:** Mongoose
* **Pruebas:** Jest, Supertest
* **Documentación API:** Swagger (OpenAPI)
* **Caché:** Redis
* **Autenticación:** JSON Web Tokens (JWT), bcrypt
* **Manejo de Variables de Entorno:** dotenv
* **Compresión:** Gzip (usando `compression` middleware)
* **Logging:** Winston (o similar)
* **Limitación de Solicitudes:** express-rate-limit
* **Control de Versiones:** Git, GitHub

## Requisitos del Sistema

Antes de clonar y ejecutar este proyecto, asegúrate de tener instalados los siguientes programas:

* **Node.js** (versión LTS recomendada)
* **npm** (viene con Node.js) o **Yarn**
* **MongoDB** (servidor local o acceso a MongoDB Atlas)
* **Redis** (servidor local o acceso a una instancia en la nube)
* **Git**

## Configuración del Entorno (.env)

Crea un archivo `.env` en la raíz del proyecto y configura las siguientes variables de entorno. Estas son cruciales para la conexión a la base de datos y el acceso a las APIs externas.

```dotenv
PORT=5000
MONGO_URI=mongodb://localhost:27017/your_database_name

# Claves de API para servicios externos
OPENWEATHER_API_KEY=your_openweather_api_key
WEATHERAPI_API_KEY=your_weatherapi_api_key
# USGS y EMSC no suelen requerir API keys directamente, pero si lo hacen, agrégalas aquí.

# Secretos para JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1h
```

# Estructura de Carpetas

```
WeatherEarthquakeAPI/
  ├── src/
  │   ├── config/         # Configuración de la base de datos y variables de entorno
  │   ├── models/         # Modelos de Mongoose
  │   ├── routes/         # Rutas de la API
  │   ├── controllers/    # Lógica de manejo de solicitudes HTTP
  │   ├── services/       # Lógica de negocio (APIs externas, DB)
  │   ├── middleware/     # Middlewares de autenticación, validación, etc.
  │   ├── utils/          # Funciones de utilidad
  │   └── index.js        # Archivo principal de Express
  ├── tests/
  │   ├── unit/           # Pruebas unitarias
  │   └── integration/    # Pruebas de integración
  ├── package.json
  ├── package-lock.json
  └── README.md
```

Cada carpeta tiene un propósito específico para mantener el proyecto modular y mantenible.
