import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
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
    enum: ['attack', 'heal', 'buff', 'debuff', 'utility']
  },
  targetType: {
    type: String,
    required: true,
    enum: ['self', 'single', 'aoe', 'all']
  },
  manaCost: {
    type: Number,
    required: true,
    min: 0
  },
  cooldown: {
    type: Number,
    default: 0,
    min: 0
  },
  requiredLevel: {
    type: Number,
    required: true,
    min: 1
  },
  requiredClass: {
    type: String,
    enum: ['warrior', 'mage', 'rogue', 'cleric', 'any'],
    default: 'any'
  },
  damage: {
    base: {
      type: Number,
      default: 0
    },
    scaling: {
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
      }
    }
  },
  healing: {
    base: {
      type: Number,
      default: 0
    },
    scaling: {
      intelligence: {
        type: Number,
        default: 0
      },
      vitality: {
        type: Number,
        default: 0
      }
    }
  },
  effects: [{
    type: {
      type: String,
      enum: ['stun', 'poison', 'burn', 'freeze', 'bleed', 'strength_buff', 'dexterity_buff', 'intelligence_buff', 'vitality_buff', 'luck_buff', 'strength_debuff', 'dexterity_debuff', 'intelligence_debuff', 'vitality_debuff', 'luck_debuff']
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
  iconId: {
    type: String,
    default: 'default_skill'
  },
  animation: {
    type: String,
    default: 'default_animation'
  },
  sound: {
    type: String,
    default: 'default_sound'
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

// Méthode pour calculer les dégâts
skillSchema.methods.calculateDamage = function(character) {
  let damage = this.damage.base;
  
  // Ajouter les bonus de statistiques
  damage += character.stats.strength * this.damage.scaling.strength;
  damage += character.stats.dexterity * this.damage.scaling.dexterity;
  damage += character.stats.intelligence * this.damage.scaling.intelligence;
  
  return Math.floor(damage);
};

// Méthode pour calculer les soins
skillSchema.methods.calculateHealing = function(character) {
  let healing = this.healing.base;
  
  // Ajouter les bonus de statistiques
  healing += character.stats.intelligence * this.healing.scaling.intelligence;
  healing += character.stats.vitality * this.healing.scaling.vitality;
  
  return Math.floor(healing);
};

// Méthode pour vérifier si la compétence peut être utilisée
skillSchema.methods.canUse = function(character, currentCooldown) {
  // Vérifier le niveau requis
  if (character.level < this.requiredLevel) {
    return { canUse: false, reason: 'Niveau insuffisant.' };
  }
  
  // Vérifier le coût en mana
  if (character.currentMana < this.manaCost) {
    return { canUse: false, reason: 'Mana insuffisant.' };
  }
  
  // Vérifier le cooldown
  if (currentCooldown > 0) {
    return { canUse: false, reason: `Compétence en recharge (${currentCooldown} tours restants).` };
  }
  
  return { canUse: true };
};

const Skill = mongoose.model('Skill', skillSchema);

export default Skill;

