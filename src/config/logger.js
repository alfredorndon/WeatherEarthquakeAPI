const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize, align } = format;

// Formato de log personalizado
const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
    let msg = `${timestamp} ${level}: ${message}`;
    if (Object.keys(metadata).length > 0) {
        // Añade metadatos si existen, conviértelos a JSON
        msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
});

const logger = createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug', // Nivel de log para producción/desarrollo
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [
        // Consola para desarrollo
        new transports.Console({
            format: combine(
                colorize(), // Colorea la salida de la consola
                align(),    // Alinea el nivel del log
                logFormat
            )
        }),
        // Archivo para logs de errores
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        // Archivo para todos los logs (informativos y superiores)
        new transports.File({ filename: 'logs/combined.log' })
    ],
    // Manejo de excepciones no capturadas
    exceptionHandlers: [
        new transports.File({ filename: 'logs/exceptions.log' })
    ],
    // Manejo de promesas rechazadas no capturadas (Node.js 10+)
    rejectionHandlers: [
        new transports.File({ filename: 'logs/rejections.log' })
    ]
});

// En entorno de desarrollo, también se imprimen logs de depuración
if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: combine(
            colorize(),
            align(),
            logFormat
        )
    }));
}

module.exports = logger; 