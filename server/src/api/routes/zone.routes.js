import express from 'express';
import { 
  getZones, 
  getZoneById, 
  exploreZone, 
  travelToZone,
  getZoneEvents
} from '../controllers/zone.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @route GET /api/zones
 * @desc Récupérer toutes les zones disponibles
 * @access Public
 */
router.get('/', getZones);

/**
 * @route GET /api/zones/:id
 * @desc Récupérer une zone par son ID
 * @access Public
 */
router.get('/:id', getZoneById);

/**
 * @route POST /api/zones/:id/explore
 * @desc Explorer une zone (génère des rencontres aléatoires)
 * @access Private
 */
router.post('/:id/explore', authenticate, exploreZone);

/**
 * @route POST /api/zones/:id/travel
 * @desc Voyager vers une zone
 * @access Private
 */
router.post('/:id/travel', authenticate, travelToZone);

/**
 * @route GET /api/zones/:id/events
 * @desc Récupérer les événements d'une zone
 * @access Private
 */
router.get('/:id/events', authenticate, getZoneEvents);

export default router;

