import Character from '../models/character.model.js';
import Monster from '../models/monster.model.js';
import Item from '../models/item.model.js';
import Skill from '../models/skill.model.js';

// Stockage temporaire des combats en cours (à remplacer par une base de données en production)
const activeCombats = new Map();

/**
 * Démarre un combat avec un monstre
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const startCombat = async (req, res) => {
  try {
    const { characterId, monsterId, zoneId } = req.body;
    
    // Vérifier si le personnage existe et appartient à l'utilisateur
    const character = await Character.findById(characterId);
    if (!character) {
      return res.status(404).json({ message: 'Personnage non trouvé' });
    }
    
    if (character.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Accès non autorisé à ce personnage' });
    }
    
    // Vérifier si le personnage est déjà en combat
    if (activeCombats.has(characterId)) {
      return res.status(400).json({ message: 'Ce personnage est déjà en combat' });
    }
    
    // Récupérer le monstre
    let monster;
    if (monsterId) {
      monster = await Monster.findById(monsterId);
      if (!monster) {
        return res.status(404).json({ message: 'Monstre non trouvé' });
      }
    } else if (zoneId) {
      // Générer un monstre aléatoire pour la zone
      const monsters = await Monster.find({ zones: zoneId });
      if (monsters.length === 0) {
        return res.status(404).json({ message: 'Aucun monstre trouvé dans cette zone' });
      }
      
      // Sélectionner un monstre aléatoire
      monster = monsters[Math.floor(Math.random() * monsters.length)];
    } else {
      return res.status(400).json({ message: 'Veuillez spécifier un monstre ou une zone' });
    }
    
    // Créer une instance de combat
    const combat = {
      id: Date.now().toString(),
      characterId,
      character: {
        id: character._id,
        name: character.name,
        level: character.level,
        currentHp: character.currentHp,
        maxHp: character.maxHp,
        currentMp: character.currentMp,
        maxMp: character.maxMp,
        stats: character.stats,
        equipment: character.equipment
      },
      monster: {
        id: monster._id,
        name: monster.name,
        level: monster.level,
        currentHp: monster.hp,
        maxHp: monster.hp,
        stats: monster.stats,
        attacks: monster.attacks,
        imageUrl: monster.imageUrl
      },
      turn: 1,
      logs: [`Combat démarré entre ${character.name} et ${monster.name}`],
      status: 'active',
      startTime: new Date(),
      lastAction: new Date()
    };
    
    // Stocker le combat
    activeCombats.set(characterId, combat);
    
    return res.status(200).json(combat);
  } catch (error) {
    console.error('Erreur lors du démarrage du combat:', error);
    return res.status(500).json({ message: 'Erreur serveur lors du démarrage du combat' });
  }
};

/**
 * Effectue une attaque de base
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const attack = async (req, res) => {
  try {
    const { characterId } = req.body;
    
    // Vérifier si le combat existe
    if (!activeCombats.has(characterId)) {
      return res.status(404).json({ message: 'Combat non trouvé' });
    }
    
    const combat = activeCombats.get(characterId);
    
    // Vérifier si le personnage appartient à l'utilisateur
    const character = await Character.findById(characterId);
    if (character.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Accès non autorisé à ce combat' });
    }
    
    // Vérifier si le combat est toujours actif
    if (combat.status !== 'active') {
      return res.status(400).json({ message: `Ce combat est déjà terminé (${combat.status})` });
    }
    
    // Calculer les dégâts du joueur
    const playerDamage = calculateDamage(combat.character);
    combat.monster.currentHp = Math.max(0, combat.monster.currentHp - playerDamage);
    combat.logs.push(`${combat.character.name} inflige ${playerDamage} points de dégâts à ${combat.monster.name}`);
    
    // Vérifier si le monstre est vaincu
    if (combat.monster.currentHp <= 0) {
      return endCombat(combat, 'victory', res);
    }
    
    // Attaque du monstre
    const monsterDamage = calculateMonsterDamage(combat.monster);
    combat.character.currentHp = Math.max(0, combat.character.currentHp - monsterDamage);
    combat.logs.push(`${combat.monster.name} inflige ${monsterDamage} points de dégâts à ${combat.character.name}`);
    
    // Vérifier si le personnage est vaincu
    if (combat.character.currentHp <= 0) {
      return endCombat(combat, 'defeat', res);
    }
    
    // Incrémenter le tour
    combat.turn += 1;
    combat.lastAction = new Date();
    
    // Mettre à jour le combat
    activeCombats.set(characterId, combat);
    
    return res.status(200).json(combat);
  } catch (error) {
    console.error('Erreur lors de l\'attaque:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de l\'attaque' });
  }
};

/**
 * Utilise une compétence en combat
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const useSkill = async (req, res) => {
  try {
    const { characterId } = req.body;
    const { skillId } = req.params;
    
    // Vérifier si le combat existe
    if (!activeCombats.has(characterId)) {
      return res.status(404).json({ message: 'Combat non trouvé' });
    }
    
    const combat = activeCombats.get(characterId);
    
    // Vérifier si le personnage appartient à l'utilisateur
    const character = await Character.findById(characterId);
    if (character.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Accès non autorisé à ce combat' });
    }
    
    // Vérifier si le combat est toujours actif
    if (combat.status !== 'active') {
      return res.status(400).json({ message: `Ce combat est déjà terminé (${combat.status})` });
    }
    
    // Récupérer la compétence
    const skill = await Skill.findById(skillId);
    if (!skill) {
      return res.status(404).json({ message: 'Compétence non trouvée' });
    }
    
    // Vérifier si le personnage a assez de mana
    if (combat.character.currentMp < skill.manaCost) {
      return res.status(400).json({ message: 'Pas assez de mana pour utiliser cette compétence' });
    }
    
    // Utiliser la compétence
    combat.character.currentMp -= skill.manaCost;
    
    // Calculer les dégâts ou les effets de la compétence
    let effect = '';
    switch (skill.type) {
      case 'damage':
        const damage = calculateSkillDamage(combat.character, skill);
        combat.monster.currentHp = Math.max(0, combat.monster.currentHp - damage);
        effect = `inflige ${damage} points de dégâts à ${combat.monster.name}`;
        break;
      case 'heal':
        const healing = calculateSkillHealing(combat.character, skill);
        combat.character.currentHp = Math.min(combat.character.maxHp, combat.character.currentHp + healing);
        effect = `récupère ${healing} points de vie`;
        break;
      case 'buff':
        effect = `s'applique un buff de ${skill.name}`;
        // Logique de buff à implémenter
        break;
      case 'debuff':
        effect = `applique un debuff de ${skill.name} à ${combat.monster.name}`;
        // Logique de debuff à implémenter
        break;
    }
    
    combat.logs.push(`${combat.character.name} utilise ${skill.name} et ${effect}`);
    
    // Vérifier si le monstre est vaincu
    if (combat.monster.currentHp <= 0) {
      return endCombat(combat, 'victory', res);
    }
    
    // Attaque du monstre
    const monsterDamage = calculateMonsterDamage(combat.monster);
    combat.character.currentHp = Math.max(0, combat.character.currentHp - monsterDamage);
    combat.logs.push(`${combat.monster.name} inflige ${monsterDamage} points de dégâts à ${combat.character.name}`);
    
    // Vérifier si le personnage est vaincu
    if (combat.character.currentHp <= 0) {
      return endCombat(combat, 'defeat', res);
    }
    
    // Incrémenter le tour
    combat.turn += 1;
    combat.lastAction = new Date();
    
    // Mettre à jour le combat
    activeCombats.set(characterId, combat);
    
    return res.status(200).json(combat);
  } catch (error) {
    console.error('Erreur lors de l\'utilisation de la compétence:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de l\'utilisation de la compétence' });
  }
};

/**
 * Utilise un objet en combat
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const useItemInCombat = async (req, res) => {
  try {
    const { characterId } = req.body;
    const { itemId } = req.params;
    
    // Vérifier si le combat existe
    if (!activeCombats.has(characterId)) {
      return res.status(404).json({ message: 'Combat non trouvé' });
    }
    
    const combat = activeCombats.get(characterId);
    
    // Vérifier si le personnage appartient à l'utilisateur
    const character = await Character.findById(characterId);
    if (character.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Accès non autorisé à ce combat' });
    }
    
    // Vérifier si le combat est toujours actif
    if (combat.status !== 'active') {
      return res.status(400).json({ message: `Ce combat est déjà terminé (${combat.status})` });
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
    
    // Vérifier si l'objet est utilisable en combat
    if (item.type !== 'consumable') {
      return res.status(400).json({ message: 'Cet objet n\'est pas utilisable en combat' });
    }
    
    // Utiliser l'objet
    let effect = '';
    switch (item.effect.type) {
      case 'heal':
        const healing = item.effect.value;
        combat.character.currentHp = Math.min(combat.character.maxHp, combat.character.currentHp + healing);
        effect = `récupère ${healing} points de vie`;
        break;
      case 'mana':
        const mana = item.effect.value;
        combat.character.currentMp = Math.min(combat.character.maxMp, combat.character.currentMp + mana);
        effect = `récupère ${mana} points de mana`;
        break;
      case 'damage':
        const damage = item.effect.value;
        combat.monster.currentHp = Math.max(0, combat.monster.currentHp - damage);
        effect = `inflige ${damage} points de dégâts à ${combat.monster.name}`;
        break;
      case 'buff':
        effect = `s'applique un buff de ${item.name}`;
        // Logique de buff à implémenter
        break;
    }
    
    combat.logs.push(`${combat.character.name} utilise ${item.name} et ${effect}`);
    
    // Retirer l'objet de l'inventaire
    character.inventory.splice(inventoryIndex, 1);
    await character.save();
    
    // Vérifier si le monstre est vaincu
    if (combat.monster.currentHp <= 0) {
      return endCombat(combat, 'victory', res);
    }
    
    // Attaque du monstre
    const monsterDamage = calculateMonsterDamage(combat.monster);
    combat.character.currentHp = Math.max(0, combat.character.currentHp - monsterDamage);
    combat.logs.push(`${combat.monster.name} inflige ${monsterDamage} points de dégâts à ${combat.character.name}`);
    
    // Vérifier si le personnage est vaincu
    if (combat.character.currentHp <= 0) {
      return endCombat(combat, 'defeat', res);
    }
    
    // Incrémenter le tour
    combat.turn += 1;
    combat.lastAction = new Date();
    
    // Mettre à jour le combat
    activeCombats.set(characterId, combat);
    
    return res.status(200).json(combat);
  } catch (error) {
    console.error('Erreur lors de l\'utilisation de l\'objet:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de l\'utilisation de l\'objet' });
  }
};

/**
 * Fuit un combat
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const flee = async (req, res) => {
  try {
    const { characterId } = req.body;
    
    // Vérifier si le combat existe
    if (!activeCombats.has(characterId)) {
      return res.status(404).json({ message: 'Combat non trouvé' });
    }
    
    const combat = activeCombats.get(characterId);
    
    // Vérifier si le personnage appartient à l'utilisateur
    const character = await Character.findById(characterId);
    if (character.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Accès non autorisé à ce combat' });
    }
    
    // Vérifier si le combat est toujours actif
    if (combat.status !== 'active') {
      return res.status(400).json({ message: `Ce combat est déjà terminé (${combat.status})` });
    }
    
    // Calculer les chances de fuite (basées sur la dextérité du personnage et le niveau du monstre)
    const fleeChance = 0.3 + (combat.character.stats.dexterity / 100) - (combat.monster.level / 100);
    const fleeRoll = Math.random();
    
    if (fleeRoll <= fleeChance) {
      // Fuite réussie
      combat.logs.push(`${combat.character.name} a réussi à fuir le combat`);
      return endCombat(combat, 'fled', res);
    } else {
      // Fuite échouée
      combat.logs.push(`${combat.character.name} a échoué à fuir le combat`);
      
      // Attaque du monstre
      const monsterDamage = calculateMonsterDamage(combat.monster);
      combat.character.currentHp = Math.max(0, combat.character.currentHp - monsterDamage);
      combat.logs.push(`${combat.monster.name} inflige ${monsterDamage} points de dégâts à ${combat.character.name}`);
      
      // Vérifier si le personnage est vaincu
      if (combat.character.currentHp <= 0) {
        return endCombat(combat, 'defeat', res);
      }
      
      // Incrémenter le tour
      combat.turn += 1;
      combat.lastAction = new Date();
      
      // Mettre à jour le combat
      activeCombats.set(characterId, combat);
      
      return res.status(200).json(combat);
    }
  } catch (error) {
    console.error('Erreur lors de la fuite:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la fuite' });
  }
};

/**
 * Récupère le statut du combat en cours
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
export const getCombatStatus = async (req, res) => {
  try {
    const { characterId } = req.query;
    
    // Vérifier si le combat existe
    if (!activeCombats.has(characterId)) {
      return res.status(404).json({ message: 'Combat non trouvé' });
    }
    
    const combat = activeCombats.get(characterId);
    
    // Vérifier si le personnage appartient à l'utilisateur
    const character = await Character.findById(characterId);
    if (character.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Accès non autorisé à ce combat' });
    }
    
    return res.status(200).json(combat);
  } catch (error) {
    console.error('Erreur lors de la récupération du statut du combat:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la récupération du statut du combat' });
  }
};

/**
 * Termine un combat
 * @param {Object} combat - Objet de combat
 * @param {string} result - Résultat du combat ('victory', 'defeat', 'fled')
 * @param {Object} res - Réponse Express
 */
