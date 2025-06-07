import express from 'express';
import { 
  getCurrentUser, 
  updateUser, 
  deleteUser, 
  getUserProfile 
} from '../controllers/user.controller.js';
import { validateUpdateUser } from '../validators/user.validator.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @route GET /api/users/me
 * @desc Récupérer les informations de l'utilisateur connecté
 * @access Private
 */
router.get('/me', authenticate, getCurrentUser);

/**
 * @route GET /api/users/:username
 * @desc Récupérer le profil public d'un utilisateur
 * @access Public
 */
router.get('/:username', getUserProfile);

/**
 * @route PUT /api/users/me
 * @desc Mettre à jour les informations de l'utilisateur connecté
 * @access Private
 */
router.put('/me', authenticate, validateUpdateUser, updateUser);

/**
 * @route DELETE /api/users/me
 * @desc Supprimer le compte de l'utilisateur connecté
 * @access Private
 */
router.delete('/me', authenticate, deleteUser);

export default router;

