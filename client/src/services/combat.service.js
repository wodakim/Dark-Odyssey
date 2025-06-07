import apiService from './api.service';
import { API_ENDPOINTS } from '../config/api';
import authService from './auth.service';

/**
 * Service pour gérer le combat
 */
class CombatService {
  /**
   * Démarre un combat
   * @param {Object} combatData - Données du combat
   * @returns {Promise} - Promesse avec la réponse
   */
  async startCombat(combatData) {
    const token = authService.getToken();
    return await apiService.post(API_ENDPOINTS.combat.start, combatData, { token });
  }
  
  /**
   * Effectue une attaque
   * @returns {Promise} - Promesse avec la réponse
   */
  async attack() {
    const token = authService.getToken();
    return await apiService.post(API_ENDPOINTS.combat.attack, {}, { token });
  }
  
  /**
   * Utilise une compétence
   * @param {string} skillId - ID de la compétence
   * @param {Object} skillData - Données de la compétence
   * @returns {Promise} - Promesse avec la réponse
   */
  async useSkill(skillId, skillData = {}) {
    const token = authService.getToken();
    return await apiService.post(API_ENDPOINTS.combat.skill(skillId), skillData, { token });
  }
  
  /**
   * Utilise un objet en combat
   * @param {string} itemId - ID de l'objet
   * @param {Object} itemData - Données de l'objet
   * @returns {Promise} - Promesse avec la réponse
   */
  async useItem(itemId, itemData = {}) {
    const token = authService.getToken();
    return await apiService.post(API_ENDPOINTS.combat.item(itemId), itemData, { token });
  }
  
  /**
   * Fuit un combat
   * @returns {Promise} - Promesse avec la réponse
   */
  async flee() {
    const token = authService.getToken();
    return await apiService.post(API_ENDPOINTS.combat.flee, {}, { token });
  }
  
  /**
   * Récupère le statut du combat en cours
   * @returns {Promise} - Promesse avec la réponse
   */
  async getCombatStatus() {
    const token = authService.getToken();
    return await apiService.get(API_ENDPOINTS.combat.status, { token });
  }
}

// Créer une instance du service de combat
const combatService = new CombatService();

export default combatService;

