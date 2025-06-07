# Documentation Technique - Dark Odyssey

## Table des matières

1. [Introduction](#introduction)
2. [Architecture du Projet](#architecture-du-projet)
3. [Frontend](#frontend)
   - [Structure des Composants](#structure-des-composants)
   - [Gestion d'État avec Redux](#gestion-détat-avec-redux)
   - [Rendu Graphique avec Pixi.js](#rendu-graphique-avec-pixijs)
   - [Communication en Temps Réel](#communication-en-temps-réel)
4. [Backend](#backend)
   - [API RESTful](#api-restful)
   - [Base de Données](#base-de-données)
   - [Authentification et Sécurité](#authentification-et-sécurité)
   - [Système de Socket.io](#système-de-socketio)
5. [Logique de Jeu](#logique-de-jeu)
   - [Système de Combat](#système-de-combat)
   - [Génération de Map](#génération-de-map)
   - [Système d'Objets et d'Équipement](#système-dobjets-et-déquipement)
   - [Progression et Expérience](#progression-et-expérience)
6. [Déploiement](#déploiement)
   - [Configuration pour GitHub](#configuration-pour-github)
   - [Déploiement sur Render.com](#déploiement-sur-rendercom)
7. [Maintenance et Évolution](#maintenance-et-évolution)
   - [Gestion des Versions](#gestion-des-versions)
   - [Ajout de Nouvelles Fonctionnalités](#ajout-de-nouvelles-fonctionnalités)
   - [Optimisation des Performances](#optimisation-des-performances)

## Introduction

Dark Odyssey est un jeu idle RPG multijoueur développé avec les technologies web modernes. Cette documentation technique détaille l'architecture, les composants et les fonctionnalités du projet pour faciliter sa compréhension, sa maintenance et son évolution.

## Architecture du Projet

Le projet suit une architecture client-serveur classique avec une séparation claire entre le frontend et le backend :

```
dark-odyssey/
├── client/               # Application frontend React
│   ├── public/           # Fichiers statiques et assets
│   │   └── assets/       # Images, sons et autres ressources
│   └── src/              # Code source du frontend
│       ├── components/   # Composants React
│       ├── config/       # Fichiers de configuration
│       ├── services/     # Services pour les appels API
│       └── store/        # État global Redux
├── server/               # Serveur backend Node.js
│   ├── src/              # Code source du backend
│   │   ├── api/          # Routes et contrôleurs API
│   │   ├── config/       # Configuration du serveur
│   │   ├── models/       # Modèles de données
│   │   └── socket/       # Gestion des connexions Socket.io
│   └── .env              # Variables d'environnement
├── README.md             # Documentation générale
└── DOCUMENTATION.md      # Documentation technique
```

## Frontend

### Structure des Composants

L'application frontend est construite avec React et suit une architecture de composants modulaire. Les principaux composants sont :

- **App** : Composant racine qui gère la navigation et l'état global
- **GameCanvas** : Utilise Pixi.js pour le rendu graphique du jeu
- **CharacterPanel** : Affiche et gère les informations du personnage
- **InventoryPanel** : Gère l'inventaire et l'équipement du joueur
- **CombatSystem** : Gère les interactions de combat
- **ChatPanel** : Interface de chat pour la communication entre joueurs

### Gestion d'État avec Redux

Redux est utilisé pour gérer l'état global de l'application avec les slices suivants :

- **authSlice** : Gestion de l'authentification et des utilisateurs
- **characterSlice** : Gestion des personnages et de leurs attributs
- **combatSlice** : État du combat et des actions associées
- **gameSlice** : État général du jeu (zones, monstres, objets)
- **uiSlice** : État de l'interface utilisateur (modales, notifications)
- **chatSlice** : Gestion des messages de chat et des canaux

### Rendu Graphique avec Pixi.js

Pixi.js est utilisé pour le rendu graphique du jeu, permettant des animations fluides et des effets visuels avancés. Le composant `GameCanvas` encapsule la logique de rendu et gère les interactions avec le moteur graphique.

```javascript
// Exemple simplifié d'initialisation de Pixi.js
useEffect(() => {
  const app = new PIXI.Application({
    width: canvasWidth,
    height: canvasHeight,
    backgroundColor: 0x1a1a1a,
    resolution: window.devicePixelRatio || 1,
  });
  
  canvasRef.current.appendChild(app.view);
  
  // Chargement des textures
  const loader = PIXI.Loader.shared;
  Object.values(assets).forEach(asset => {
    loader.add(asset);
  });
  
  loader.load((loader, resources) => {
    // Initialisation des sprites et de la scène
    initGame(app, resources);
  });
  
  return () => {
    app.destroy(true, true);
  };
}, []);
```

### Communication en Temps Réel

Socket.io est utilisé pour la communication en temps réel entre les clients et le serveur, permettant des fonctionnalités comme le chat, les mises à jour de position et les notifications d'événements.

```javascript
// Exemple d'utilisation de Socket.io dans un composant
useEffect(() => {
  socketService.on('chat_message', (message) => {
    dispatch(addMessage(message));
  });
  
  socketService.on('player_joined', (player) => {
    dispatch(addNotification({
      type: 'info',
      message: `${player.username} a rejoint la zone.`
    }));
  });
  
  return () => {
    socketService.off('chat_message');
    socketService.off('player_joined');
  };
}, [dispatch]);
```

## Backend

### API RESTful

Le backend expose une API RESTful pour les opérations CRUD sur les ressources du jeu. Les principales routes sont :

- **/api/auth** : Authentification et gestion des utilisateurs
- **/api/characters** : Gestion des personnages
- **/api/items** : Gestion des objets et de l'inventaire
- **/api/zones** : Gestion des zones et de l'exploration
- **/api/monsters** : Informations sur les monstres
- **/api/combat** : Système de combat
- **/api/guilds** : Gestion des guildes

### Base de Données

MongoDB est utilisé comme base de données pour stocker les informations du jeu. Les principaux modèles de données sont :

- **User** : Informations sur les utilisateurs et authentification
- **Character** : Personnages des joueurs avec leurs attributs
- **Item** : Objets du jeu avec leurs propriétés
- **Zone** : Zones du monde avec leurs caractéristiques
- **Monster** : Monstres avec leurs statistiques et comportements
- **Guild** : Guildes et leurs membres

### Authentification et Sécurité

L'authentification est gérée avec JSON Web Tokens (JWT) pour sécuriser l'accès à l'API. Le middleware d'authentification vérifie la validité du token pour chaque requête protégée.

```javascript
// Middleware d'authentification
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Token d\'authentification manquant' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token d\'authentification invalide' });
  }
};
```

### Système de Socket.io

Socket.io est configuré sur le serveur pour gérer les connexions en temps réel. Les principaux événements sont :

- **connection** : Établissement de la connexion
- **disconnect** : Déconnexion d'un client
- **chat_message** : Envoi et réception de messages de chat
- **player_move** : Mise à jour de la position d'un joueur
- **combat_update** : Mises à jour du combat en temps réel

```javascript
// Configuration de Socket.io sur le serveur
io.on('connection', (socket) => {
  console.log(`Nouvelle connexion: ${socket.id}`);
  
  // Authentification du socket
  const token = socket.handshake.auth.token;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    
    // Rejoindre les canaux appropriés
    socket.join('global');
    
    // Informer les autres joueurs
    socket.broadcast.emit('player_joined', {
      id: socket.userId,
      username: decoded.username
    });
    
    // Gérer les messages de chat
    socket.on('chat_message', (data) => {
      const { channel, message } = data;
      
      const messageData = {
        userId: socket.userId,
        username: decoded.username,
        channel,
        message,
        timestamp: Date.now()
      };
      
      io.to(channel).emit('chat_message', messageData);
    });
    
    // Gérer la déconnexion
    socket.on('disconnect', () => {
      console.log(`Déconnexion: ${socket.id}`);
      socket.broadcast.emit('player_left', {
        id: socket.userId,
        username: decoded.username
      });
    });
  } catch (error) {
    console.error('Erreur d\'authentification du socket:', error);
    socket.disconnect();
  }
});
```

## Logique de Jeu

### Système de Combat

Le système de combat est basé sur des tours et prend en compte les statistiques des personnages et des monstres. Les actions possibles incluent l'attaque, l'utilisation de compétences et d'objets, et la fuite.

```javascript
// Exemple simplifié de logique de combat
const processCombatTurn = (character, monster, action) => {
  const logs = [];
  
  // Traiter l'action du joueur
  switch (action.type) {
    case 'attack':
      const damage = calculateDamage(character, monster);
      monster.currentHp -= damage;
      logs.push(`${character.name} inflige ${damage} points de dégâts à ${monster.name}.`);
      break;
    case 'skill':
      // Logique d'utilisation de compétence
      break;
    case 'item':
      // Logique d'utilisation d'objet
      break;
    case 'flee':
      // Logique de fuite
      break;
  }
  
  // Vérifier si le monstre est vaincu
  if (monster.currentHp <= 0) {
    const rewards = calculateRewards(monster);
    logs.push(`${monster.name} est vaincu !`);
    return { character, monster, logs, rewards, combatEnded: true };
  }
  
  // Action du monstre
  const monsterDamage = calculateMonsterDamage(monster, character);
  character.currentHp -= monsterDamage;
  logs.push(`${monster.name} inflige ${monsterDamage} points de dégâts à ${character.name}.`);
  
  // Vérifier si le personnage est vaincu
  if (character.currentHp <= 0) {
    logs.push(`${character.name} est vaincu !`);
    return { character, monster, logs, combatEnded: true };
  }
  
  return { character, monster, logs, combatEnded: false };
};
```

### Génération de Map

Les zones du jeu sont générées procéduralement avec différents biomes, monstres et événements. L'algorithme de génération prend en compte le niveau du joueur pour ajuster la difficulté.

```javascript
// Exemple simplifié de génération de zone
const generateZone = (level) => {
  const biomeTypes = ['forest', 'desert', 'dungeon', 'mountains', 'swamp'];
  const biome = biomeTypes[Math.floor(Math.random() * biomeTypes.length)];
  
  const size = 10 + Math.floor(Math.random() * 10);
  const difficulty = Math.max(1, level - 2 + Math.floor(Math.random() * 5));
  
  // Générer la grille de la zone
  const grid = Array(size).fill().map(() => Array(size).fill(null));
  
  // Placer des points d'intérêt
  const pointsOfInterest = generatePointsOfInterest(biome, difficulty);
  
  // Placer des monstres
  const monsters = generateMonsters(biome, difficulty, size);
  
  // Placer des trésors
  const treasures = generateTreasures(difficulty, size);
  
  return {
    name: generateZoneName(biome),
    biome,
    size,
    difficulty,
    grid,
    pointsOfInterest,
    monsters,
    treasures
  };
};
```

### Système d'Objets et d'Équipement

Les objets du jeu ont différentes raretés et statistiques. Les équipements influencent l'apparence du personnage et ses attributs en combat.

```javascript
// Exemple de génération d'objet
const generateItem = (level, rarity = null) => {
  const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
  const itemRarity = rarity || weightedRandom(rarities, [0.6, 0.25, 0.1, 0.04, 0.01]);
  
  const itemTypes = ['weapon', 'armor', 'accessory', 'consumable'];
  const itemType = weightedRandom(itemTypes, [0.4, 0.3, 0.2, 0.1]);
  
  const rarityMultiplier = {
    common: 1,
    uncommon: 1.5,
    rare: 2,
    epic: 3,
    legendary: 5
  };
  
  // Générer les statistiques de base en fonction du niveau et de la rareté
  const baseStats = {
    level,
    power: Math.floor(level * 2 * rarityMultiplier[itemRarity] * (0.9 + Math.random() * 0.2))
  };
  
  // Ajouter des statistiques spécifiques au type d'objet
  let item = {
    name: generateItemName(itemType, itemRarity),
    type: itemType,
    rarity: itemRarity,
    ...baseStats
  };
  
  // Ajouter des propriétés spéciales pour les objets rares et supérieurs
  if (['rare', 'epic', 'legendary'].includes(itemRarity)) {
    item.specialEffects = generateSpecialEffects(itemRarity, itemType);
  }
  
  return item;
};
```

### Progression et Expérience

Le système de progression est basé sur l'expérience gagnée en combattant des monstres et en accomplissant des quêtes. Les niveaux débloquent de nouvelles zones et capacités.

```javascript
// Calcul de l'expérience nécessaire pour un niveau
const calculateRequiredExp = (level) => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

// Attribution d'expérience après un combat
const awardExperience = async (character, monster) => {
  const baseExp = monster.level * 10;
  const levelDifference = monster.level - character.level;
  
  // Bonus ou malus en fonction de la différence de niveau
  let expMultiplier = 1;
  if (levelDifference > 0) {
    expMultiplier = 1 + (levelDifference * 0.1);
  } else if (levelDifference < 0) {
    expMultiplier = Math.max(0.1, 1 + (levelDifference * 0.1));
  }
  
  const expGained = Math.floor(baseExp * expMultiplier);
  character.experience += expGained;
  
  // Vérifier si le personnage monte de niveau
  const requiredExp = calculateRequiredExp(character.level);
  if (character.experience >= requiredExp) {
    character.level += 1;
    character.experience -= requiredExp;
    character.statPoints += 5;
    
    // Restaurer les points de vie et de mana
    character.currentHp = character.maxHp;
    character.currentMp = character.maxMp;
    
    return {
      expGained,
      levelUp: true,
      newLevel: character.level
    };
  }
  
  return {
    expGained,
    levelUp: false
  };
};
```

## Déploiement

### Configuration pour GitHub

Le projet est configuré pour être hébergé sur GitHub avec les fichiers de configuration suivants :

- **.gitignore** : Exclut les fichiers et dossiers non nécessaires
- **README.md** : Documentation générale du projet
- **LICENSE** : Licence du projet (MIT)

### Déploiement sur Render.com

Le déploiement sur Render.com est configuré pour le frontend et le backend :

**Backend (Service Web) :**
- Répertoire : `server`
- Commande de build : `npm install`
- Commande de démarrage : `npm start`
- Variables d'environnement :
  - `PORT` : Port d'écoute du serveur
  - `MONGODB_URI` : URI de connexion à la base de données
  - `JWT_SECRET` : Clé secrète pour les tokens JWT
  - `NODE_ENV` : Environnement (production)

**Frontend (Service Statique) :**
- Répertoire : `client`
- Commande de build : `npm run build`
- Répertoire de publication : `dist`
- Variables d'environnement :
  - `VITE_API_URL` : URL de l'API backend
  - `VITE_SOCKET_URL` : URL du serveur Socket.io

## Maintenance et Évolution

### Gestion des Versions

Le projet suit la gestion sémantique des versions (SemVer) :

- **Version majeure (X.0.0)** : Changements incompatibles avec les versions précédentes
- **Version mineure (0.X.0)** : Ajout de fonctionnalités rétrocompatibles
- **Version de correctif (0.0.X)** : Corrections de bugs rétrocompatibles

### Ajout de Nouvelles Fonctionnalités

Pour ajouter de nouvelles fonctionnalités :

1. Créer une branche à partir de `develop`
2. Développer et tester la fonctionnalité
3. Créer une pull request vers `develop`
4. Après validation, fusionner dans `develop`
5. Fusionner `develop` dans `main` pour les releases

### Optimisation des Performances

Quelques stratégies d'optimisation des performances :

- Utilisation de React.memo pour les composants qui ne changent pas souvent
- Mise en cache des résultats d'API avec React Query
- Chargement paresseux des composants avec React.lazy
- Optimisation des assets graphiques
- Utilisation de Web Workers pour les calculs intensifs

