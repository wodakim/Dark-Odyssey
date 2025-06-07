import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import logger from '../../utils/logger.js';

// Générer un token JWT
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// Générer un refresh token
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

/**
 * @desc    Inscription d'un nouvel utilisateur
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    
    if (userExists) {
      if (userExists.email === email) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
      }
      return res.status(400).json({ message: 'Ce nom d\'utilisateur est déjà utilisé.' });
    }
    
    // Créer un nouvel utilisateur
    const user = await User.create({
      username,
      email,
      password
    });
    
    if (user) {
      // Générer les tokens
      const token = generateToken(user._id);
      const refreshToken = generateRefreshToken(user._id);
      
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        premium: user.premium,
        token,
        refreshToken
      });
    } else {
      res.status(400).json({ message: 'Données utilisateur invalides.' });
    }
  } catch (error) {
    logger.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'inscription.' });
  }
};

/**
 * @desc    Connexion d'un utilisateur
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Trouver l'utilisateur par email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }
    
    // Vérifier le mot de passe
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }
    
    // Mettre à jour la date de dernière connexion
    user.lastLogin = Date.now();
    await user.save();
    
    // Générer les tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      premium: user.premium,
      token,
      refreshToken
    });
  } catch (error) {
    logger.error('Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion.' });
  }
};

/**
 * @desc    Rafraîchissement du token
 * @route   POST /api/auth/refresh
 * @access  Public (avec refresh token)
 */
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token manquant.' });
    }
    
    // Vérifier le refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    
    // Trouver l'utilisateur
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé.' });
    }
    
    // Générer un nouveau token
    const newToken = generateToken(user._id);
    
    res.json({
      token: newToken
    });
  } catch (error) {
    logger.error('Erreur lors du rafraîchissement du token:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Refresh token invalide.' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Refresh token expiré.' });
    }
    
    res.status(500).json({ message: 'Erreur serveur lors du rafraîchissement du token.' });
  }
};

/**
 * @desc    Déconnexion d'un utilisateur
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = async (req, res) => {
  try {
    // Dans une implémentation réelle, on pourrait ajouter le token à une liste noire
    // ou invalider le refresh token en base de données
    
    res.json({ message: 'Déconnexion réussie.' });
  } catch (error) {
    logger.error('Erreur lors de la déconnexion:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la déconnexion.' });
  }
};

