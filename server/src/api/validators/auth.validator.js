import { z } from 'zod';
import logger from '../../utils/logger.js';

// Schéma de validation pour l'inscription
const registerSchema = z.object({
  username: z.string()
    .min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères.')
    .max(20, 'Le nom d\'utilisateur ne peut pas dépasser 20 caractères.')
    .regex(/^[a-zA-Z0-9_]+$/, 'Le nom d\'utilisateur ne peut contenir que des lettres, des chiffres et des underscores.'),
  email: z.string()
    .email('Adresse email invalide.'),
  password: z.string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères.')
    .max(50, 'Le mot de passe ne peut pas dépasser 50 caractères.')
});

// Schéma de validation pour la connexion
const loginSchema = z.object({
  email: z.string()
    .email('Adresse email invalide.'),
  password: z.string()
    .min(1, 'Le mot de passe est requis.')
});

/**
 * Middleware de validation pour l'inscription
 */
export const validateRegister = (req, res, next) => {
  try {
    registerSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      
      logger.warn('Validation d\'inscription échouée:', errors);
      return res.status(400).json({ errors });
    }
    
    logger.error('Erreur de validation d\'inscription:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la validation.' });
  }
};

/**
 * Middleware de validation pour la connexion
 */
export const validateLogin = (req, res, next) => {
  try {
    loginSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      
      logger.warn('Validation de connexion échouée:', errors);
      return res.status(400).json({ errors });
    }
    
    logger.error('Erreur de validation de connexion:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la validation.' });
  }
};