const endCombat = async (combat, result, res) => {
  try {
    combat.status = result;
    combat.endTime = new Date();
    
    // Récupérer le personnage
    const character = await Character.findById(combat.characterId);
    
    // Mettre à jour le personnage en fonction du résultat
    switch (result) {
      case 'victory':
        combat.logs.push(`${combat.character.name} a vaincu ${combat.monster.name}`);
        
        // Calculer l'expérience gagnée
        const expGained = calculateExperience(combat.monster);
        character.experience += expGained;
        combat.logs.push(`${combat.character.name} gagne ${expGained} points d'expérience`);
        
        // Calculer l'or gagné
        const goldGained = calculateGold(combat.monster);
        character.gold += goldGained;
        combat.logs.push(`${combat.character.name} gagne ${goldGained} pièces d'or`);
        
        // Vérifier si le personnage monte de niveau
        const levelUp = checkLevelUp(character);
        if (levelUp) {
          combat.logs.push(`${combat.character.name} passe au niveau ${character.level}`);
        }
        
        // Générer un butin aléatoire
        const loot = await generateLoot(combat.monster);
        if (loot) {
          character.inventory.push(loot._id);
          combat.logs.push(`${combat.character.name} trouve ${loot.name}`);
          combat.loot = loot;
        }
        
        break;
      case 'defeat':
        combat.logs.push(`${combat.character.name} a été vaincu par ${combat.monster.name}`);
        
        // Pénalité de défaite
        const goldLost = Math.floor(character.gold * 0.1);
        character.gold = Math.max(0, character.gold - goldLost);
        combat.logs.push(`${combat.character.name} perd ${goldLost} pièces d'or`);
        
        // Restaurer une partie des points de vie
        character.currentHp = Math.floor(character.maxHp * 0.3);
        
        break;
      case 'fled':
        // Pas de pénalité pour la fuite
        break;
    }
    
    // Mettre à jour les points de vie et de mana du personnage
    character.currentHp = combat.character.currentHp;
    character.currentMp = combat.character.currentMp;
    
    await character.save();
    
    // Supprimer le combat de la liste des combats actifs
    activeCombats.delete(combat.characterId);
    
    return res.status(200).json(combat);
  } catch (error) {
    console.error('Erreur lors de la fin du combat:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la fin du combat' });
  }
};

