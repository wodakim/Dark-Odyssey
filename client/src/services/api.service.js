import { API_ENDPOINTS, getDefaultHeaders, handleApiError } from '../config/api';

/**
 * Service pour gérer les requêtes API
 */
class ApiService {
  /**
   * Effectue une requête GET
   * @param {string} url - URL de la requête
   * @param {Object} options - Options de la requête
   * @returns {Promise} - Promesse avec la réponse
   */
  async get(url, options = {}) {
    try {
      const { token, params } = options;
      
      // Construire l'URL avec les paramètres de requête
      const queryParams = params ? `?${new URLSearchParams(params).toString()}` : '';
      const fullUrl = `${url}${queryParams}`;
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: getDefaultHeaders(token),
      });
      
      if (!response.ok) {
        throw await response.json();
      }
      
      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  }
  
  /**
   * Effectue une requête POST
   * @param {string} url - URL de la requête
   * @param {Object} data - Données à envoyer
   * @param {Object} options - Options de la requête
   * @returns {Promise} - Promesse avec la réponse
   */
  async post(url, data = {}, options = {}) {
    try {
      const { token } = options;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: getDefaultHeaders(token),
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw await response.json();
      }
      
      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  }
  
  /**
   * Effectue une requête PUT
   * @param {string} url - URL de la requête
   * @param {Object} data - Données à envoyer
   * @param {Object} options - Options de la requête
   * @returns {Promise} - Promesse avec la réponse
   */
  async put(url, data = {}, options = {}) {
    try {
      const { token } = options;
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: getDefaultHeaders(token),
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw await response.json();
      }
      
      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  }
  
  /**
   * Effectue une requête DELETE
   * @param {string} url - URL de la requête
   * @param {Object} options - Options de la requête
   * @returns {Promise} - Promesse avec la réponse
   */
  async delete(url, options = {}) {
    try {
      const { token } = options;
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: getDefaultHeaders(token),
      });
      
      if (!response.ok) {
        throw await response.json();
      }
      
      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  }
}

// Créer une instance du service API
const apiService = new ApiService();

export default apiService;

