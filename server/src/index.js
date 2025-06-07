import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Importation des routes (à créer plus tard)
import apiRoutes from './api/routes/index.js';

// Importation des services (à créer plus tard)
import { setupSocketServer } from './socket/index.js';
import logger from './utils/logger.js';

// Chargement des variables d'environnement
dotenv.config();

// Création de l'application Express
const app = express();
const server = http.createServer(app);

// Configuration de Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.SOCKET_CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging des requêtes
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api', apiRoutes);

// Route de base
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API de Dark Odyssey!' });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Erreur serveur',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Connexion à la base de données MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    logger.info('Connexion à MongoDB établie');
    
    // Démarrage du serveur
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, '0.0.0.0', () => {
      logger.info(`Serveur en cours d'exécution sur le port ${PORT}`);
    });
    
    // Configuration de Socket.io
    setupSocketServer(io);
  })
  .catch((error) => {
    logger.error('Erreur de connexion à MongoDB:', error);
    process.exit(1);
  });

// Gestion des signaux d'arrêt
process.on('SIGINT', () => {
  logger.info('Arrêt du serveur...');
  mongoose.connection.close(() => {
    logger.info('Connexion MongoDB fermée');
    process.exit(0);
  });
});