/**
 * Calcule les dégâts infligés par un personnage
 * @param {Object} character - Personnage
 * @returns {number} Dégâts infligés
 */
const calculateDamage = (character) => {
  // Formule de base: force + bonus d'arme + modificateur aléatoire
  const baseDamage = character.stats.strength;
  const weaponBonus = 0; // À implémenter avec les équipements
  const randomFactor = 0.8 + Math.random() * 0.4; // Entre 0.8 et 1.2
  
  return Math.floor((baseDamage + weaponBonus) * randomFactor);
};

/**
 * Calcule les dégâts infligés par un monstre
 * @param {Object} monster - Monstre
 * @returns {number} Dégâts infligés
 */
const calculateMonsterDamage = (monster) => {
  // Formule de base: attaque du monstre + modificateur aléatoire
  const baseAttack = monster.stats.attack || 5;
  const randomFactor = 0.8 + Math.random() * 0.4; // Entre 0.8 et 1.2
  
  return Math.floor(baseAttack * randomFactor);
};

/**
 * Calcule les dégâts infligés par une compétence
 * @param {Object} character - Personnage
 * @param {Object} skill - Compétence
 * @returns {number} Dégâts infligés
 */
const calculateSkillDamage = (character, skill) => {
  // Formule de base: dégâts de base de la compétence + bonus de statistique + modificateur aléatoire
  const baseDamage = skill.baseDamage || 10;
  let statBonus = 0;
  
  switch (skill.scalingStat) {
    case 'strength':
      statBonus = character.stats.strength;
      break;
    case 'intelligence':
      statBonus = character.stats.intelligence;
      break;
    case 'dexterity':
      statBonus = character.stats.dexterity;
      break;
    default:
      statBonus = 0;
  }
  
  const randomFactor = 0.9 + Math.random() * 0.2; // Entre 0.9 et 1.1
  
  return Math.floor((baseDamage + statBonus * skill.scalingFactor) * randomFactor);
};

