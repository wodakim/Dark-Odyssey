import Character from '../models/character.model.js';
import User from '../models/user.model.js';
import Item from '../models/item.model.js';

/**
 * Crée un nouveau personnage
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const createCharacter = async (req, res) => {
  try {
    const { name, race, class: characterClass, appearance } = req.body;
    
    // Vérifier si l'utilisateur a déjà atteint le nombre maximum de personnages (3)
    const characterCount = await Character.countDocuments({ userId: req.userId });
    if (characterCount >= 3) {
      return res.status(400).json({ message: "Vous avez atteint le nombre maximum de personnages (3)" });
    }
    
    // Créer le personnage avec les statistiques de base selon la classe
    let baseStats = {
      strength: 10,
      dexterity: 10,
      intelligence: 10,
      constitution: 10,
      wisdom: 10,
      charisma: 10
    };
    
    // Ajuster les statistiques en fonction de la classe
    switch (characterClass) {
      case 'warrior':
        baseStats.strength += 5;
        baseStats.constitution += 3;
        break;
      case 'mage':
        baseStats.intelligence += 5;
        baseStats.wisdom += 3;
        break;
      case 'rogue':
        baseStats.dexterity += 5;
        baseStats.charisma += 3;
        break;
      case 'cleric':
        baseStats.wisdom += 5;
        baseStats.constitution += 3;
        break;
      default:
        break;
    }
    
    // Calculer les points de vie et de mana en fonction des statistiques
    const maxHp = 50 + (baseStats.constitution * 5);
    const maxMp = 30 + (baseStats.intelligence * 3);
    
    const character = new Character({
      userId: req.userId,
      name,
      race,
      class: characterClass,
      level: 1,
      experience: 0,
      gold: 100,
      stats: baseStats,
      currentHp: maxHp,
      maxHp,
      currentMp: maxMp,
      maxMp,
      statPoints: 0,
      inventory: [],
      equipment: {
        head: null,
        chest: null,
        legs: null,
        feet: null,
        hands: null,
        mainHand: null,
        offHand: null,
        necklace: null,
        ring1: null,
        ring2: null
      },
      appearance: appearance || {
        hairStyle: 1,
        hairColor: '#8B4513',
        skinColor: '#F5DEB3',
        eyeColor: '#8B4513',
        faceStyle: 1
      },
      position: {
        zone: 'starting_village',
        x: 50,
        y: 50
      },
      createdAt: new Date()
    });
    
    await character.save();
    
    return res.status(201).json(character);
  } catch (error) {
    console.error('Erreur lors de la création du personnage:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la création du personnage' });
  }
};

/**
 * Récupère tous les personnages de l'utilisateur connecté
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const getCharacters = async (req, res) => {
  try {
    const characters = await Character.find({ userId: req.userId });
    return res.status(200).json(characters);
  } catch (error) {
    console.error('Erreur lors de la récupération des personnages:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la récupération des personnages' });
  }
};

/**
 * Récupère un personnage par son ID
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const getCharacterById = async (req, res) => {
  try {
    const character = await Character.findById(req.params.id);
    
    if (!character) {
      return res.status(404).json({ message: 'Personnage non trouvé' });
    }
    
    // Vérifier si le personnage appartient à l'utilisateur connecté
    if (character.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Accès non autorisé à ce personnage' });
    }
    
    return res.status(200).json(character);
  } catch (error) {
    console.error('Erreur lors de la récupération du personnage:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la récupération du personnage' });
  }
};

/**
 * Met à jour un personnage
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const updateCharacter = async (req, res) => {
  try {
    const { name } = req.body;
    
    const character = await Character.findById(req.params.id);
    
    if (!character) {
      return res.status(404).json({ message: 'Personnage non trouvé' });
    }
    
    // Vérifier si le personnage appartient à l'utilisateur connecté
    if (character.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Accès non autorisé à ce personnage' });
    }
    
    // Seul le nom peut être modifié après la création
    if (name) {
      character.name = name;
    }
    
    await character.save();
    
    return res.status(200).json(character);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du personnage:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du personnage' });
  }
};

/**
 * Supprime un personnage
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const deleteCharacter = async (req, res) => {
  try {
    const character = await Character.findById(req.params.id);
    
    if (!character) {
      return res.status(404).json({ message: 'Personnage non trouvé' });
    }
    
    // Vérifier si le personnage appartient à l'utilisateur connecté
    if (character.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Accès non autorisé à ce personnage' });
    }
    
    await Character.findByIdAndDelete(req.params.id);
    
    return res.status(200).json({ message: 'Personnage supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du personnage:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la suppression du personnage' });
  }
};

/**
 * Assigne un point de statistique
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const assignStatPoint = async (req, res) => {
  try {
    const { stat } = req.body;
    
    if (!['strength', 'dexterity', 'intelligence', 'constitution', 'wisdom', 'charisma'].includes(stat)) {
      return res.status(400).json({ message: 'Statistique invalide' });
    }
    
    const character = await Character.findById(req.params.id);
    
    if (!character) {
      return res.status(404).json({ message: 'Personnage non trouvé' });
    }
    
    // Vérifier si le personnage appartient à l'utilisateur connecté
    if (character.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Accès non autorisé à ce personnage' });
    }
    
    // Vérifier si le personnage a des points de statistique disponibles
    if (character.statPoints <= 0) {
      return res.status(400).json({ message: 'Pas de points de statistique disponibles' });
    }
    
    // Assigner le point de statistique
    character.stats[stat] += 1;
    character.statPoints -= 1;
    
    // Mettre à jour les points de vie et de mana si nécessaire
    if (stat === 'constitution') {
      character.maxHp += 5;
      character.currentHp += 5;
    }
    
    if (stat === 'intelligence') {
      character.maxMp += 3;
      character.currentMp += 3;
    }
    
    await character.save();
    
    return res.status(200).json(character);
  } catch (error) {
    console.error('Erreur lors de l\'assignation du point de statistique:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de l\'assignation du point de statistique' });
  }
};

/**
 * Met à jour l'apparence d'un personnage
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const updateAppearance = async (req, res) => {
  try {
    const { hairStyle, hairColor, skinColor, eyeColor, faceStyle } = req.body;
    
    const character = await Character.findById(req.params.id);
    
    if (!character) {
      return res.status(404).json({ message: 'Personnage non trouvé' });
    }
    
    // Vérifier si le personnage appartient à l'utilisateur connecté
    if (character.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Accès non autorisé à ce personnage' });
    }
    
    // Mettre à jour l'apparence
    if (hairStyle) character.appearance.hairStyle = hairStyle;
    if (hairColor) character.appearance.hairColor = hairColor;
    if (skinColor) character.appearance.skinColor = skinColor;
    if (eyeColor) character.appearance.eyeColor = eyeColor;
    if (faceStyle) character.appearance.faceStyle = faceStyle;
    
    await character.save();
    
    return res.status(200).json(character);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'apparence:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la mise à jour de l\'apparence' });
  }
};

/**
 * Équipe un objet
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const equipItem = async (req, res) => {
  try {
    const { itemId } = req.body;
    
    const character = await Character.findById(req.params.id);
    
    if (!character) {
      return res.status(404).json({ message: 'Personnage non trouvé' });
    }
    
    // Vérifier si le personnage appartient à l'utilisateur connecté
    if (character.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Accès non autorisé à ce personnage' });
    }
    
    // Vérifier si l'objet est dans l'inventaire
    const inventoryIndex = character.inventory.findIndex(item => item.toString() === itemId);
    if (inventoryIndex === -1) {
      return res.status(400).json({ message: 'Objet non trouvé dans l\'inventaire' });
    }
    
    // Récupérer l'objet
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Objet non trouvé' });
    }
    
    // Vérifier si le personnage peut équiper cet objet (niveau, classe, etc.)
    if (item.requiredLevel > character.level) {
      return res.status(400).json({ message: `Niveau ${item.requiredLevel} requis pour équiper cet objet` });
    }
    
    if (item.requiredClass && item.requiredClass !== character.class) {
      return res.status(400).json({ message: `Classe ${item.requiredClass} requise pour équiper cet objet` });
    }
    
    // Déterminer l'emplacement d'équipement
    let slot;
    switch (item.type) {
      case 'weapon':
        slot = 'mainHand';
        break;
      case 'shield':
        slot = 'offHand';
        break;
      case 'helmet':
        slot = 'head';
        break;
      case 'armor':
        slot = 'chest';
        break;
      case 'leggings':
        slot = 'legs';
        break;
      case 'boots':
        slot = 'feet';
        break;
      case 'gloves':
        slot = 'hands';
        break;
      case 'necklace':
        slot = 'necklace';
        break;
      case 'ring':
        // Vérifier quel emplacement de bague est disponible
        if (!character.equipment.ring1) {
          slot = 'ring1';
        } else if (!character.equipment.ring2) {
          slot = 'ring2';
        } else {
          // Si les deux emplacements sont occupés, remplacer le premier
          slot = 'ring1';
        }
        break;
      default:
        return res.status(400).json({ message: 'Type d\'objet non équipable' });
    }
    
    // Si un objet est déjà équipé à cet emplacement, le remettre dans l'inventaire
    if (character.equipment[slot]) {
      character.inventory.push(character.equipment[slot]);
    }
    
    // Équiper le nouvel objet
    character.equipment[slot] = itemId;
    
    // Retirer l'objet de l'inventaire
    character.inventory.splice(inventoryIndex, 1);
    
    await character.save();
    
    return res.status(200).json(character);
  } catch (error) {
    console.error('Erreur lors de l\'équipement de l\'objet:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de l\'équipement de l\'objet' });
  }
};

/**
 * Déséquipe un objet
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const unequipItem = async (req, res) => {
  try {
    const { slot } = req.body;
    
    if (!['head', 'chest', 'legs', 'feet', 'hands', 'mainHand', 'offHand', 'necklace', 'ring1', 'ring2'].includes(slot)) {
      return res.status(400).json({ message: 'Emplacement d\'équipement invalide' });
    }
    
    const character = await Character.findById(req.params.id);
    
    if (!character) {
      return res.status(404).json({ message: 'Personnage non trouvé' });
    }
    
    // Vérifier si le personnage appartient à l'utilisateur connecté
    if (character.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Accès non autorisé à ce personnage' });
    }
    
    // Vérifier si un objet est équipé à cet emplacement
    if (!character.equipment[slot]) {
      return res.status(400).json({ message: 'Aucun objet équipé à cet emplacement' });
    }
    
    // Ajouter l'objet à l'inventaire
    character.inventory.push(character.equipment[slot]);
    
    // Déséquiper l'objet
    character.equipment[slot] = null;
    
    await character.save();
    
    return res.status(200).json(character);
  } catch (error) {
    console.error('Erreur lors du déséquipement de l\'objet:', error);
    return res.status(500).json({ message: 'Erreur serveur lors du déséquipement de l\'objet' });
  }
};

export default {
  createCharacter,
  getCharacters,
  getCharacterById,
  updateCharacter,
  deleteCharacter,
  assignStatPoint,
  updateAppearance,
  equipItem,
  unequipItem
};

