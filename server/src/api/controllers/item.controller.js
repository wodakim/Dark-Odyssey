import Item from '../models/item.model.js';
import Character from '../models/character.model.js';

/**
 * Récupère tous les objets disponibles
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const getItems = async (req, res) => {
  try {
    const { type, rarity, minLevel, maxLevel, search } = req.query;
    
    // Construire le filtre de recherche
    const filter = {};
    
    if (type) {
      filter.type = type;
    }
    
    if (rarity) {
      filter.rarity = rarity;
    }
    
    if (minLevel) {
      filter.requiredLevel = { $gte: parseInt(minLevel) };
    }
    
    if (maxLevel) {
      if (filter.requiredLevel) {
        filter.requiredLevel.$lte = parseInt(maxLevel);
      } else {
        filter.requiredLevel = { $lte: parseInt(maxLevel) };
      }
    }
    
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    
    const items = await Item.find(filter);
    return res.status(200).json(items);
  } catch (error) {
    console.error('Erreur lors de la récupération des objets:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la récupération des objets' });
  }
};

/**
 * Récupère un objet par son ID
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Objet non trouvé' });
    }
    
    return res.status(200).json(item);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'objet:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la récupération de l\'objet' });
  }
};

/**
 * Utilise un objet
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const useItem = async (req, res) => {
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
    
    // Vérifier si l'objet est dans l'inventaire
    const inventoryIndex = character.inventory.findIndex(item => item.toString() === req.params.id);
    if (inventoryIndex === -1) {
      return res.status(400).json({ message: 'Objet non trouvé dans l\'inventaire' });
    }
    
    // Récupérer l'objet
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Objet non trouvé' });
    }
    
    // Vérifier si l'objet est utilisable
    if (item.type !== 'consumable') {
      return res.status(400).json({ message: 'Cet objet n\'est pas utilisable' });
    }
    
    // Appliquer les effets de l'objet
    let message = '';
    switch (item.effect.type) {
      case 'heal':
        const healing = item.effect.value;
        character.currentHp = Math.min(character.maxHp, character.currentHp + healing);
        message = `${character.name} récupère ${healing} points de vie`;
        break;
      case 'mana':
        const mana = item.effect.value;
        character.currentMp = Math.min(character.maxMp, character.currentMp + mana);
        message = `${character.name} récupère ${mana} points de mana`;
        break;
      case 'experience':
        const experience = item.effect.value;
        character.experience += experience;
        message = `${character.name} gagne ${experience} points d'expérience`;
        
        // Vérifier si le personnage monte de niveau
        const expRequired = calculateRequiredExp(character.level);
        if (character.experience >= expRequired) {
          character.level += 1;
          character.experience -= expRequired;
          character.statPoints += 5;
          
          // Augmenter les points de vie et de mana
          character.maxHp += 10;
          character.currentHp = character.maxHp;
          character.maxMp += 5;
          character.currentMp = character.maxMp;
          
          message += ` et passe au niveau ${character.level}`;
        }
        break;
      case 'stat':
        const statValue = item.effect.value;
        const stat = item.effect.stat;
        
        if (!['strength', 'dexterity', 'intelligence', 'constitution', 'wisdom', 'charisma'].includes(stat)) {
          return res.status(400).json({ message: 'Statistique invalide' });
        }
        
        character.stats[stat] += statValue;
        
        // Mettre à jour les points de vie et de mana si nécessaire
        if (stat === 'constitution') {
          character.maxHp += statValue * 5;
          character.currentHp += statValue * 5;
        }
        
        if (stat === 'intelligence') {
          character.maxMp += statValue * 3;
          character.currentMp += statValue * 3;
        }
        
        message = `${character.name} gagne ${statValue} points de ${stat}`;
        break;
      default:
        return res.status(400).json({ message: 'Type d\'effet inconnu' });
    }
    
    // Retirer l'objet de l'inventaire
    character.inventory.splice(inventoryIndex, 1);
    
    await character.save();
    
    return res.status(200).json({ 
      message,
      character
    });
  } catch (error) {
    console.error('Erreur lors de l\'utilisation de l\'objet:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de l\'utilisation de l\'objet' });
  }
};

/**
 * Vend un objet
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const sellItem = async (req, res) => {
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
    
    // Vérifier si l'objet est dans l'inventaire
    const inventoryIndex = character.inventory.findIndex(item => item.toString() === req.params.id);
    if (inventoryIndex === -1) {
      return res.status(400).json({ message: 'Objet non trouvé dans l\'inventaire' });
    }
    
    // Récupérer l'objet
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Objet non trouvé' });
    }
    
    // Calculer le prix de vente (généralement 50% du prix d'achat)
    const sellPrice = Math.floor(item.value * 0.5);
    
    // Ajouter l'or au personnage
    character.gold += sellPrice;
    
    // Retirer l'objet de l'inventaire
    character.inventory.splice(inventoryIndex, 1);
    
    await character.save();
    
    return res.status(200).json({
      message: `${item.name} vendu pour ${sellPrice} pièces d'or`,
      character
    });
  } catch (error) {
    console.error('Erreur lors de la vente de l\'objet:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la vente de l\'objet' });
  }
};

/**
 * Achète un objet
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const buyItem = async (req, res) => {
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
    
    // Récupérer l'objet
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Objet non trouvé' });
    }
    
    // Vérifier si le personnage a assez d'or
    if (character.gold < item.value) {
      return res.status(400).json({ message: 'Pas assez d'or pour acheter cet objet' });
    }
    
    // Vérifier si le personnage a le niveau requis
    if (character.level < item.requiredLevel) {
      return res.status(400).json({ message: `Niveau ${item.requiredLevel} requis pour acheter cet objet` });
    }
    
    // Vérifier si le personnage a la classe requise
    if (item.requiredClass && item.requiredClass !== character.class) {
      return res.status(400).json({ message: `Classe ${item.requiredClass} requise pour acheter cet objet` });
    }
    
    // Retirer l'or du personnage
    character.gold -= item.value;
    
    // Ajouter l'objet à l'inventaire
    character.inventory.push(item._id);
    
    await character.save();
    
    return res.status(200).json({
      message: `${item.name} acheté pour ${item.value} pièces d'or`,
      character
    });
  } catch (error) {
    console.error('Erreur lors de l\'achat de l\'objet:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de l\'achat de l\'objet' });
  }
};

/**
 * Fabrique un objet
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const craftItem = async (req, res) => {
  try {
    const { characterId, recipeId } = req.body;
    
    // Vérifier si le personnage existe et appartient à l'utilisateur
    const character = await Character.findById(characterId);
    if (!character) {
      return res.status(404).json({ message: 'Personnage non trouvé' });
    }
    
    if (character.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Accès non autorisé à ce personnage' });
    }
    
    // Logique de fabrication à implémenter
    // Pour l'instant, retourner un message d'erreur
    return res.status(501).json({ message: 'Fonctionnalité de fabrication non implémentée' });
  } catch (error) {
    console.error('Erreur lors de la fabrication de l\'objet:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la fabrication de l\'objet' });
  }
};

/**
 * Calcule l'expérience requise pour le niveau suivant
 * @param {number} level - Niveau actuel
 * @returns {number} Expérience requise
 */
const calculateRequiredExp = (level) => {
  return 100 * Math.pow(1.5, level - 1);
};

export default {
  getItems,
  getItemById,
  useItem,
  sellItem,
  buyItem,
  craftItem
};

