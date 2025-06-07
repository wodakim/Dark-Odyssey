import express from 'express';
import { 
  createGuild, 
  getGuilds, 
  getGuildById, 
  updateGuild, 
  deleteGuild,
  joinGuild,
  leaveGuild,
  kickMember,
  promoteToOfficer,
  demoteFromOfficer,
  transferOwnership
} from '../controllers/guild.controller.js';
import { validateCreateGuild, validateUpdateGuild } from '../validators/guild.validator.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @route POST /api/guilds
 * @desc Créer une nouvelle guilde
 * @access Private
 */
router.post('/', authenticate, validateCreateGuild, createGuild);

/**
 * @route GET /api/guilds
 * @desc Récupérer toutes les guildes
 * @access Public
 */
router.get('/', getGuilds);

/**
 * @route GET /api/guilds/:id
 * @desc Récupérer une guilde par son ID
 * @access Public
 */
router.get('/:id', getGuildById);

/**
 * @route PUT /api/guilds/:id
 * @desc Mettre à jour une guilde
 * @access Private (propriétaire de la guilde uniquement)
 */
router.put('/:id', authenticate, validateUpdateGuild, updateGuild);

/**
 * @route DELETE /api/guilds/:id
 * @desc Supprimer une guilde
 * @access Private (propriétaire de la guilde uniquement)
 */
router.delete('/:id', authenticate, deleteGuild);

/**
 * @route POST /api/guilds/:id/join
 * @desc Rejoindre une guilde
 * @access Private
 */
router.post('/:id/join', authenticate, joinGuild);

/**
 * @route POST /api/guilds/:id/leave
 * @desc Quitter une guilde
 * @access Private
 */
router.post('/:id/leave', authenticate, leaveGuild);

/**
 * @route POST /api/guilds/:id/kick/:userId
 * @desc Expulser un membre de la guilde
 * @access Private (propriétaire ou officier de la guilde uniquement)
 */
router.post('/:id/kick/:userId', authenticate, kickMember);

/**
 * @route POST /api/guilds/:id/promote/:userId
 * @desc Promouvoir un membre au rang d'officier
 * @access Private (propriétaire de la guilde uniquement)
 */
router.post('/:id/promote/:userId', authenticate, promoteToOfficer);

/**
 * @route POST /api/guilds/:id/demote/:userId
 * @desc Rétrograder un officier au rang de membre
 * @access Private (propriétaire de la guilde uniquement)
 */
router.post('/:id/demote/:userId', authenticate, demoteFromOfficer);

/**
 * @route POST /api/guilds/:id/transfer/:userId
 * @desc Transférer la propriété de la guilde
 * @access Private (propriétaire de la guilde uniquement)
 */
router.post('/:id/transfer/:userId', authenticate, transferOwnership);

export default router;

