import Zone from '../models/zone.model.js';
import Character from '../models/character.model.js';
import Monster from '../models/monster.model.js';
import Item from '../models/item.model.js';

/**
 * Récupère toutes les zones disponibles
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const getZones = async (req, res) => {
  try {
    const { minLevel, maxLevel, type, search } = req.query;
    
    // Construire le filtre de recherche
    const filter = {};
    
    if (minLevel) {
      filter.recommendedLevel = { $gte: parseInt(minLevel) };
    }
    
    if (maxLevel) {
      if (filter.recommendedLevel) {
        filter.recommendedLevel.$lte = parseInt(maxLevel);
      } else {
        filter.recommendedLevel = { $lte: parseInt(maxLevel) };
      }
    }
    
    if (type) {
      filter.type = type;
    }
    
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    
    const zones = await Zone.find(filter);
    return res.status(200).json(zones);
  } catch (error) {
    console.error('Erreur lors de la récupération des zones:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la récupération des zones' });
  }
};

/**
 * Récupère une zone par son ID
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const getZoneById = async (req, res) => {
  try {
    const zone = await Zone.findById(req.params.id);
    
    if (!zone) {
      return res.status(404).json({ message: 'Zone non trouvée' });
    }
    
    return res.status(200).json(zone);
  } catch (error) {
    console.error('Erreur lors de la récupération de la zone:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la récupération de la zone' });
  }
};

/**
 * Explore une zone (génère des rencontres aléatoires)
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const exploreZone = async (req, res) => {
  try {
    const { characterId } = req.body;
    
    // Vérifier si le personnage existe et appartient à l'utilisateur
    const character = await Character.findById(characterId);
    if (!character) {
      return res.status(404).json({ message: 'Personnage non trouvé' });
    }
    
    if (character.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Accès non autorisé à ce personnage' });
    }
    
    // Vérifier si le personnage est dans la zone
    if (character.position.zone !== req.params.id) {
      return res.status(400).json({ message: 'Le personnage n\'est pas dans cette zone' });
    }
    
    // Récupérer la zone
    const zone = await Zone.findById(req.params.id);
    if (!zone) {
      return res.status(404).json({ message: 'Zone non trouvée' });
    }
    
    // Générer un événement aléatoire
    const eventType = generateRandomEvent(zone);
    let event = null;
    
    switch (eventType) {
      case 'monster':
        // Générer une rencontre avec un monstre
        const monsters = await Monster.find({ zones: zone._id });
        if (monsters.length > 0) {
          const monster = monsters[Math.floor(Math.random() * monsters.length)];
          event = {
            type: 'monster',
            monster: monster,
            message: `${character.name} a rencontré un ${monster.name} !`
          };
        } else {
          event = {
            type: 'empty',
            message: `${character.name} explore la zone mais ne trouve rien d'intéressant.`
          };
        }
        break;
      case 'treasure':
        // Générer un trésor
        const treasureValue = Math.floor(10 + Math.random() * 20 * zone.recommendedLevel);
        character.gold += treasureValue;
        await character.save();
        
        event = {
          type: 'treasure',
          gold: treasureValue,
          message: `${character.name} a trouvé un trésor contenant ${treasureValue} pièces d'or !`
        };
        break;
      case 'item':
        // Générer un objet aléatoire
        const items = await Item.find({ requiredLevel: { $lte: character.level } });
        if (items.length > 0) {
          const item = items[Math.floor(Math.random() * items.length)];
          character.inventory.push(item._id);
          await character.save();
          
          event = {
            type: 'item',
            item: item,
            message: `${character.name} a trouvé un ${item.name} !`
          };
        } else {
          event = {
            type: 'empty',
            message: `${character.name} explore la zone mais ne trouve rien d'intéressant.`
          };
        }
        break;
      case 'empty':
      default:
        // Rien ne se passe
        event = {
          type: 'empty',
          message: `${character.name} explore la zone mais ne trouve rien d'intéressant.`
        };
        break;
    }
    
    // Ajouter l'événement à l'historique de la zone
    if (!zone.events) {
      zone.events = [];
    }
    
    zone.events.push({
      characterId: character._id,
      characterName: character.name,
      type: event.type,
      message: event.message,
      timestamp: new Date()
    });
    
    // Limiter le nombre d'événements stockés
    if (zone.events.length > 100) {
      zone.events = zone.events.slice(-100);
    }
    
    await zone.save();
    
    return res.status(200).json({
      event,
      character
    });
  } catch (error) {
    console.error('Erreur lors de l\'exploration de la zone:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de l\'exploration de la zone' });
  }
};

/**
 * Voyage vers une zone
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const travelToZone = async (req, res) => {
  try {
    const { characterId } = req.body;
    
    // Vérifier si le personnage existe et appartient à l'utilisateur
    const character = await Character.findById(characterId);
    if (!character) {
      return res.status(404).json({ message: 'Personnage non trouvé' });
    }
    
    if (character.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Accès non autorisé à ce personnage' });
    }
    
    // Récupérer la zone de destination
    const destinationZone = await Zone.findById(req.params.id);
    if (!destinationZone) {
      return res.status(404).json({ message: 'Zone de destination non trouvée' });
    }
    
    // Vérifier si le personnage a le niveau requis
    if (character.level < destinationZone.recommendedLevel) {
      return res.status(400).json({ 
        message: `Niveau ${destinationZone.recommendedLevel} recommandé pour cette zone. Voyager quand même ?`,
        warning: true
      });
    }
    
    // Vérifier si la zone est accessible depuis la zone actuelle
    if (character.position.zone !== 'starting_village' && !destinationZone.connectedZones.includes(character.position.zone)) {
      return res.status(400).json({ message: 'Cette zone n\'est pas accessible depuis votre position actuelle' });
    }
    
    // Mettre à jour la position du personnage
    character.position = {
      zone: destinationZone._id,
      x: 50, // Position par défaut au centre de la zone
      y: 50
    };
    
    await character.save();
    
    return res.status(200).json({
      message: `${character.name} a voyagé vers ${destinationZone.name}`,
      character,
      zone: destinationZone
    });
  } catch (error) {
    console.error('Erreur lors du voyage vers la zone:', error);
    return res.status(500).json({ message: 'Erreur serveur lors du voyage vers la zone' });
  }
};

/**
 * Récupère les événements d'une zone
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const getZoneEvents = async (req, res) => {
  try {
    const zone = await Zone.findById(req.params.id);
    
    if (!zone) {
      return res.status(404).json({ message: 'Zone non trouvée' });
    }
    
    // Récupérer les événements de la zone
    const events = zone.events || [];
    
    return res.status(200).json(events);
  } catch (error) {
    console.error('Erreur lors de la récupération des événements de la zone:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la récupération des événements de la zone' });
  }
};

/**
 * Génère un événement aléatoire en fonction de la zone
 * @param {Object} zone - Zone
 * @returns {string} Type d'événement
 */
const generateRandomEvent = (zone) => {
  const roll = Math.random();
  
  // Probabilités par défaut
  let monsterChance = 0.4;
  let treasureChance = 0.2;
  let itemChance = 0.1;
  
  // Ajuster les probabilités en fonction du type de zone
  switch (zone.type) {
    case 'dungeon':
      monsterChance = 0.6;
      treasureChance = 0.3;
      itemChance = 0.05;
      break;
    case 'forest':
      monsterChance = 0.5;
      treasureChance = 0.1;
      itemChance = 0.2;
      break;
    case 'city':
      monsterChance = 0.1;
      treasureChance = 0.05;
      itemChance = 0.3;
      break;
    default:
      break;
  }
  
  if (roll < monsterChance) {
    return 'monster';
  } else if (roll < monsterChance + treasureChance) {
    return 'treasure';
  } else if (roll < monsterChance + treasureChance + itemChance) {
    return 'item';
  } else {
    return 'empty';
  }
};

export default {
  getZones,
  getZoneById,
  exploreZone,
  travelToZone,
  getZoneEvents
};

