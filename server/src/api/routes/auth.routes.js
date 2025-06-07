import express from 'express';
import { register, login, refreshToken, logout } from '../controllers/auth.controller.js';
import { validateRegister, validateLogin } from '../validators/auth.validator.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Inscription d'un nouvel utilisateur
 * @access Public
 */
router.post('/register', validateRegister, register);

/**
 * @route POST /api/auth/login
 * @desc Connexion d'un utilisateur
 * @access Public
 */
router.post('/login', validateLogin, login);

/**
 * @route POST /api/auth/refresh
 * @desc Rafraîchissement du token d'authentification
 * @access Public (avec refresh token)
 */
router.post('/refresh', refreshToken);

/**
 * @route POST /api/auth/logout
 * @desc Déconnexion d'un utilisateur
 * @access Private
 */
router.post('/logout', authenticate, logout);

export default router;

