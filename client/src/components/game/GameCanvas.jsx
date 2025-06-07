import { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

const GameCanvas = ({ 
  currentZone, 
  character, 
  monsters, 
  onMonsterClick,
  onZoneChange 
}) => {
  const canvasRef = useRef(null);
  const appRef = useRef(null);
  
  // Initialisation de Pixi.js
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Création de l'application Pixi
    const app = new PIXI.Application({
      background: '#1a1a2e',
      resizeTo: canvasRef.current,
    });
    
    // Ajout du canvas à l'élément DOM
    canvasRef.current.appendChild(app.view);
    appRef.current = app;
    
    // Création de la scène
    const gameScene = new PIXI.Container();
    app.stage.addChild(gameScene);
    
    // Création du fond
    const background = new PIXI.Graphics();
    background.beginFill(0x1a1a2e);
    background.drawRect(0, 0, app.screen.width, app.screen.height);
    background.endFill();
    gameScene.addChild(background);
    
    // Ajout d'éléments décoratifs pour la forêt
    if (currentZone?.name === 'Forêt des Murmures') {
      // Ajout d'arbres
      for (let i = 0; i < 20; i++) {
        const tree = new PIXI.Graphics();
        tree.beginFill(0x2a6e3f);
        tree.drawRect(-10, -30, 20, 30);
        tree.endFill();
        
        tree.beginFill(0x3a8c51);
        tree.drawCircle(0, -40, 20);
        tree.endFill();
        
        tree.x = Math.random() * app.screen.width;
        tree.y = Math.random() * app.screen.height;
        gameScene.addChild(tree);
      }
    }
    
    // Ajout du personnage
    const playerChar = new PIXI.Graphics();
    playerChar.beginFill(0x3498db);
    playerChar.drawCircle(0, 0, 15);
    playerChar.endFill();
    
    playerChar.x = app.screen.width / 2;
    playerChar.y = app.screen.height / 2;
    gameScene.addChild(playerChar);
    
    // Animation du personnage
    app.ticker.add(() => {
      playerChar.y += Math.sin(app.ticker.lastTime / 500) * 0.5;
    });
    
    // Ajout des monstres
    if (monsters && monsters.length > 0) {
      monsters.forEach((monster, index) => {
        const monsterGraphic = new PIXI.Graphics();
        
        // Couleur basée sur la rareté
        let color = 0x95a5a6; // Commun (gris)
        if (monster.rarity === 'rare') color = 0x3498db; // Bleu
        if (monster.rarity === 'epic') color = 0x9b59b6; // Violet
        if (monster.rarity === 'legendary') color = 0xe67e22; // Orange
        if (monster.rarity === 'mythic') color = 0xe74c3c; // Rouge
        
        monsterGraphic.beginFill(color);
        monsterGraphic.drawCircle(0, 0, 10 + (monster.level / 10));
        monsterGraphic.endFill();
        
        // Position aléatoire autour du joueur
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 150;
        monsterGraphic.x = playerChar.x + Math.cos(angle) * distance;
        monsterGraphic.y = playerChar.y + Math.sin(angle) * distance;
        
        // Rendre le monstre interactif
        monsterGraphic.eventMode = 'static';
        monsterGraphic.cursor = 'pointer';
        monsterGraphic.on('pointerdown', () => {
          if (onMonsterClick) onMonsterClick(monster);
        });
        
        // Animation du monstre
        app.ticker.add(() => {
          monsterGraphic.x += Math.sin(app.ticker.lastTime / 1000 + index) * 0.5;
          monsterGraphic.y += Math.cos(app.ticker.lastTime / 1000 + index) * 0.5;
        });
        
        gameScene.addChild(monsterGraphic);
      });
    }
    
    // Nettoyage
    return () => {
      app.destroy(true, true);
      if (canvasRef.current) {
        canvasRef.current.innerHTML = '';
      }
    };
  }, [currentZone, monsters, onMonsterClick]);
  
  // Gestion du redimensionnement
  useEffect(() => {
    const handleResize = () => {
      if (appRef.current) {
        appRef.current.renderer.resize(
          canvasRef.current.clientWidth,
          canvasRef.current.clientHeight
        );
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return <div ref={canvasRef} className="game-canvas" />;
};

export default GameCanvas;

