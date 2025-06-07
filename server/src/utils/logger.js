import winston from 'winston';

// Configuration des formats
const { combine, timestamp, printf, colorize } = winston.format;

// Format personnalisé pour les logs
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Création du logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    // Logs de console
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
      )
    }),
    // Logs d'erreur dans un fichier
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    // Tous les logs dans un fichier
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    })
  ]
});

// Si nous ne sommes pas en production, afficher les logs dans la console
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default logger;

