import jwt from 'jsonwebtoken';
import User from '../api/models/user.model.js';
import logger from '../utils/logger.js';

/**
 * Configuration du serveur Socket.io
 * @param {Object} io - Instance de Socket.io
 */
export const setupSocketServer = (io) => {
  // Middleware d'authentification pour Socket.io
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentification requise'));
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return next(new Error('Utilisateur non trouvé'));
      }
      
      // Stocker l'utilisateur dans l'objet socket
      socket.user = user;
      next();
    } catch (error) {
      logger.error('Erreur d\'authentification Socket.io:', error);
      next(new Error('Erreur d\'authentification'));
    }
  });
  
  // Connexion d'un client
  io.on('connection', (socket) => {
    logger.info(`Utilisateur connecté: ${socket.user.username} (${socket.id})`);
    
    // Rejoindre les salons appropriés
    socket.join('global'); // Salon global
    
    if (socket.user.character && socket.user.character.guildId) {
      socket.join(`guild:${socket.user.character.guildId}`); // Salon de guilde
    }
    
    if (socket.user.character && socket.user.character.zoneId) {
      socket.join(`zone:${socket.user.character.zoneId}`); // Salon de zone
    }
    
    // Événement de chat
    socket.on('chat:message', (data) => {
      const { channel, content } = data;
      
      if (!content || content.trim() === '') {
        return;
      }
      
      const message = {
        sender: socket.user.username,
        content: content.trim(),
        channel,
        timestamp: Date.now()
      };
      
      // Diffuser le message au canal approprié
      switch (channel) {
        case 'global':
          io.to('global').emit('chat:message', message);
          break;
        case 'guild':
          if (socket.user.character && socket.user.character.guildId) {
            io.to(`guild:${socket.user.character.guildId}`).emit('chat:message', message);
          }
          break;
        case 'local':
          if (socket.user.character && socket.user.character.zoneId) {
            io.to(`zone:${socket.user.character.zoneId}`).emit('chat:message', message);
          }
          break;
        case 'trade':
          io.to('global').emit('chat:message', message);
          break;
        case 'whisper':
          if (data.recipient) {
            // Trouver le socket du destinataire
            const recipientSocket = findSocketByUsername(data.recipient);
            if (recipientSocket) {
              recipientSocket.emit('chat:message', message);
              socket.emit('chat:message', message); // Envoyer également au sender
            } else {
              socket.emit('chat:system', { message: `Utilisateur ${data.recipient} non trouvé ou hors ligne.` });
            }
          }
          break;
        default:
          socket.emit('chat:system', { message: 'Canal non reconnu.' });
      }
    });
    
    // Événement de changement de zone
    socket.on('zone:change', (data) => {
      const { oldZoneId, newZoneId } = data;
      
      if (oldZoneId) {
        socket.leave(`zone:${oldZoneId}`);
      }
      
      if (newZoneId) {
        socket.join(`zone:${newZoneId}`);
      }
    });
    
    // Événement de combat
    socket.on('combat:update', (data) => {
      // Émettre les mises à jour de combat uniquement au joueur concerné
      socket.emit('combat:update', data);
    });
    
    // Déconnexion
    socket.on('disconnect', () => {
      logger.info(`Utilisateur déconnecté: ${socket.user.username} (${socket.id})`);
    });
  });
  
  // Fonction utilitaire pour trouver un socket par nom d'utilisateur
  const findSocketByUsername = (username) => {
    let targetSocket = null;
    
    io.sockets.sockets.forEach((socket) => {
      if (socket.user && socket.user.username === username) {
        targetSocket = socket;
      }
    });
    
    return targetSocket;
  };
};

