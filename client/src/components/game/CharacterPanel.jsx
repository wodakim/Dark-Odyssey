import { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';

const CharacterPanel = ({ character, onEquipItem, onUnequipItem, onStatPointAssign }) => {
  const [activeTab, setActiveTab] = useState('stats');
  
  // Vérifier si le personnage est défini
  if (!character) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Personnage</h2>
        <p>Chargement des données du personnage...</p>
      </div>
    );
  }
  
  const { name, level, race, stats, equipment, unassignedPoints } = character;
  
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
  
  // Fonction pour obtenir l'icône d'un emplacement d'équipement
  const getEquipmentSlotIcon = (slot) => {
    switch (slot) {
      case 'head':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
          </svg>
        );
      case 'chest':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"></path>
          </svg>
        );
      case 'legs':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m18 3-3 1.5-3-1.5-3 1.5L6 3v14l3 1.5 3-1.5 3 1.5 3-1.5V3Z"></path>
          </svg>
        );
      case 'feet':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
          </svg>
        );
      case 'weapon':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 22H18a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h3.5"></path>
            <path d="M14 2v6h6"></path>
            <path d="M9.5 17h.01"></path>
            <path d="M9.5 12h.01"></path>
          </svg>
        );
      case 'offhand':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22a8 8 0 0 0 8-8"></path>
            <path d="M20 10c0-4.4-3.6-8-8-8s-8 3.6-8 8 3.6 8 8 8"></path>
            <path d="M15 9c0 1.7-1.3 3-3 3s-3-1.3-3-3 1.3-3 3-3 3 1.3 3 3Z"></path>
          </svg>
        );
      case 'accessory1':
      case 'accessory2':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="4"></circle>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2"></rect>
            <path d="M3 9h18"></path>
            <path d="M3 15h18"></path>
            <path d="M9 3v18"></path>
            <path d="M15 3v18"></path>
          </svg>
        );
    }
  };
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Personnage</h2>
      
      {/* En-tête du personnage */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <div>
          <h3 className="font-bold">{name || 'Aventurier'}</h3>
          <p className="text-sm">Niveau {level || 1} • {race || 'Humain'}</p>
        </div>
      </div>
      
      {/* Onglets */}
      <div className="flex border-b mb-4">
        <button 
          className={`px-4 py-2 ${activeTab === 'stats' ? 'border-b-2 border-primary font-medium' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          Statistiques
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'equipment' ? 'border-b-2 border-primary font-medium' : ''}`}
          onClick={() => setActiveTab('equipment')}
        >
          Équipement
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'appearance' ? 'border-b-2 border-primary font-medium' : ''}`}
          onClick={() => setActiveTab('appearance')}
        >
          Apparence
        </button>
      </div>
      
      {/* Contenu de l'onglet Statistiques */}
      {activeTab === 'stats' && (
        <div>
          {unassignedPoints > 0 && (
            <div className="mb-4 p-2 bg-primary/20 rounded">
              <p className="text-sm">Points disponibles: {unassignedPoints}</p>
            </div>
          )}
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Force</span>
              <div className="flex items-center">
                <span className="w-8 text-right">{stats?.strength || 10}</span>
                {unassignedPoints > 0 && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="w-6 h-6 ml-2"
                    onClick={() => onStatPointAssign && onStatPointAssign('strength')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14"></path>
                      <path d="M5 12h14"></path>
                    </svg>
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Dextérité</span>
              <div className="flex items-center">
                <span className="w-8 text-right">{stats?.dexterity || 8}</span>
                {unassignedPoints > 0 && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="w-6 h-6 ml-2"
                    onClick={() => onStatPointAssign && onStatPointAssign('dexterity')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14"></path>
                      <path d="M5 12h14"></path>
                    </svg>
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Intelligence</span>
              <div className="flex items-center">
                <span className="w-8 text-right">{stats?.intelligence || 12}</span>
                {unassignedPoints > 0 && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="w-6 h-6 ml-2"
                    onClick={() => onStatPointAssign && onStatPointAssign('intelligence')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14"></path>
                      <path d="M5 12h14"></path>
                    </svg>
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Vitalité</span>
              <div className="flex items-center">
                <span className="w-8 text-right">{stats?.vitality || 9}</span>
                {unassignedPoints > 0 && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="w-6 h-6 ml-2"
                    onClick={() => onStatPointAssign && onStatPointAssign('vitality')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14"></path>
                      <path d="M5 12h14"></path>
                    </svg>
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Chance</span>
              <div className="flex items-center">
                <span className="w-8 text-right">{stats?.luck || 7}</span>
                {unassignedPoints > 0 && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="w-6 h-6 ml-2"
                    onClick={() => onStatPointAssign && onStatPointAssign('luck')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14"></path>
                      <path d="M5 12h14"></path>
                    </svg>
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="font-medium mb-2">Statistiques dérivées</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span>Attaque</span>
                <span>{(stats?.strength || 10) * 2 + (stats?.dexterity || 8)}</span>
              </div>
              <div className="flex justify-between">
                <span>Défense</span>
                <span>{(stats?.vitality || 9) * 1.5 + (stats?.strength || 10) * 0.5}</span>
              </div>
              <div className="flex justify-between">
                <span>Critique</span>
                <span>{(stats?.luck || 7) * 0.5 + (stats?.dexterity || 8) * 0.2}%</span>
              </div>
              <div className="flex justify-between">
                <span>Esquive</span>
                <span>{(stats?.dexterity || 8) * 0.3 + (stats?.luck || 7) * 0.1}%</span>
              </div>
              <div className="flex justify-between">
                <span>PV Max</span>
                <span>{(stats?.vitality || 9) * 10 + level * 5}</span>
              </div>
              <div className="flex justify-between">
                <span>Mana Max</span>
                <span>{(stats?.intelligence || 12) * 8 + level * 3}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Contenu de l'onglet Équipement */}
      {activeTab === 'equipment' && (
        <div>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries({
              head: 'Tête',
              chest: 'Torse',
              legs: 'Jambes',
              feet: 'Pieds',
              weapon: 'Arme',
              offhand: 'Bouclier',
              accessory1: 'Accessoire 1',
              accessory2: 'Accessoire 2'
            }).map(([slot, label]) => {
              const item = equipment?.[slot];
              
              return (
                <div key={slot} className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-secondary rounded flex items-center justify-center">
                    {getEquipmentSlotIcon(slot)}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    {item ? (
                      <div className="flex justify-between items-center">
                        <span className={`truncate ${getRarityClass(item.rarity)}`}>
                          {item.name}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="w-6 h-6 ml-1 flex-shrink-0"
                          onClick={() => onUnequipItem && onUnequipItem(slot)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18"></path>
                            <path d="m6 6 12 12"></path>
                          </svg>
                        </Button>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">{label}: -</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Statistiques d'équipement */}
          <div className="mt-6">
            <h4 className="font-medium mb-2">Bonus d'équipement</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span>Force</span>
                <span>+0</span>
              </div>
              <div className="flex justify-between">
                <span>Dextérité</span>
                <span>+0</span>
              </div>
              <div className="flex justify-between">
                <span>Intelligence</span>
                <span>+0</span>
              </div>
              <div className="flex justify-between">
                <span>Vitalité</span>
                <span>+0</span>
              </div>
              <div className="flex justify-between">
                <span>Chance</span>
                <span>+0</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Contenu de l'onglet Apparence */}
      {activeTab === 'appearance' && (
        <div>
          <p className="mb-4">Personnalisez l'apparence de votre personnage.</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Style de cheveux</label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((style) => (
                  <div 
                    key={style}
                    className={`w-12 h-12 bg-secondary rounded flex items-center justify-center cursor-pointer ${character.appearance?.hairStyle === style ? 'ring-2 ring-primary' : ''}`}
                  >
                    {style}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Couleur de cheveux</label>
              <div className="grid grid-cols-6 gap-2">
                {['#000000', '#6D4C41', '#D4B996', '#C0392B', '#8E44AD', '#3498DB'].map((color) => (
                  <div 
                    key={color}
                    className={`w-8 h-8 rounded cursor-pointer ${character.appearance?.hairColor === color ? 'ring-2 ring-primary' : ''}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Couleur de peau</label>
              <div className="grid grid-cols-6 gap-2">
                {['#FFF6E9', '#F8D5C2', '#E0AC69', '#C68642', '#8D5524', '#5C3317'].map((color) => (
                  <div 
                    key={color}
                    className={`w-8 h-8 rounded cursor-pointer ${character.appearance?.skinColor === color ? 'ring-2 ring-primary' : ''}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Style de visage</label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((style) => (
                  <div 
                    key={style}
                    className={`w-12 h-12 bg-secondary rounded flex items-center justify-center cursor-pointer ${character.appearance?.faceStyle === style ? 'ring-2 ring-primary' : ''}`}
                  >
                    {style}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <Button className="w-full mt-6">
            Sauvegarder les changements
          </Button>
        </div>
      )}
    </div>
  );
};

export default CharacterPanel;

