import express from 'express';
import { 
  createCharacter, 
  getCharacters, 
  getCharacterById, 
  updateCharacter, 
  deleteCharacter,
  assignStatPoint,
  updateAppearance,
  equipItem,
  unequipItem
} from '../controllers/character.controller.js';
import { validateCreateCharacter, validateUpdateCharacter } from '../validators/character.validator.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @route POST /api/characters
 * @desc Créer un nouveau personnage
 * @access Private
 */
router.post('/', authenticate, validateCreateCharacter, createCharacter);

/**
 * @route GET /api/characters
 * @desc Récupérer tous les personnages de l'utilisateur connecté
 * @access Private
 */
router.get('/', authenticate, getCharacters);

/**
 * @route GET /api/characters/:id
 * @desc Récupérer un personnage par son ID
 * @access Private
 */
router.get('/:id', authenticate, getCharacterById);

/**
 * @route PUT /api/characters/:id
 * @desc Mettre à jour un personnage
 * @access Private
 */
router.put('/:id', authenticate, validateUpdateCharacter, updateCharacter);

/**
 * @route DELETE /api/characters/:id
 * @desc Supprimer un personnage
 * @access Private
 */
router.delete('/:id', authenticate, deleteCharacter);

/**
 * @route POST /api/characters/:id/stats
 * @desc Assigner un point de statistique
 * @access Private
 */
router.post('/:id/stats', authenticate, assignStatPoint);

/**
 * @route PUT /api/characters/:id/appearance
 * @desc Mettre à jour l'apparence d'un personnage
 * @access Private
 */
router.put('/:id/appearance', authenticate, updateAppearance);

/**
 * @route POST /api/characters/:id/equip
 * @desc Équiper un objet
 * @access Private
 */
router.post('/:id/equip', authenticate, equipItem);

/**
 * @route POST /api/characters/:id/unequip
 * @desc Déséquiper un objet
 * @access Private
 */
router.post('/:id/unequip', authenticate, unequipItem);

export default router;

