// Données de test pour le développement

// Personnage de test
export const testCharacter = {
  id: '1',
  name: 'Aventurier',
  level: 1,
  experience: 45,
  experienceToNextLevel: 100,
  gold: 100,
  currentHealth: 100,
  maxHealth: 100,
  currentMana: 50,
  maxMana: 50,
  race: 'Humain',
  stats: {
    strength: 10,
    dexterity: 8,
    intelligence: 12,
    vitality: 9,
    luck: 7
  },
  equipment: {
    weapon: {
      id: 'weapon1',
      name: 'Épée rouillée',
      description: 'Une vieille épée rouillée, mais toujours tranchante.',
      type: 'weapon',
      subtype: 'sword',
      rarity: 'rare',
      stats: {
        strength: 2,
        dexterity: 0,
        intelligence: 0,
        vitality: 0,
        luck: 0
      },
      requiredLevel: 1,
      value: 10
    }
  },
  skills: [
    {
      id: 'skill1',
      name: 'Frappe puissante',
      description: 'Une attaque puissante qui inflige des dégâts supplémentaires.',
      manaCost: 10,
      cooldown: 0,
      damage: 15,
      effects: []
    },
    {
      id: 'skill2',
      name: 'Coup tournoyant',
      description: 'Une attaque qui touche tous les ennemis à proximité.',
      manaCost: 20,
      cooldown: 2,
      damage: 10,
      effects: ['area']
    }
  ],
  appearance: {
    hairStyle: 1,
    hairColor: '#6D4C41',
    skinColor: '#E0AC69',
    faceStyle: 1
  },
  unassignedPoints: 3
};

// Inventaire de test
export const testInventory = [
  {
    id: 'weapon1',
    name: 'Épée rouillée',
    description: 'Une vieille épée rouillée, mais toujours tranchante.',
    type: 'weapon',
    subtype: 'sword',
    rarity: 'rare',
    stats: {
      strength: 2,
      dexterity: 0,
      intelligence: 0,
      vitality: 0,
      luck: 0
    },
    requiredLevel: 1,
    value: 10
  },
  {
    id: 'potion1',
    name: 'Potion de soin',
    description: 'Restaure 50 points de vie.',
    type: 'consumable',
    subtype: 'potion',
    rarity: 'common',
    effects: ['Restaure 50 PV'],
    requiredLevel: 1,
    value: 5,
    quantity: 3
  },
  {
    id: 'potion2',
    name: 'Potion de mana',
    description: 'Restaure 30 points de mana.',
    type: 'consumable',
    subtype: 'potion',
    rarity: 'common',
    effects: ['Restaure 30 PM'],
    requiredLevel: 1,
    value: 5,
    quantity: 2
  }
];

// Monstres de test
export const testMonsters = [
  {
    id: 'monster1',
    name: 'Gobelin',
    description: 'Un petit gobelin vicieux armé d\'un couteau rouillé.',
    level: 1,
    currentHealth: 30,
    maxHealth: 30,
    stats: {
      attack: 5,
      defense: 3,
      speed: 8
    },
    rarity: 'common',
    experience: 10,
    gold: 5,
    loot: [
      {
        id: 'junk1',
        name: 'Dent de gobelin',
        description: 'Une dent pointue de gobelin. Peu de valeur.',
        type: 'junk',
        rarity: 'common',
        value: 1,
        chance: 0.5
      }
    ]
  },
  {
    id: 'monster2',
    name: 'Loup sauvage',
    description: 'Un loup affamé aux crocs acérés.',
    level: 2,
    currentHealth: 40,
    maxHealth: 40,
    stats: {
      attack: 7,
      defense: 2,
      speed: 10
    },
    rarity: 'common',
    experience: 15,
    gold: 3,
    loot: [
      {
        id: 'material1',
        name: 'Fourrure de loup',
        description: 'Une fourrure épaisse et chaude.',
        type: 'material',
        rarity: 'common',
        value: 3,
        chance: 0.7
      }
    ]
  },
  {
    id: 'monster3',
    name: 'Bandit',
    description: 'Un bandit de grand chemin armé d\'une dague.',
    level: 3,
    currentHealth: 50,
    maxHealth: 50,
    stats: {
      attack: 8,
      defense: 5,
      speed: 7
    },
    rarity: 'common',
    experience: 20,
    gold: 15,
    loot: [
      {
        id: 'weapon2',
        name: 'Dague usée',
        description: 'Une dague simple mais efficace.',
        type: 'weapon',
        subtype: 'dagger',
        rarity: 'common',
        stats: {
          strength: 1,
          dexterity: 1
        },
        requiredLevel: 1,
        value: 8,
        chance: 0.3
      }
    ]
  },
  {
    id: 'monster4',
    name: 'Troll des forêts',
    description: 'Un troll massif à la peau verte et aux dents jaunes.',
    level: 5,
    currentHealth: 100,
    maxHealth: 100,
    stats: {
      attack: 12,
      defense: 8,
      speed: 4
    },
    rarity: 'rare',
    experience: 50,
    gold: 25,
    loot: [
      {
        id: 'armor1',
        name: 'Cuirasse en peau de troll',
        description: 'Une armure robuste faite de peau de troll.',
        type: 'armor',
        subtype: 'chest',
        rarity: 'rare',
        stats: {
          vitality: 3,
          strength: 1
        },
        requiredLevel: 5,
        value: 30,
        chance: 0.2
      }
    ]
  }
];

// Messages de test pour le chat
export const testMessages = [
  {
    sender: 'Système',
    content: 'Bienvenue dans Dark Odyssey!',
    channel: 'system',
    timestamp: Date.now() - 3600000
  },
  {
    sender: 'Aventurier',
    content: 'Bonjour tout le monde!',
    channel: 'global',
    timestamp: Date.now() - 1800000
  },
  {
    sender: 'Marchand',
    content: 'Vends potions de soin, 5 pièces d\'or chacune!',
    channel: 'trade',
    timestamp: Date.now() - 900000
  },
  {
    sender: 'Guide',
    content: 'N\'oubliez pas de visiter la Forêt des Murmures pour commencer votre aventure!',
    channel: 'global',
    timestamp: Date.now() - 300000
  }
];

