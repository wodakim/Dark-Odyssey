import mongoose from 'mongoose';

const monsterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    required: true,
    min: 1
  },
  type: {
    type: String,
    required: true,
    enum: ['beast', 'humanoid', 'undead', 'elemental', 'demon', 'construct', 'dragon', 'plant', 'aberration']
  },
  rarity: {
    type: String,
    required: true,
    enum: ['common', 'rare', 'epic', 'legendary', 'mythic'],
    default: 'common'
  },
  stats: {
    health: {
      type: Number,
      required: true,
      min: 1
    },
    attack: {
      type: Number,
      required: true,
      min: 1
    },
    defense: {
      type: Number,
      required: true,
      min: 0
    },
    speed: {
      type: Number,
      required: true,
      min: 1
    },
    critRate: {
      type: Number,
      default: 5,
      min: 0,
      max: 100
    },
    critDamage: {
      type: Number,
      default: 150,
      min: 100
    }
  },
  abilities: [{
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    damage: {
      type: Number,
      default: 0
    },
    effects: [{
      type: {
        type: String,
        enum: ['stun', 'poison', 'burn', 'freeze', 'bleed', 'heal', 'buff', 'debuff']
      },
      value: {
        type: Number,
        default: 0
      },
      duration: {
        type: Number,
        default: 1
      },
      chance: {
        type: Number,
        default: 100,
        min: 0,
        max: 100
      }
    }],
    cooldown: {
      type: Number,
      default: 0,
      min: 0
    },
    useRate: {
      type: Number,
      default: 50,
      min: 0,
      max: 100
    }
  }],
  lootTable: [{
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true
    },
    chance: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    minQuantity: {
      type: Number,
      default: 1,
      min: 1
    },
    maxQuantity: {
      type: Number,
      default: 1,
      min: 1
    }
  }],
  experience: {
    type: Number,
    required: true,
    min: 1
  },
  gold: {
    type: Number,
    required: true,
    min: 0
  },
  spriteId: {
    type: String,
    default: 'default_monster'
  },
  isBoss: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Méthode pour générer le butin
monsterSchema.methods.generateLoot = function() {
  const loot = [];
  
  // Parcourir la table de butin
  this.lootTable.forEach(lootItem => {
    // Vérifier si l'objet est obtenu en fonction de sa chance
    if (Math.random() * 100 <= lootItem.chance) {
      // Déterminer la quantité
      const quantity = Math.floor(
        Math.random() * (lootItem.maxQuantity - lootItem.minQuantity + 1) + lootItem.minQuantity
      );
      
      // Ajouter l'objet au butin
      loot.push({
        itemId: lootItem.itemId,
        quantity
      });
    }
  });
  
  return loot;
};

// Méthode pour choisir une capacité à utiliser
monsterSchema.methods.chooseAbility = function() {
  // Si le monstre n'a pas de capacités, retourner null
  if (this.abilities.length === 0) {
    return null;
  }
  
  // Filtrer les capacités disponibles (pas en cooldown)
  const availableAbilities = this.abilities.filter(ability => ability.cooldown === 0);
  
  // Si aucune capacité n'est disponible, retourner null
  if (availableAbilities.length === 0) {
    return null;
  }
  
  // Calculer la somme totale des taux d'utilisation
  const totalUseRate = availableAbilities.reduce((sum, ability) => sum + ability.useRate, 0);
  
  // Générer un nombre aléatoire entre 0 et la somme totale
  const random = Math.random() * totalUseRate;
  
  // Trouver la capacité correspondante
  let cumulativeUseRate = 0;
  for (const ability of availableAbilities) {
    cumulativeUseRate += ability.useRate;
    if (random <= cumulativeUseRate) {
      return ability;
    }
  }
  
  // Si aucune capacité n'est choisie, retourner la première disponible
  return availableAbilities[0];
};

const Monster = mongoose.model('Monster', monsterSchema);

export default Monster;

