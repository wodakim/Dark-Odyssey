import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';

/**
 * Récupère tous les utilisateurs
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    return res.status(200).json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la récupération des utilisateurs' });
  }
};

/**
 * Récupère un utilisateur par son ID
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, { password: 0 });
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    return res.status(200).json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la récupération de l\'utilisateur' });
  }
};

/**
 * Récupère le profil de l'utilisateur connecté
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId, { password: 0 });
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    return res.status(200).json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la récupération du profil' });
  }
};

/**
 * Alias pour getProfile - Récupère l'utilisateur connecté
 */
export const getCurrentUser = getProfile;

/**
 * Met à jour le profil de l'utilisateur connecté
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const updateProfile = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const updateData = {};
    
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updateData },
      { new: true, select: '-password' }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    return res.status(200).json(user);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du profil' });
  }
};

/**
 * Alias pour updateProfile - Met à jour l'utilisateur connecté
 */
export const updateUser = updateProfile;

/**
 * Supprime l'utilisateur connecté
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const deleteProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    return res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du profil:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la suppression du profil' });
  }
};

/**
 * Alias pour deleteProfile - Supprime l'utilisateur connecté
 */
export const deleteUser = deleteProfile;

/**
 * Récupère le profil public d'un utilisateur par son nom d'utilisateur
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    
    const user = await User.findOne({ username }, { 
      password: 0,
      email: 0,
      createdAt: 1,
      username: 1,
      avatar: 1
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    return res.status(200).json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil utilisateur:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la récupération du profil utilisateur' });
  }
};

export default {
  getAllUsers,
  getUserById,
  getProfile,
  getCurrentUser,
  updateProfile,
  updateUser,
  deleteProfile,
  deleteUser,
  getUserProfile
};

