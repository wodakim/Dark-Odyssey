import apiService from './api.service';
import { API_ENDPOINTS } from '../config/api';
import authService from './auth.service';

/**
 * Service pour gérer les personnages
 */
class CharacterService {
  /**
   * Récupère tous les personnages de l'utilisateur
   * @returns {Promise} - Promesse avec la réponse
   */
  async getCharacters() {
    const token = authService.getToken();
    return await apiService.get(API_ENDPOINTS.characters.list, { token });
  }
  
  /**
   * Récupère un personnage par son ID
   * @param {string} id - ID du personnage
   * @returns {Promise} - Promesse avec la réponse
   */
  async getCharacterById(id) {
    const token = authService.getToken();
    return await apiService.get(API_ENDPOINTS.characters.get(id), { token });
  }
  
  /**
   * Crée un nouveau personnage
   * @param {Object} characterData - Données du personnage
   * @returns {Promise} - Promesse avec la réponse
   */
  async createCharacter(characterData) {
    const token = authService.getToken();
    return await apiService.post(API_ENDPOINTS.characters.create, characterData, { token });
  }
  
  /**
   * Met à jour un personnage
   * @param {string} id - ID du personnage
   * @param {Object} characterData - Données du personnage
   * @returns {Promise} - Promesse avec la réponse
   */
  async updateCharacter(id, characterData) {
    const token = authService.getToken();
    return await apiService.put(API_ENDPOINTS.characters.update(id), characterData, { token });
  }
  
  /**
   * Supprime un personnage
   * @param {string} id - ID du personnage
   * @returns {Promise} - Promesse avec la réponse
   */
  async deleteCharacter(id) {
    const token = authService.getToken();
    return await apiService.delete(API_ENDPOINTS.characters.delete(id), { token });
  }
  
  /**
   * Assigne un point de statistique
   * @param {string} id - ID du personnage
   * @param {Object} statData - Données de statistique
   * @returns {Promise} - Promesse avec la réponse
   */
  async assignStatPoint(id, statData) {
    const token = authService.getToken();
    return await apiService.post(API_ENDPOINTS.characters.stats(id), statData, { token });
  }
  
  /**
   * Met à jour l'apparence d'un personnage
   * @param {string} id - ID du personnage
   * @param {Object} appearanceData - Données d'apparence
   * @returns {Promise} - Promesse avec la réponse
   */
  async updateAppearance(id, appearanceData) {
    const token = authService.getToken();
    return await apiService.put(API_ENDPOINTS.characters.appearance(id), appearanceData, { token });
  }
  
  /**
   * Équipe un objet
   * @param {string} id - ID du personnage
   * @param {Object} equipData - Données d'équipement
   * @returns {Promise} - Promesse avec la réponse
   */
  async equipItem(id, equipData) {
    const token = authService.getToken();
    return await apiService.post(API_ENDPOINTS.characters.equip(id), equipData, { token });
  }
  
  /**
   * Déséquipe un objet
   * @param {string} id - ID du personnage
   * @param {Object} unequipData - Données de déséquipement
   * @returns {Promise} - Promesse avec la réponse
   */
  async unequipItem(id, unequipData) {
    const token = authService.getToken();
    return await apiService.post(API_ENDPOINTS.characters.unequip(id), unequipData, { token });
  }
}

// Créer une instance du service de personnage
const characterService = new CharacterService();

export default characterService;