/**
 * Calcule les soins prodigués par une compétence
 * @param {Object} character - Personnage
 * @param {Object} skill - Compétence
 * @returns {number} Soins prodigués
 */
const calculateSkillHealing = (character, skill) => {
  // Formule de base: soins de base de la compétence + bonus de sagesse + modificateur aléatoire
  const baseHealing = skill.baseHealing || 10;
  const wisdomBonus = character.stats.wisdom;
  const randomFactor = 0.9 + Math.random() * 0.2; // Entre 0.9 et 1.1
  
  return Math.floor((baseHealing + wisdomBonus * skill.scalingFactor) * randomFactor);
};

/**
 * Calcule l'expérience gagnée en fonction du monstre
 * @param {Object} monster - Monstre
 * @returns {number} Expérience gagnée
 */
const calculateExperience = (monster) => {
  return monster.level * 10;
};

/**
 * Calcule l'or gagné en fonction du monstre
 * @param {Object} monster - Monstre
 * @returns {number} Or gagné
 */
const calculateGold = (monster) => {
  const baseGold = monster.level * 5;
  const randomFactor = 0.8 + Math.random() * 0.4; // Entre 0.8 et 1.2
  
  return Math.floor(baseGold * randomFactor);
};

/**
 * Vérifie si le personnage monte de niveau
 * @param {Object} character - Personnage
 * @returns {boolean} True si le personnage monte de niveau
 */
