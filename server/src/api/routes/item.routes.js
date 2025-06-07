import express from 'express';
import { 
  getItems, 
  getItemById, 
  useItem, 
  sellItem,
  buyItem,
  craftItem
} from '../controllers/item.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @route GET /api/items
 * @desc Récupérer tous les objets disponibles
 * @access Public
 */
router.get('/', getItems);

/**
 * @route GET /api/items/:id
 * @desc Récupérer un objet par son ID
 * @access Public
 */
router.get('/:id', getItemById);

/**
 * @route POST /api/items/:id/use
 * @desc Utiliser un objet
 * @access Private
 */
router.post('/:id/use', authenticate, useItem);

/**
 * @route POST /api/items/:id/sell
 * @desc Vendre un objet
 * @access Private
 */
router.post('/:id/sell', authenticate, sellItem);

/**
 * @route POST /api/items/:id/buy
 * @desc Acheter un objet
 * @access Private
 */
router.post('/:id/buy', authenticate, buyItem);

/**
 * @route POST /api/items/craft
 * @desc Fabriquer un objet
 * @access Private
 */
router.post('/craft', authenticate, craftItem);

export default router;

