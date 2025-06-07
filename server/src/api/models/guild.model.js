import mongoose from 'mongoose';

const guildSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  tag: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 2,
    maxlength: 5
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  officers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  members: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    characterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Character'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    contribution: {
      type: Number,
      default: 0
    },
    rank: {
      type: String,
      enum: ['member', 'officer', 'owner'],
      default: 'member'
    }
  }],
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
  treasury: {
    gold: {
      type: Number,
      default: 0,
      min: 0
    },
    items: [{
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1
      }
    }]
  },
  perks: [{
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    level: {
      type: Number,
      default: 0,
      min: 0
    },
    maxLevel: {
      type: Number,
      required: true,
      min: 1
    },
    cost: {
      type: Number,
      required: true,
      min: 0
    },
    effect: {
      type: {
        type: String,
        enum: ['xp_boost', 'gold_boost', 'drop_rate_boost', 'inventory_slots', 'health_boost', 'mana_boost']
      },
      value: {
        type: Number,
        required: true
      }
    }
  }],
  announcements: [{
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  emblem: {
    background: {
      type: String,
      default: 'default_background'
    },
    symbol: {
      type: String,
      default: 'default_symbol'
    },
    primaryColor: {
      type: String,
      default: '#3498db'
    },
    secondaryColor: {
      type: String,
      default: '#2c3e50'
    }
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  minLevelToJoin: {
    type: Number,
    default: 1,
    min: 1
  },
  maxMembers: {
    type: Number,
    default: 50,
    min: 10
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Méthode pour calculer l'expérience nécessaire pour le niveau suivant
guildSchema.methods.experienceToNextLevel = function() {
  return Math.floor(1000 * Math.pow(1.5, this.level - 1));
};

// Méthode pour ajouter de l'expérience à la guilde
guildSchema.methods.addExperience = function(amount) {
  this.experience += amount;
  
  // Vérifier si la guilde monte de niveau
  const expNeeded = this.experienceToNextLevel();
  
  while (this.experience >= expNeeded) {
    this.experience -= expNeeded;
    this.level += 1;
    
    // Augmenter le nombre maximum de membres
    this.maxMembers = Math.min(100, this.maxMembers + 5);
  }
  
  return this.level;
};

// Méthode pour vérifier si un utilisateur est membre de la guilde
guildSchema.methods.isMember = function(userId) {
  return this.members.some(member => member.userId.toString() === userId.toString());
};

// Méthode pour vérifier si un utilisateur est officier de la guilde
guildSchema.methods.isOfficer = function(userId) {
  return this.members.some(
    member => member.userId.toString() === userId.toString() && 
    (member.rank === 'officer' || member.rank === 'owner')
  );
};

// Méthode pour vérifier si un utilisateur est le propriétaire de la guilde
guildSchema.methods.isOwner = function(userId) {
  return this.ownerId.toString() === userId.toString();
};

const Guild = mongoose.model('Guild', guildSchema);

export default Guild;

