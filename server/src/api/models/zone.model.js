import mongoose from 'mongoose';

const zoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  minLevel: {
    type: Number,
    required: true,
    min: 1
  },
  maxLevel: {
    type: Number,
    required: true,
    min: 1
  },
  biome: {
    type: String,
    required: true,
    enum: ['forest', 'desert', 'mountain', 'swamp', 'plains', 'cave', 'dungeon', 'city', 'ruins', 'beach', 'ocean', 'volcano', 'snow']
  },
  difficulty: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  monsters: [{
    monsterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Monster'
    },
    spawnRate: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    }
  }],
  events: [{
    type: {
      type: String,
      required: true,
      enum: ['combat', 'treasure', 'merchant', 'puzzle', 'boss', 'quest']
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    triggerRate: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    rewards: {
      experience: {
        type: Number,
        default: 0
      },
      gold: {
        type: Number,
        default: 0
      },
      items: [{
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Item'
        },
        chance: {
          type: Number,
          required: true,
          min: 0,
          max: 100
        }
      }]
    }
  }],
  connections: [{
    zoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Zone'
    },
    requiredLevel: {
      type: Number,
      default: 1
    },
    requiredQuest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quest',
      default: null
    }
  }],
  backgroundImage: {
    type: String,
    default: 'default_background'
  },
  ambientSound: {
    type: String,
    default: 'default_ambient'
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

// Méthode pour générer un événement aléatoire
zoneSchema.methods.generateRandomEvent = function() {
  // Calculer la somme totale des taux de déclenchement
  const totalTriggerRate = this.events.reduce((sum, event) => sum + event.triggerRate, 0);
  
  // Générer un nombre aléatoire entre 0 et la somme totale
  const random = Math.random() * totalTriggerRate;
  
  // Trouver l'événement correspondant
  let cumulativeTriggerRate = 0;
  for (const event of this.events) {
    cumulativeTriggerRate += event.triggerRate;
    if (random <= cumulativeTriggerRate) {
      return event;
    }
  }
  
  // Si aucun événement n'est déclenché, retourner null
  return null;
};

// Méthode pour générer un monstre aléatoire
zoneSchema.methods.generateRandomMonster = function() {
  // Calculer la somme totale des taux d'apparition
  const totalSpawnRate = this.monsters.reduce((sum, monster) => sum + monster.spawnRate, 0);
  
  // Générer un nombre aléatoire entre 0 et la somme totale
  const random = Math.random() * totalSpawnRate;
  
  // Trouver le monstre correspondant
  let cumulativeSpawnRate = 0;
  for (const monster of this.monsters) {
    cumulativeSpawnRate += monster.spawnRate;
    if (random <= cumulativeSpawnRate) {
      return monster.monsterId;
    }
  }
  
  // Si aucun monstre n'est généré, retourner null
  return null;
};

const Zone = mongoose.model('Zone', zoneSchema);

export default Zone;

