import { io } from 'socket.io-client';
import { SOCKET_URL } from '../config/api';
import authService from './auth.service';

/**
 * Service pour gérer la connexion Socket.io
 */
class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.listeners = {};
  }
  
  /**
   * Initialise la connexion Socket.io
   * @returns {Object} - Instance Socket.io
   */
  init() {
    if (this.socket) {
      return this.socket;
    }
    
    const token = authService.getToken();
    
    if (!token) {
      console.error('Token non disponible pour la connexion Socket.io');
      return null;
    }
    
    this.socket = io(SOCKET_URL, {
      auth: {
        token
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });
    
    this.setupListeners();
    
    return this.socket;
  }
  
  /**
   * Configure les écouteurs d'événements par défaut
   */
  setupListeners() {
    if (!this.socket) return;
    
    this.socket.on('connect', () => {
      console.log('Connexion Socket.io établie');
      this.connected = true;
    });
    
    this.socket.on('disconnect', (reason) => {
      console.log(`Déconnexion Socket.io: ${reason}`);
      this.connected = false;
    });
    
    this.socket.on('connect_error', (error) => {
      console.error('Erreur de connexion Socket.io:', error);
      this.connected = false;
    });
    
    this.socket.on('error', (error) => {
      console.error('Erreur Socket.io:', error);
    });
  }
  
  /**
   * Vérifie si la connexion est établie
   * @returns {boolean} - True si connecté, false sinon
   */
  isConnected() {
    return this.connected && this.socket && this.socket.connected;
  }
  
  /**
   * Écoute un événement
   * @param {string} event - Nom de l'événement
   * @param {Function} callback - Fonction de rappel
   */
  on(event, callback) {
    if (!this.socket) {
      this.init();
    }
    
    if (this.socket) {
      this.socket.on(event, callback);
      
      // Stocker le callback pour pouvoir le supprimer plus tard
      if (!this.listeners[event]) {
        this.listeners[event] = [];
      }
      this.listeners[event].push(callback);
    }
  }
  
  /**
   * Émet un événement
   * @param {string} event - Nom de l'événement
   * @param {Object} data - Données à envoyer
   */
  emit(event, data) {
    if (!this.socket) {
      this.init();
    }
    
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }
  
  /**
   * Supprime un écouteur d'événement
   * @param {string} event - Nom de l'événement
   * @param {Function} callback - Fonction de rappel à supprimer
   */
  off(event, callback) {
    if (!this.socket) return;
    
    if (callback) {
      this.socket.off(event, callback);
      
      // Supprimer le callback de la liste des écouteurs
      if (this.listeners[event]) {
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
      }
    } else {
      // Supprimer tous les écouteurs pour cet événement
      if (this.listeners[event]) {
        this.listeners[event].forEach(cb => {
          this.socket.off(event, cb);
        });
        delete this.listeners[event];
      }
    }
  }
  
  /**
   * Déconnecte la connexion Socket.io
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      this.listeners = {};
    }
  }
}

// Créer une instance du service Socket.io
const socketService = new SocketService();

export default socketService;

