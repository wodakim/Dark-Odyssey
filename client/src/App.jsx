import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import './App.css';

// Importation des composants
import GameCanvas from './components/game/GameCanvas';
import CharacterPanel from './components/game/CharacterPanel';
import InventoryPanel from './components/game/InventoryPanel';
import ChatPanel from './components/game/ChatPanel';
import CombatSystem from './components/game/CombatSystem';

// Données de test
import { testCharacter, testInventory, testMonsters, testMessages } from './data/testData';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePanel, setActivePanel] = useState('character');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // État du jeu
  const [character, setCharacter] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [currentZone, setCurrentZone] = useState(null);
  const [monsters, setMonsters] = useState([]);
  const [currentMonster, setCurrentMonster] = useState(null);
  const [combatLogs, setCombatLogs] = useState([]);
  const [messages, setMessages] = useState([]);
  
  // Simuler un chargement
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Charger les données de test
      setCharacter(testCharacter);
      setInventory(testInventory);
      setCurrentZone({
        id: 'forest',
        name: 'Forêt des Murmures',
        level: '1-10',
        description: 'Une forêt dense et mystérieuse où les arbres semblent murmurer des secrets anciens.'
      });
      setMonsters(testMonsters);
      setMessages(testMessages);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Gestionnaires d'événements
  const handleMonsterClick = (monster) => {
    setCurrentMonster(monster);
    setCombatLogs([
      { type: 'system', message: `Vous engagez le combat contre ${monster.name}!` }
    ]);
    setActivePanel('combat');
  };
  
  const handleAttack = (attackType) => {
    if (!currentMonster) return;
    
    // Simuler une attaque
    const damage = Math.floor(Math.random() * 10) + 5;
    const updatedMonster = {
      ...currentMonster,
      currentHealth: Math.max(0, currentMonster.currentHealth - damage)
    };
    
    setCombatLogs(prev => [
      ...prev,
      { type: 'player', message: `Vous infligez ${damage} points de dégâts à ${currentMonster.name}.` }
    ]);
    
    setCurrentMonster(updatedMonster);
    
    // Simuler une contre-attaque
    setTimeout(() => {
      const monsterDamage = Math.floor(Math.random() * 5) + 3;
      
      setCombatLogs(prev => [
        ...prev,
        { type: 'monster', message: `${currentMonster.name} vous inflige ${monsterDamage} points de dégâts.` }
      ]);
      
      // Vérifier si le monstre est vaincu
      if (updatedMonster.currentHealth <= 0) {
        setCombatLogs(prev => [
          ...prev,
          { type: 'system', message: `Vous avez vaincu ${currentMonster.name}!` }
        ]);
        
        // Récompenses
        const exp = currentMonster.level * 10;
        const gold = currentMonster.level * 5;
        
        setCombatLogs(prev => [
          ...prev,
          { type: 'system', message: `Vous gagnez ${exp} points d'expérience et ${gold} pièces d'or.` }
        ]);
        
        // Chance de butin
        if (Math.random() < 0.3) {
          setCombatLogs(prev => [
            ...prev,
            { type: 'system', message: `Vous trouvez une Potion de Soin!` }
          ]);
        }
        
        setTimeout(() => {
          setCurrentMonster(null);
        }, 2000);
      }
    }, 1000);
  };
  
  const handleSendMessage = (message) => {
    const newMessage = {
      sender: character?.name || 'Joueur',
      content: message.content,
      channel: message.channel,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, newMessage]);
  };
  
  // Page de chargement
  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-background">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold mb-4 text-primary">Dark Odyssey</h1>
          <p className="text-lg mb-8">Chargement de l'aventure...</p>
          <div className="w-64 h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-[pulse_2s_ease-in-out_infinite]" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
    );
  }
  
  // Page de connexion/inscription
  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-background">
        <div className="w-96 p-8 bg-card rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center text-primary">Dark Odyssey</h1>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-1">Nom d'utilisateur</label>
              <input 
                type="text" 
                id="username" 
                className="w-full px-3 py-2 bg-input text-foreground rounded-md"
                placeholder="Entrez votre nom d'utilisateur" 
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">Mot de passe</label>
              <input 
                type="password" 
                id="password" 
                className="w-full px-3 py-2 bg-input text-foreground rounded-md"
                placeholder="Entrez votre mot de passe" 
              />
            </div>
            
            <Button 
              className="w-full bg-primary hover:bg-primary/90" 
              onClick={() => setIsLoggedIn(true)}
            >
              Connexion
            </Button>
            
            <div className="text-center">
              <a href="#" className="text-sm text-primary hover:underline">Créer un compte</a>
              <span className="mx-2">•</span>
              <a href="#" className="text-sm text-primary hover:underline">Mot de passe oublié</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Interface principale du jeu
  return (
    <div className="game-container">
      {/* En-tête du jeu */}
      <header className="game-header">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="mr-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </Button>
            <h1 className="text-xl font-bold">Dark Odyssey</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Barres de ressources */}
            <div className="flex items-center">
              <span className="mr-2">Niv. {character?.level || 1}</span>
              <div className="w-32">
                <div className="progress-bar">
                  <div 
                    className="progress-bar-fill progress-bar-experience" 
                    style={{ width: `${(character?.experience / character?.experienceToNextLevel) * 100 || 45}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold mr-1">
                <circle cx="12" cy="12" r="8"></circle>
              </svg>
              <span>{character?.gold || 100}</span>
            </div>
            
            <Button variant="outline" size="sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Profil
            </Button>
          </div>
        </div>
      </header>
      
      {/* Contenu principal */}
      <div className="game-content">
        {/* Barre latérale */}
        <aside className={`game-sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Button 
                  variant={activePanel === 'character' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setActivePanel('character')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Personnage
                </Button>
              </li>
              <li>
                <Button 
                  variant={activePanel === 'inventory' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setActivePanel('inventory')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M20 7h-7l-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h15a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z"></path>
                  </svg>
                  Inventaire
                </Button>
              </li>
              <li>
                <Button 
                  variant={activePanel === 'skills' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setActivePanel('skills')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="m12 14 4-4"></path>
                    <path d="M3.34 19a10 10 0 1 1 17.32 0"></path>
                  </svg>
                  Compétences
                </Button>
              </li>
              <li>
                <Button 
                  variant={activePanel === 'map' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setActivePanel('map')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
                    <line x1="9" y1="3" x2="9" y2="18"></line>
                    <line x1="15" y1="6" x2="15" y2="21"></line>
                  </svg>
                  Carte
                </Button>
              </li>
              <li>
                <Button 
                  variant={activePanel === 'shop' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setActivePanel('shop')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <circle cx="8" cy="21" r="1"></circle>
                    <circle cx="19" cy="21" r="1"></circle>
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                  </svg>
                  Boutique
                </Button>
              </li>
              <li>
                <Button 
                  variant={activePanel === 'guild' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setActivePanel('guild')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M18 8a6 6 0 0 0-6-6 6 6 0 0 0-6 6c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                  Guilde
                </Button>
              </li>
              <li>
                <Button 
                  variant={activePanel === 'chat' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setActivePanel('chat')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  Chat
                </Button>
              </li>
              <li>
                <Button 
                  variant={activePanel === 'combat' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setActivePanel('combat')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M14.5 22H18a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h3.5"></path>
                    <path d="M14 2v6h6"></path>
                    <path d="M9.5 17h.01"></path>
                    <path d="M9.5 12h.01"></path>
                  </svg>
                  Combat
                </Button>
              </li>
            </ul>
          </nav>
          
          {/* Contenu du panneau actif */}
          <div className="p-4">
            {activePanel === 'character' && (
              <CharacterPanel 
                character={character}
                onEquipItem={(item) => console.log('Équiper', item)}
                onUnequipItem={(slot) => console.log('Déséquiper', slot)}
                onStatPointAssign={(stat) => console.log('Assigner point', stat)}
              />
            )}
            
            {activePanel === 'inventory' && (
              <InventoryPanel 
                inventory={inventory}
                onUseItem={(item) => console.log('Utiliser', item)}
                onEquipItem={(item) => console.log('Équiper', item)}
                onDropItem={(item) => console.log('Jeter', item)}
              />
            )}
            
            {activePanel === 'chat' && (
              <ChatPanel 
                messages={messages}
                onSendMessage={handleSendMessage}
              />
            )}
            
            {activePanel === 'combat' && (
              <CombatSystem 
                character={character}
                monster={currentMonster}
                onAttack={handleAttack}
                onUseSkill={(skill) => console.log('Utiliser compétence', skill)}
                onUseItem={(item) => console.log('Utiliser objet', item)}
                onFlee={() => {
                  setCurrentMonster(null);
                  setCombatLogs([]);
                }}
                combatLogs={combatLogs}
              />
            )}
            
            {activePanel === 'map' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Carte</h2>
                <div className="bg-secondary/20 rounded p-4 mb-4">
                  <h3 className="text-lg font-bold mb-2">{currentZone?.name || 'Zone inconnue'}</h3>
                  <p className="text-sm mb-2">Niveau: {currentZone?.level || '?'}</p>
                  <p className="text-sm">{currentZone?.description || 'Aucune description disponible.'}</p>
                </div>
                
                <h3 className="font-bold mb-2">Zones connectées</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="w-full">Marais Putrides</Button>
                  <Button variant="outline" className="w-full">Village de Départ</Button>
                </div>
              </div>
            )}
          </div>
        </aside>
        
        {/* Zone principale de jeu */}
        <main className="game-main">
          {/* Canvas du jeu */}
          <GameCanvas 
            currentZone={currentZone}
            character={character}
            monsters={monsters}
            onMonsterClick={handleMonsterClick}
          />
          
          {/* Interface utilisateur superposée */}
          <div className="game-ui">
            {/* Logs de combat */}
            {currentMonster && (
              <div className="absolute bottom-4 left-4 w-64 bg-card/80 backdrop-blur-sm p-2 rounded-lg">
                <h4 className="font-bold mb-1">Journal de combat</h4>
                <div className="text-sm space-y-1">
                  {combatLogs.slice(-3).map((log, index) => (
                    <p key={index} className={
                      log.type === 'player' ? 'text-primary' : 
                      log.type === 'monster' ? 'text-destructive' : ''
                    }>
                      {log.message}
                    </p>
                  ))}
                </div>
              </div>
            )}
            
            {/* Barres de statut du joueur */}
            <div className="absolute top-4 left-4 w-48 space-y-2">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Santé</span>
                  <span>{character?.currentHealth || 100}/{character?.maxHealth || 100}</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-bar-fill progress-bar-health" 
                    style={{ width: `${((character?.currentHealth || 100) / (character?.maxHealth || 100)) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Mana</span>
                  <span>{character?.currentMana || 50}/{character?.maxMana || 50}</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-bar-fill progress-bar-mana" 
                    style={{ width: `${((character?.currentMana || 50) / (character?.maxMana || 50)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Pied de page */}
      <footer className="game-footer">
        <div className="flex justify-between w-full text-sm">
          <div>
            <span>Dark Odyssey v0.1</span>
          </div>
          <div>
            <span>© 2025 Dark Odyssey Team</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

