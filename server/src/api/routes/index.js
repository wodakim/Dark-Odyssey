import express from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import characterRoutes from './character.routes.js';
import itemRoutes from './item.routes.js';
import zoneRoutes from './zone.routes.js';
import monsterRoutes from './monster.routes.js';
import combatRoutes from './combat.routes.js';
import guildRoutes from './guild.routes.js';

const router = express.Router();

// Routes d'authentification
router.use('/auth', authRoutes);

// Routes utilisateur
router.use('/users', userRoutes);

// Routes personnage
router.use('/characters', characterRoutes);

// Routes objets
router.use('/items', itemRoutes);

// Routes zones
router.use('/zones', zoneRoutes);

// Routes monstres
router.use('/monsters', monsterRoutes);

// Routes combat
router.use('/combat', combatRoutes);

// Routes guilde
router.use('/guilds', guildRoutes);

export default router;

