// Service d'authentification pour Dark Odyssey
// Fichier: /client/src/services/authService.js

import axios from 'axios';

// Récupérer l'URL de l'API depuis les variables d'environnement
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Créer une instance axios avec la base URL
const api = axios.create({
  baseURL: `${API_URL}/api/auth`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Service d'authentification
const authService = {
  // Inscription d'un nouvel utilisateur
  register: async (username, email, password) => {
    try {
      const response = await api.post('/register', {
        username,
        email,
        password
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error.response?.data || error.message);
      throw error;
    }
  },
  
  // Connexion d'un utilisateur
  login: async (email, password) => {
    try {
      const response = await api.post('/login', {
        email,
        password
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error.response?.data || error.message);
      throw error;
    }
  },
  
  // Déconnexion
  logout: async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error.response?.data || error.message);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },
  
  // Rafraîchissement du token
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        throw new Error('Refresh token non disponible');
      }
      
      const response = await api.post('/refresh', {
        refreshToken
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error.response?.data || error.message);
      // En cas d'erreur, déconnecter l'utilisateur
      authService.logout();
      throw error;
    }
  },
  
  // Vérifier si l'utilisateur est connecté
  isLoggedIn: () => {
    return !!localStorage.getItem('token');
  },
  
  // Récupérer l'utilisateur connecté
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  // Récupérer le token
  getToken: () => {
    return localStorage.getItem('token');
  }
};

export default authService;

