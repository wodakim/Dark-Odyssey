// Service de sauvegarde locale et cloud pour Dark Odyssey
// Fichier: /client/src/services/saveService.js

class SaveService {
  constructor() {
    this.SAVE_KEY = 'dark_odyssey_save';
    this.BACKUP_KEY = 'dark_odyssey_backup';
    this.SETTINGS_KEY = 'dark_odyssey_settings';
  }

  // Créer une sauvegarde par défaut
  createDefaultSave() {
    return {
      player: {
        name: 'Aventurier',
        level: 1,
        experience: 0,
        experienceToNext: 100,
        health: 100,
        maxHealth: 100,
        mana: 50,
        maxMana: 50,
        gold: 50,
        stats: {
          strength: 10,
          agility: 10,
          intelligence: 10,
          vitality: 10,
          luck: 10
        },
        skills: {
          combat: 0,
          magic: 0,
          crafting: 0,
          exploration: 0
        },
        skillPoints: 0
      },
      inventory: {
        items: [
          {
            id: 'health_potion',
            name: 'Potion de Soin',
            type: 'consumable',
            rarity: 'common',
            quantity: 3,
            description: 'Restaure 50 points de vie'
          }
        ],
        equipment: {
          weapon: null,
          armor: null,
          accessory: null
        },
        maxSlots: 20
      },
      progress: {
        currentZone: 'forest',
        unlockedZones: ['forest'],
        questsCompleted: [],
        questsActive: [],
        questsViewed: [],
        questRewardsViewed: [],
        monstersDefeated: {},
        achievementsUnlocked: [],
        totalPlayTime: 0,
        gamesPlayed: 1
      },
      gameState: {
        inCombat: false,
        currentEnemy: null,
        lastSaveTime: Date.now(),
        version: '2.0.0'
      }
    };
  }

  // Sauvegarder les données
  save(gameData) {
    try {
      // Créer un backup avant la sauvegarde
      const currentSave = this.load();
      if (currentSave) {
        localStorage.setItem(this.BACKUP_KEY, JSON.stringify(currentSave));
      }

      // Mettre à jour le timestamp
      gameData.gameState.lastSaveTime = Date.now();
      
      // Sauvegarder
      const saveData = JSON.stringify(gameData);
      localStorage.setItem(this.SAVE_KEY, saveData);
      
      console.log('Partie sauvegardée avec succès');
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      return false;
    }
  }

  // Charger les données
  load() {
    try {
      const saveData = localStorage.getItem(this.SAVE_KEY);
      if (!saveData) {
        return null;
      }
      
      const gameData = JSON.parse(saveData);
      
      // Validation basique des données
      if (!gameData.player || !gameData.inventory || !gameData.progress) {
        console.warn('Sauvegarde corrompue détectée');
        return null;
      }
      
      return gameData;
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      return null;
    }
  }

  // Vérifier si une sauvegarde existe
  hasSave() {
    return localStorage.getItem(this.SAVE_KEY) !== null;
  }

  // Supprimer la sauvegarde
  deleteSave() {
    try {
      localStorage.removeItem(this.SAVE_KEY);
      localStorage.removeItem(this.BACKUP_KEY);
      console.log('Sauvegarde supprimée');
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      return false;
    }
  }

  // Restaurer depuis le backup
  restoreBackup() {
    try {
      const backupData = localStorage.getItem(this.BACKUP_KEY);
      if (!backupData) {
        return false;
      }
      
      localStorage.setItem(this.SAVE_KEY, backupData);
      console.log('Backup restauré avec succès');
      return true;
    } catch (error) {
      console.error('Erreur lors de la restauration:', error);
      return false;
    }
  }

  // Exporter la sauvegarde
  exportSave() {
    try {
      const saveData = this.load();
      if (!saveData) {
        return null;
      }
      
      const exportData = {
        ...saveData,
        exportDate: new Date().toISOString(),
        version: '2.0.0'
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dark_odyssey_save_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      return false;
    }
  }

  // Importer une sauvegarde
  async importSave(file) {
    try {
      const text = await file.text();
      const importData = JSON.parse(text);
      
      // Validation des données importées
      if (!importData.player || !importData.inventory || !importData.progress) {
        throw new Error('Fichier de sauvegarde invalide');
      }
      
      // Créer un backup avant l'import
      const currentSave = this.load();
      if (currentSave) {
        localStorage.setItem(this.BACKUP_KEY, JSON.stringify(currentSave));
      }
      
      // Importer les données
      this.save(importData);
      console.log('Sauvegarde importée avec succès');
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      return false;
    }
  }

  // Sauvegarde automatique
  autoSave(gameData) {
    // Sauvegarder toutes les 30 secondes
    if (!this.autoSaveInterval) {
      this.autoSaveInterval = setInterval(() => {
        if (gameData) {
          this.save(gameData);
        }
      }, 30000);
    }
  }

  // Arrêter la sauvegarde automatique
  stopAutoSave() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
    }
  }

  // Obtenir les informations de sauvegarde
  getSaveInfo() {
    const saveData = this.load();
    if (!saveData) {
      return null;
    }
    
    return {
      playerName: saveData.player.name,
      level: saveData.player.level,
      playTime: saveData.progress.totalPlayTime,
      lastSave: new Date(saveData.gameState.lastSaveTime),
      currentZone: saveData.progress.currentZone,
      questsCompleted: saveData.progress.questsCompleted.length
    };
  }

  // Vérifier l'intégrité de la sauvegarde
  checkSaveIntegrity() {
    try {
      const saveData = this.load();
      if (!saveData) {
        return { valid: false, error: 'Aucune sauvegarde trouvée' };
      }
      
      const issues = [];
      
      // Vérifier les statistiques du joueur
      if (saveData.player.health > saveData.player.maxHealth) {
        issues.push('Santé supérieure au maximum');
      }
      
      if (saveData.player.mana > saveData.player.maxMana) {
        issues.push('Mana supérieur au maximum');
      }
      
      if (saveData.player.experience < 0) {
        issues.push('Expérience négative');
      }
      
      // Vérifier l'inventaire
      if (saveData.inventory.items.length > saveData.inventory.maxSlots) {
        issues.push('Inventaire dépassant la capacité maximale');
      }
      
      return {
        valid: issues.length === 0,
        issues: issues
      };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  // Réparer la sauvegarde
  repairSave() {
    try {
      const saveData = this.load();
      if (!saveData) {
        return false;
      }
      
      // Réparer les statistiques du joueur
      saveData.player.health = Math.min(saveData.player.health, saveData.player.maxHealth);
      saveData.player.mana = Math.min(saveData.player.mana, saveData.player.maxMana);
      saveData.player.experience = Math.max(0, saveData.player.experience);
      
      // Réparer l'inventaire
      if (saveData.inventory.items.length > saveData.inventory.maxSlots) {
        saveData.inventory.items = saveData.inventory.items.slice(0, saveData.inventory.maxSlots);
      }
      
      // Sauvegarder les réparations
      this.save(saveData);
      console.log('Sauvegarde réparée avec succès');
      return true;
    } catch (error) {
      console.error('Erreur lors de la réparation:', error);
      return false;
    }
  }
}

// Instance singleton
const saveService = new SaveService();

export default saveService;