const checkLevelUp = (character) => {
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
    
    return true;
  }
  
  return false;
};

/**
 * Calcule l'expérience requise pour le niveau suivant
 * @param {number} level - Niveau actuel
 * @returns {number} Expérience requise
 */
const calculateRequiredExp = (level) => {
  return 100 * Math.pow(1.5, level - 1);
};

/**
 * Génère un butin aléatoire en fonction du monstre
 * @param {Object} monster - Monstre
 * @returns {Object|null} Objet généré ou null
 */
const generateLoot = async (monster) => {
  // Chance de drop (en pourcentage)
  const dropChance = 30 + monster.level * 2;
  
  if (Math.random() * 100 <= dropChance) {
    // Déterminer la rareté de l'objet
    let rarity;
    const rarityRoll = Math.random() * 100;
    
    if (rarityRoll <= 1) {
      rarity = 'legendary';
    } else if (rarityRoll <= 5) {
      rarity = 'epic';
    } else if (rarityRoll <= 20) {
      rarity = 'rare';
    } else if (rarityRoll <= 50) {
      rarity = 'uncommon';
    } else {
      rarity = 'common';
    }
    
    // Récupérer un objet aléatoire de cette rareté
    const items = await Item.find({ rarity });
    
    if (items.length > 0) {
      return items[Math.floor(Math.random() * items.length)];
    }
  }
  
  return null;
};

export default {
  startCombat,
  attack,
  useSkill,
  useItemInCombat,
  flee,
  getCombatStatus
};

