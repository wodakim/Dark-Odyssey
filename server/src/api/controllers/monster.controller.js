import Monster from '../models/monster.model.js';

/**
 * Récupère tous les monstres
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const getMonsters = async (req, res) => {
  try {
    const { minLevel, maxLevel, type, search } = req.query;
    
    // Construire le filtre de recherche
    const filter = {};
    
    if (minLevel) {
      filter.level = { $gte: parseInt(minLevel) };
    }
    
    if (maxLevel) {
      if (filter.level) {
        filter.level.$lte = parseInt(maxLevel);
      } else {
        filter.level = { $lte: parseInt(maxLevel) };
      }
    }
    
    if (type) {
      filter.type = type;
    }
    
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    
    const monsters = await Monster.find(filter);
    return res.status(200).json(monsters);
  } catch (error) {
    console.error('Erreur lors de la récupération des monstres:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la récupération des monstres' });
  }
};

/**
 * Récupère un monstre par son ID
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const getMonsterById = async (req, res) => {
  try {
    const monster = await Monster.findById(req.params.id);
    
    if (!monster) {
      return res.status(404).json({ message: 'Monstre non trouvé' });
    }
    
    return res.status(200).json(monster);
  } catch (error) {
    console.error('Erreur lors de la récupération du monstre:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la récupération du monstre' });
  }
};

/**
 * Récupère les monstres d'une zone
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const getMonstersByZone = async (req, res) => {
  try {
    const monsters = await Monster.find({ zones: req.params.zoneId });
    return res.status(200).json(monsters);
  } catch (error) {
    console.error('Erreur lors de la récupération des monstres de la zone:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la récupération des monstres de la zone' });
  }
};

export default {
  getMonsters,
  getMonsterById,
  getMonstersByZone
};

