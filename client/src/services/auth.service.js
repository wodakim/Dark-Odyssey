import apiService from './api.service';
import { API_ENDPOINTS } from '../config/api';

/**
 * Service pour gérer l'authentification
 */
class AuthService {
  /**
   * Inscrit un nouvel utilisateur
   * @param {Object} userData - Données de l'utilisateur
   * @returns {Promise} - Promesse avec la réponse
   */
  async register(userData) {
    return await apiService.post(API_ENDPOINTS.auth.register, userData);
  }
  
  /**
   * Connecte un utilisateur
   * @param {Object} credentials - Identifiants de connexion
   * @returns {Promise} - Promesse avec la réponse
   */
  async login(credentials) {
    const response = await apiService.post(API_ENDPOINTS.auth.login, credentials);
    
    if (response && response._id) {
      // Stocker les informations de l'utilisateur et le token dans le localStorage
      localStorage.setItem('user', JSON.stringify(response));
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
    }
    
    return response;
  }
  
  /**
   * Déconnecte l'utilisateur
   * @returns {Promise} - Promesse avec la réponse
   */
  async logout() {
    const token = localStorage.getItem('token');
    const response = await apiService.post(API_ENDPOINTS.auth.logout, {}, { token });
    
    // Supprimer les informations de l'utilisateur et le token du localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    
    return response;
  }
  
  /**
   * Rafraîchit le token d'authentification
   * @returns {Promise} - Promesse avec la réponse
   */
  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      return { error: 'Refresh token non disponible' };
    }
    
    const response = await apiService.post(API_ENDPOINTS.auth.refresh, { refreshToken });
    
    if (response && response.token) {
      // Mettre à jour le token dans le localStorage
      localStorage.setItem('token', response.token);
    }
    
    return response;
  }
  
  /**
   * Récupère l'utilisateur connecté
   * @returns {Object|null} - Utilisateur connecté ou null
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
  
  /**
   * Récupère le token d'authentification
   * @returns {string|null} - Token d'authentification ou null
   */
  getToken() {
    return localStorage.getItem('token');
  }
  
  /**
   * Vérifie si l'utilisateur est connecté
   * @returns {boolean} - True si l'utilisateur est connecté, false sinon
   */
  isLoggedIn() {
    return !!this.getToken();
  }
}

// Créer une instance du service d'authentification
const authService = new AuthService();

export default authService;

