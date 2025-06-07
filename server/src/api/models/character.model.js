import mongoose from 'mongoose';

const characterSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 20
  },
  race: {
    type: String,
    required: true,
    enum: ['Humain', 'Elfe', 'Nain', 'Orc', 'Gobelin']
  },
  level: {
    type: Number,
    default: 1,
    min: 1
  },
  experience: {
    type: Number,
    default: 0,
    min: 0
  },
  gold: {
    type: Number,
    default: 100,
    min: 0
  },
  stats: {
    strength: {
      type: Number,
      default: 10,
      min: 1
    },
    dexterity: {
      type: Number,
      default: 10,
      min: 1
    },
    intelligence: {
      type: Number,
      default: 10,
      min: 1
    },
    vitality: {
      type: Number,
      default: 10,
      min: 1
    },
    luck: {
      type: Number,
      default: 10,
      min: 1
    }
  },
  currentHealth: {
    type: Number,
    default: function() {
      return this.stats.vitality * 10;
    }
  },
  currentMana: {
    type: Number,
    default: function() {
      return this.stats.intelligence * 5;
    }
  },
  equipment: {
    head: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      default: null
    },
    chest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      default: null
    },
    legs: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      default: null
    },
    feet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      default: null
    },
    weapon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      default: null
    },
    offhand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      default: null
    },
    accessory1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      default: null
    },
    accessory2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      default: null
    }
  },
  inventory: [{
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item'
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1
    }
  }],
  skills: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill'
  }],
  appearance: {
    hairStyle: {
      type: Number,
      default: 1
    },
    hairColor: {
      type: String,
      default: '#6D4C41'
    },
    skinColor: {
      type: String,
      default: '#E0AC69'
    },
    faceStyle: {
      type: Number,
      default: 1
    }
  },
  currentZoneId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Zone',
    default: null
  },
  guildId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guild',
    default: null
  },
  unassignedPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  prestigeLevel: {
    type: Number,
    default: 0,
    min: 0
  },
  achievements: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Méthode pour calculer l'expérience nécessaire pour le niveau suivant
characterSchema.methods.experienceToNextLevel = function() {
  return Math.floor(100 * Math.pow(1.5, this.level - 1));
};

// Méthode pour calculer les points de vie maximum
characterSchema.methods.maxHealth = function() {
  return this.stats.vitality * 10 + this.level * 5;
};

// Méthode pour calculer les points de mana maximum
characterSchema.methods.maxMana = function() {
  return this.stats.intelligence * 5 + this.level * 3;
};

// Méthode pour gagner de l'expérience
characterSchema.methods.gainExperience = function(amount) {
  this.experience += amount;
  
  // Vérifier si le personnage monte de niveau
  const expNeeded = this.experienceToNextLevel();
  
  while (this.experience >= expNeeded) {
    this.experience -= expNeeded;
    this.level += 1;
    this.unassignedPoints += 5;
    
    // Restaurer la santé et le mana lors d'un niveau supérieur
    this.currentHealth = this.maxHealth();
    this.currentMana = this.maxMana();
  }
  
  return this.level;
};

const Character = mongoose.model('Character', characterSchema);

export default Character;

