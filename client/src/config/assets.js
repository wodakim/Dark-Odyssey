/**
 * Configuration des assets graphiques
 */

// Personnages
export const CHARACTER_ASSETS = {
  human: {
    warrior: '/assets/characters/human_warrior.png',
  },
  elf: {
    mage: '/assets/characters/elf_mage.png',
  },
  dwarf: {
    fighter: '/assets/characters/dwarf_fighter.png',
  },
  orc: {
    berserker: '/assets/characters/orc_berserker.png',
  },
  goblin: {
    rogue: '/assets/characters/goblin_rogue.png',
  }
};

// Monstres
export const MONSTER_ASSETS = {
  goblin: '/assets/monsters/goblin.png',
  wolf: '/assets/monsters/wolf.png',
  bandit: '/assets/monsters/bandit.png',
  troll: '/assets/monsters/troll.png',
};

// Objets
export const ITEM_ASSETS = {
  weapons: {
    rusty_sword: '/assets/items/rusty_sword.png',
  },
  armors: {
    leather_armor: '/assets/items/leather_armor.png',
  },
  consumables: {
    health_potion: '/assets/items/health_potion.png',
    mana_potion: '/assets/items/mana_potion.png',
  }
};

// Fonds
export const BACKGROUND_ASSETS = {
  forest: '/assets/backgrounds/forest.png',
  desert: '/assets/backgrounds/desert.png',
  dungeon: '/assets/backgrounds/dungeon.png',
};

// Interface utilisateur
export const UI_ASSETS = {
  stats_frame: '/assets/ui/stats_frame.png',
  buttons: '/assets/ui/buttons.png',
};

// Fonction pour précharger les images
export const preloadAssets = () => {
  const assets = [
    ...Object.values(CHARACTER_ASSETS).flatMap(character => Object.values(character)),
    ...Object.values(MONSTER_ASSETS),
    ...Object.values(ITEM_ASSETS.weapons),
    ...Object.values(ITEM_ASSETS.armors),
    ...Object.values(ITEM_ASSETS.consumables),
    ...Object.values(BACKGROUND_ASSETS),
    ...Object.values(UI_ASSETS),
  ];

  assets.forEach(src => {
    const img = new Image();
    img.src = src;
  });
};

export default {
  CHARACTER_ASSETS,
  MONSTER_ASSETS,
  ITEM_ASSETS,
  BACKGROUND_ASSETS,
  UI_ASSETS,
  preloadAssets
};

