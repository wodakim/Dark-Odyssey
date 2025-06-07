import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import logger from '../../utils/logger.js';

/**
 * Middleware d'authentification
 * Vérifie si l'utilisateur est authentifié via un token JWT
 */
export const authenticate = async (req, res, next) => {
  try {
    // Récupérer le token d'authentification
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Accès non autorisé. Token manquant.' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Récupérer l'utilisateur
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Accès non autorisé. Utilisateur non trouvé.' });
    }
    
    // Ajouter l'utilisateur à la requête
    req.user = user;
    next();
  } catch (error) {
    logger.error('Erreur d\'authentification:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token invalide.' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expiré.' });
    }
    
    res.status(500).json({ message: 'Erreur serveur lors de l\'authentification.' });
  }
};

/**
 * Middleware pour vérifier si l'utilisateur est administrateur
 */
export const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Accès refusé. Droits d\'administrateur requis.' });
  }
  
  next();
};

