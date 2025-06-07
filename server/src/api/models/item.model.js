import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['weapon', 'armor', 'accessory', 'consumable', 'material', 'quest', 'junk']
  },
  subtype: {
    type: String,
    required: function() {
      return this.type === 'weapon' || this.type === 'armor';
    },
    enum: [
      // Armes
      'sword', 'axe', 'mace', 'dagger', 'staff', 'wand', 'bow', 'crossbow',
      // Armures
      'helmet', 'chest', 'legs', 'boots', 'gloves', 'shield'
    ]
  },
  rarity: {
    type: String,
    required: true,
    enum: ['common', 'rare', 'epic', 'legendary', 'mythic'],
    default: 'common'
  },
  stats: {
    strength: {
      type: Number,
      default: 0
    },
    dexterity: {
      type: Number,
      default: 0
    },
    intelligence: {
      type: Number,
      default: 0
    },
    vitality: {
      type: Number,
      default: 0
    },
    luck: {
      type: Number,
      default: 0
    }
  },
  effects: [{
    type: String
  }],
  requiredLevel: {
    type: Number,
    default: 1,
    min: 1
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  stackable: {
    type: Boolean,
    default: function() {
      return this.type === 'consumable' || this.type === 'material' || this.type === 'junk';
    }
  },
  maxStack: {
    type: Number,
    default: 99
  },
  usable: {
    type: Boolean,
    default: function() {
      return this.type === 'consumable';
    }
  },
  equipable: {
    type: Boolean,
    default: function() {
      return this.type === 'weapon' || this.type === 'armor' || this.type === 'accessory';
    }
  },
  spriteId: {
    type: String,
    default: 'default'
  },
  dropRate: {
    type: Number,
    default: 1.0,
    min: 0,
    max: 100
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Méthode pour déterminer l'emplacement d'équipement
itemSchema.methods.getEquipmentSlot = function() {
  if (!this.equipable) {
    return null;
  }
  
  if (this.type === 'weapon') {
    return 'weapon';
  }
  
  if (this.type === 'accessory') {
    return 'accessory1'; // Par défaut, le premier emplacement d'accessoire
  }
  
  if (this.type === 'armor') {
    switch (this.subtype) {
      case 'helmet':
        return 'head';
      case 'chest':
        return 'chest';
      case 'legs':
        return 'legs';
      case 'boots':
        return 'feet';
      case 'shield':
        return 'offhand';
      default:
        return null;
    }
  }
  
  return null;
};

// Méthode pour utiliser un objet consommable
itemSchema.methods.use = function(character) {
  if (!this.usable) {
    return { success: false, message: 'Cet objet ne peut pas être utilisé.' };
  }
  
  // Logique d'utilisation en fonction des effets
  const results = {
    success: true,
    message: 'Objet utilisé avec succès.',
    effects: []
  };
  
  this.effects.forEach(effect => {
    if (effect.startsWith('Restaure')) {
      const match = effect.match(/Restaure (\d+) (PV|PM)/);
      if (match) {
        const amount = parseInt(match[1]);
        const type = match[2];
        
        if (type === 'PV') {
          const oldHealth = character.currentHealth;
          character.currentHealth = Math.min(character.maxHealth(), character.currentHealth + amount);
          const healedAmount = character.currentHealth - oldHealth;
          results.effects.push(`Restauré ${healedAmount} points de vie.`);
        } else if (type === 'PM') {
          const oldMana = character.currentMana;
          character.currentMana = Math.min(character.maxMana(), character.currentMana + amount);
          const restoredAmount = character.currentMana - oldMana;
          results.effects.push(`Restauré ${restoredAmount} points de mana.`);
        }
      }
    }
    // Ajouter d'autres effets ici
  });
  
  return results;
};

const Item = mongoose.model('Item', itemSchema);

export default Item;

