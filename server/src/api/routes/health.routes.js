import express from 'express';

const router = express.Router();

/**
 * @route GET /api/health
 * @desc Route de vérification de santé pour Render.com
 * @access Public
 */
router.get('/', (req, res) => {
  return res.status(200).json({ status: 'ok', message: 'API is running' });
});

export default router;

