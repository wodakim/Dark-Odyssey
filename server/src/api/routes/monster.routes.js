import express from 'express';
import { 
  getMonsters, 
  getMonsterById, 
  getMonstersByZone
} from '../controllers/monster.controller.js';

const router = express.Router();

/**
 * @route GET /api/monsters
 * @desc Récupérer tous les monstres
 * @access Public
 */
router.get('/', getMonsters);

/**
 * @route GET /api/monsters/:id
 * @desc Récupérer un monstre par son ID
 * @access Public
 */
router.get('/:id', getMonsterById);

/**
 * @route GET /api/monsters/zone/:zoneId
 * @desc Récupérer les monstres d'une zone
 * @access Public
 */
router.get('/zone/:zoneId', getMonstersByZone);

export default router;

