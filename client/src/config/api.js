/**
 * Configuration de l'API
 */

// URL de base de l'API
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// URL du serveur Socket.io
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

// Endpoints de l'API
export const API_ENDPOINTS = {
  // Authentification
  auth: {
    register: `${API_BASE_URL}/auth/register`,
    login: `${API_BASE_URL}/auth/login`,
    refresh: `${API_BASE_URL}/auth/refresh`,
    logout: `${API_BASE_URL}/auth/logout`,
  },
  
  // Utilisateurs
  users: {
    me: `${API_BASE_URL}/users/me`,
    profile: (username) => `${API_BASE_URL}/users/${username}`,
    update: `${API_BASE_URL}/users/me`,
    delete: `${API_BASE_URL}/users/me`,
  },
  
  // Personnages
  characters: {
    list: `${API_BASE_URL}/characters`,
    create: `${API_BASE_URL}/characters`,
    get: (id) => `${API_BASE_URL}/characters/${id}`,
    update: (id) => `${API_BASE_URL}/characters/${id}`,
    delete: (id) => `${API_BASE_URL}/characters/${id}`,
    stats: (id) => `${API_BASE_URL}/characters/${id}/stats`,
    appearance: (id) => `${API_BASE_URL}/characters/${id}/appearance`,
    equip: (id) => `${API_BASE_URL}/characters/${id}/equip`,
    unequip: (id) => `${API_BASE_URL}/characters/${id}/unequip`,
  },
  
  // Objets
  items: {
    list: `${API_BASE_URL}/items`,
    get: (id) => `${API_BASE_URL}/items/${id}`,
    use: (id) => `${API_BASE_URL}/items/${id}/use`,
    sell: (id) => `${API_BASE_URL}/items/${id}/sell`,
    buy: (id) => `${API_BASE_URL}/items/${id}/buy`,
    craft: `${API_BASE_URL}/items/craft`,
  },
  
  // Zones
  zones: {
    list: `${API_BASE_URL}/zones`,
    get: (id) => `${API_BASE_URL}/zones/${id}`,
    explore: (id) => `${API_BASE_URL}/zones/${id}/explore`,
    travel: (id) => `${API_BASE_URL}/zones/${id}/travel`,
    events: (id) => `${API_BASE_URL}/zones/${id}/events`,
  },
  
  // Monstres
  monsters: {
    list: `${API_BASE_URL}/monsters`,
    get: (id) => `${API_BASE_URL}/monsters/${id}`,
    byZone: (zoneId) => `${API_BASE_URL}/monsters/zone/${zoneId}`,
  },
  
  // Combat
  combat: {
    start: `${API_BASE_URL}/combat/start`,
    attack: `${API_BASE_URL}/combat/attack`,
    skill: (skillId) => `${API_BASE_URL}/combat/skill/${skillId}`,
    item: (itemId) => `${API_BASE_URL}/combat/item/${itemId}`,
    flee: `${API_BASE_URL}/combat/flee`,
    status: `${API_BASE_URL}/combat/status`,
  },
  
  // Guildes
  guilds: {
    list: `${API_BASE_URL}/guilds`,
    create: `${API_BASE_URL}/guilds`,
    get: (id) => `${API_BASE_URL}/guilds/${id}`,
    update: (id) => `${API_BASE_URL}/guilds/${id}`,
    delete: (id) => `${API_BASE_URL}/guilds/${id}`,
    join: (id) => `${API_BASE_URL}/guilds/${id}/join`,
    leave: (id) => `${API_BASE_URL}/guilds/${id}/leave`,
    kick: (id, userId) => `${API_BASE_URL}/guilds/${id}/kick/${userId}`,
    promote: (id, userId) => `${API_BASE_URL}/guilds/${id}/promote/${userId}`,
    demote: (id, userId) => `${API_BASE_URL}/guilds/${id}/demote/${userId}`,
    transfer: (id, userId) => `${API_BASE_URL}/guilds/${id}/transfer/${userId}`,
  },
};

// Configuration des headers par défaut
export const getDefaultHeaders = (token) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Fonction pour gérer les erreurs de l'API
export const handleApiError = (error) => {
  if (error.response) {
    // La requête a été faite et le serveur a répondu avec un code d'état
    // qui n'est pas dans la plage 2xx
    console.error('API Error Response:', error.response.data);
    return {
      status: error.response.status,
      message: error.response.data.message || 'Une erreur est survenue',
      errors: error.response.data.errors,
    };
  } else if (error.request) {
    // La requête a été faite mais aucune réponse n'a été reçue
    console.error('API Error Request:', error.request);
    return {
      status: 0,
      message: 'Aucune réponse du serveur',
    };
  } else {
    // Une erreur s'est produite lors de la configuration de la requête
    console.error('API Error Setup:', error.message);
    return {
      status: 0,
      message: 'Erreur lors de la configuration de la requête',
    };
  }
};

export default {
  API_BASE_URL,
  SOCKET_URL,
  API_ENDPOINTS,
  getDefaultHeaders,
  handleApiError,
};

