import express from 'express';
import { 
  startCombat, 
  attack, 
  useSkill, 
  useItemInCombat, 
  flee,
  getCombatStatus
} from '../controllers/combat.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @route POST /api/combat/start
 * @desc Démarrer un combat avec un monstre
 * @access Private
 */
router.post('/start', authenticate, startCombat);

/**
 * @route POST /api/combat/attack
 * @desc Effectuer une attaque de base
 * @access Private
 */
router.post('/attack', authenticate, attack);

/**
 * @route POST /api/combat/skill/:skillId
 * @desc Utiliser une compétence en combat
 * @access Private
 */
router.post('/skill/:skillId', authenticate, useSkill);

/**
 * @route POST /api/combat/item/:itemId
 * @desc Utiliser un objet en combat
 * @access Private
 */
router.post('/item/:itemId', authenticate, useItemInCombat);

/**
 * @route POST /api/combat/flee
 * @desc Fuir un combat
 * @access Private
 */
router.post('/flee', authenticate, flee);

/**
 * @route GET /api/combat/status
 * @desc Récupérer le statut du combat en cours
 * @access Private
 */
router.get('/status', authenticate, getCombatStatus);

export default router;

