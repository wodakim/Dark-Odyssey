import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';

const CombatSystem = ({ 
  character, 
  monster, 
  onAttack, 
  onUseSkill, 
  onUseItem, 
  onFlee,
  combatLogs = []
}) => {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showSkills, setShowSkills] = useState(false);
  const [showItems, setShowItems] = useState(false);
  const [combatState, setCombatState] = useState('idle'); // idle, playerTurn, monsterTurn, victory, defeat
  
  // Simuler un tour de combat
  useEffect(() => {
    if (!character || !monster) return;
    
    // Initialiser le combat
    if (combatState === 'idle') {
      setCombatState('playerTurn');
    }
  }, [character, monster, combatState]);
  
  // Fonction pour obtenir la classe CSS de rareté
  const getRarityClass = (rarity) => {
    switch (rarity) {
      case 'rare': return 'rarity-rare';
      case 'epic': return 'rarity-epic';
      case 'legendary': return 'rarity-legendary';
      case 'mythic': return 'rarity-mythic';
      default: return '';
    }
  };
  
  // Fonction pour calculer le pourcentage de santé
  const getHealthPercentage = (current, max) => {
    return Math.max(0, Math.min(100, (current / max) * 100));
  };
  
  // Si aucun monstre n'est en combat
  if (!monster) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-lg mb-4">Aucun combat en cours</p>
        <p className="text-muted-foreground mb-8">Explorez le monde pour trouver des monstres à combattre</p>
        
        <Button 
          variant="outline"
          onClick={() => {
            // Simuler la recherche d'un monstre
            onAttack && onAttack({ type: 'search' });
          }}
        >
          Chercher un monstre
        </Button>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* Zone du monstre */}
      <div className="flex-1 flex flex-col items-center justify-center mb-4">
        <h2 className={`text-2xl font-bold mb-2 ${getRarityClass(monster.rarity)}`}>
          {monster.name}
        </h2>
        <p className="text-sm mb-4">Niveau {monster.level}</p>
        
        <div className="w-32 h-32 bg-secondary rounded-full flex items-center justify-center mb-4 relative">
          {/* Icône du monstre */}
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3v4l-4 1 4 2v3a3 3 0 0 0 6 0v-3l4-2-4-1V3"></path>
            <path d="M12 22v-3"></path>
          </svg>
          
          {/* Effet de rareté */}
          {monster.rarity === 'legendary' && (
            <div className="absolute inset-0 rounded-full border-2 border-legendary animate-pulse"></div>
          )}
          {monster.rarity === 'mythic' && (
            <div className="absolute inset-0 rounded-full border-4 border-mythic animate-pulse"></div>
          )}
        </div>
        
        {/* Barre de vie du monstre */}
        <div className="w-48 mb-1">
          <div className="flex justify-between text-sm mb-1">
            <span>PV</span>
            <span>{monster.currentHealth}/{monster.maxHealth}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-bar-fill progress-bar-health" 
              style={{ width: `${getHealthPercentage(monster.currentHealth, monster.maxHealth)}%` }}
            ></div>
          </div>
        </div>
        
        {/* Statut du monstre */}
        {monster.status && monster.status.length > 0 && (
          <div className="flex space-x-1 mt-2">
            {monster.status.map((status, index) => (
              <div 
                key={index} 
                className="px-2 py-1 text-xs rounded bg-secondary"
                title={status.description}
              >
                {status.name}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Journal de combat */}
      <div className="h-24 bg-secondary/20 rounded p-2 mb-4 overflow-y-auto text-sm">
        {combatLogs.length === 0 ? (
          <p className="text-muted-foreground">Le combat commence...</p>
        ) : (
          combatLogs.map((log, index) => (
            <div key={index} className={`mb-1 ${log.type === 'player' ? 'text-primary' : log.type === 'monster' ? 'text-destructive' : ''}`}>
              {log.message}
            </div>
          ))
        )}
      </div>
      
      {/* Actions de combat */}
      <div className="space-y-2">
        {combatState === 'playerTurn' ? (
          <>
            {/* Actions principales */}
            <div className="grid grid-cols-2 gap-2">
              <Button 
                className="bg-primary hover:bg-primary/90"
                onClick={() => {
                  onAttack && onAttack({ type: 'basic' });
                  setCombatState('monsterTurn');
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M14.5 22H18a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h3.5"></path>
                  <path d="M14 2v6h6"></path>
                  <path d="M9.5 17h.01"></path>
                  <path d="M9.5 12h.01"></path>
                </svg>
                Attaque basique
              </Button>
              
              <Button 
                variant={showSkills ? 'default' : 'outline'}
                onClick={() => {
                  setShowSkills(!showSkills);
                  setShowItems(false);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="m12 14 4-4"></path>
                  <path d="M3.34 19a10 10 0 1 1 17.32 0"></path>
                </svg>
                Compétences
              </Button>
              
              <Button 
                variant={showItems ? 'default' : 'outline'}
                onClick={() => {
                  setShowItems(!showItems);
                  setShowSkills(false);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M5.5 8.5 9 12l-3.5 3.5L2 12l3.5-3.5Z"></path>
                  <path d="m12 2 3.5 3.5L12 9 8.5 5.5 12 2Z"></path>
                  <path d="M18.5 8.5 22 12l-3.5 3.5L15 12l3.5-3.5Z"></path>
                  <path d="m12 15 3.5 3.5L12 22l-3.5-3.5L12 15Z"></path>
                </svg>
                Objets
              </Button>
              
              <Button 
                variant="ghost"
                onClick={() => {
                  onFlee && onFlee();
                  setCombatState('idle');
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="m18 8 4 4-4 4"></path>
                  <path d="M2 12h16"></path>
                </svg>
                Fuir
              </Button>
            </div>
            
            {/* Liste des compétences */}
            {showSkills && character.skills && character.skills.length > 0 && (
              <div className="bg-card p-2 rounded">
                <h4 className="font-medium mb-2">Compétences</h4>
                <div className="space-y-1">
                  {character.skills.map((skill, index) => (
                    <Button 
                      key={index}
                      variant="ghost"
                      className="w-full justify-between"
                      disabled={skill.cooldown > 0 || character.currentMana < skill.manaCost}
                      onClick={() => {
                        onUseSkill && onUseSkill(skill);
                        setShowSkills(false);
                        setCombatState('monsterTurn');
                      }}
                    >
                      <span>{skill.name}</span>
                      <div className="flex items-center">
                        {skill.cooldown > 0 && (
                          <span className="text-xs mr-2">{skill.cooldown} tours</span>
                        )}
                        <span className="text-xs text-mana">{skill.manaCost} PM</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Liste des objets */}
            {showItems && character.inventory && character.inventory.filter(item => item.type === 'consumable').length > 0 && (
              <div className="bg-card p-2 rounded">
                <h4 className="font-medium mb-2">Objets</h4>
                <div className="space-y-1">
                  {character.inventory
                    .filter(item => item.type === 'consumable')
                    .map((item, index) => (
                      <Button 
                        key={index}
                        variant="ghost"
                        className="w-full justify-between"
                        onClick={() => {
                          onUseItem && onUseItem(item);
                          setShowItems(false);
                        }}
                      >
                        <span>{item.name}</span>
                        <span className="text-xs">{item.quantity || 1}x</span>
                      </Button>
                    ))}
                </div>
              </div>
            )}
          </>
        ) : combatState === 'monsterTurn' ? (
          <div className="text-center p-4">
            <p>Le monstre attaque...</p>
          </div>
        ) : combatState === 'victory' ? (
          <div className="text-center p-4">
            <h3 className="text-xl font-bold mb-2 text-primary">Victoire!</h3>
            <p className="mb-4">Vous avez vaincu {monster.name}!</p>
            
            {/* Récompenses */}
            <div className="bg-card p-2 rounded mb-4">
              <h4 className="font-medium mb-2">Récompenses</h4>
              <div className="flex justify-between mb-1">
                <span>Expérience</span>
                <span className="text-experience">+{monster.experience}</span>
              </div>
              <div className="flex justify-between">
                <span>Or</span>
                <span className="text-gold">+{monster.gold}</span>
              </div>
              
              {/* Objets obtenus */}
              {monster.loot && monster.loot.length > 0 && (
                <div className="mt-2">
                  <h5 className="text-sm font-medium mb-1">Objets obtenus</h5>
                  <div className="space-y-1">
                    {monster.loot.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span className={getRarityClass(item.rarity)}>{item.name}</span>
                        <span>x{item.quantity || 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <Button 
              onClick={() => {
                setCombatState('idle');
              }}
            >
              Continuer
            </Button>
          </div>
        ) : combatState === 'defeat' ? (
          <div className="text-center p-4">
            <h3 className="text-xl font-bold mb-2 text-destructive">Défaite!</h3>
            <p className="mb-4">Vous avez été vaincu par {monster.name}!</p>
            
            <Button 
              onClick={() => {
                setCombatState('idle');
              }}
            >
              Ressusciter
            </Button>
          </div>
        ) : (
          <Button 
            className="w-full"
            onClick={() => {
              setCombatState('playerTurn');
            }}
          >
            Commencer le combat
          </Button>
        )}
      </div>
    </div>
  );
};

export default CombatSystem;

