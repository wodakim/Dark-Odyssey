import { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';

const InventoryPanel = ({ inventory, onUseItem, onEquipItem, onDropItem }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [sortBy, setSortBy] = useState('default');
  
  // Vérifier si l'inventaire est défini
  if (!inventory) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Inventaire</h2>
        <p>Chargement de l'inventaire...</p>
      </div>
    );
  }
  
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
  
  // Fonction pour obtenir l'icône d'un type d'objet
  const getItemTypeIcon = (type, subtype) => {
    switch (type) {
      case 'weapon':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 22H18a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h3.5"></path>
            <path d="M14 2v6h6"></path>
            <path d="M9.5 17h.01"></path>
            <path d="M9.5 12h.01"></path>
          </svg>
        );
      case 'armor':
        if (subtype === 'helmet') {
          return (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
            </svg>
          );
        } else if (subtype === 'chest') {
          return (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"></path>
            </svg>
          );
        } else if (subtype === 'legs') {
          return (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m18 3-3 1.5-3-1.5-3 1.5L6 3v14l3 1.5 3-1.5 3 1.5 3-1.5V3Z"></path>
            </svg>
          );
        } else if (subtype === 'feet') {
          return (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
            </svg>
          );
        } else if (subtype === 'shield') {
          return (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22a8 8 0 0 0 8-8"></path>
              <path d="M20 10c0-4.4-3.6-8-8-8s-8 3.6-8 8 3.6 8 8 8"></path>
              <path d="M15 9c0 1.7-1.3 3-3 3s-3-1.3-3-3 1.3-3 3-3 3 1.3 3 3Z"></path>
            </svg>
          );
        }
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2"></rect>
          </svg>
        );
      case 'accessory':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="4"></circle>
          </svg>
        );
      case 'consumable':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5.5 8.5 9 12l-3.5 3.5L2 12l3.5-3.5Z"></path>
            <path d="m12 2 3.5 3.5L12 9 8.5 5.5 12 2Z"></path>
            <path d="M18.5 8.5 22 12l-3.5 3.5L15 12l3.5-3.5Z"></path>
            <path d="m12 15 3.5 3.5L12 22l-3.5-3.5L12 15Z"></path>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2"></rect>
          </svg>
        );
    }
  };
  
  // Trier l'inventaire
  const sortedInventory = [...inventory].sort((a, b) => {
    switch (sortBy) {
      case 'rarity':
        const rarityOrder = { common: 0, rare: 1, epic: 2, legendary: 3, mythic: 4 };
        return rarityOrder[b.rarity] - rarityOrder[a.rarity];
      case 'type':
        return a.type.localeCompare(b.type);
      case 'level':
        return b.requiredLevel - a.requiredLevel;
      case 'value':
        return b.value - a.value;
      default:
        return 0;
    }
  });
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Inventaire</h2>
      
      {/* Options de tri */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm">
          {inventory.length}/{inventory.maxSize || 20} emplacements
        </div>
        <div className="flex items-center">
          <span className="text-sm mr-2">Trier par:</span>
          <select 
            className="bg-secondary text-sm p-1 rounded"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Défaut</option>
            <option value="rarity">Rareté</option>
            <option value="type">Type</option>
            <option value="level">Niveau</option>
            <option value="value">Valeur</option>
          </select>
        </div>
      </div>
      
      {/* Grille d'inventaire */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {sortedInventory.map((item, index) => (
          <div 
            key={index}
            className={`w-12 h-12 bg-secondary rounded flex items-center justify-center cursor-pointer relative ${selectedItem === index ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setSelectedItem(selectedItem === index ? null : index)}
          >
            {getItemTypeIcon(item.type, item.subtype)}
            
            {/* Indicateur de rareté */}
            {item.rarity !== 'common' && (
              <div className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ${
                item.rarity === 'rare' ? 'bg-rare' : 
                item.rarity === 'epic' ? 'bg-epic' : 
                item.rarity === 'legendary' ? 'bg-legendary' : 
                'bg-mythic animate-pulse'
              }`}></div>
            )}
          </div>
        ))}
        
        {/* Emplacements vides */}
        {Array.from({ length: (inventory.maxSize || 20) - inventory.length }).map((_, index) => (
          <div 
            key={`empty-${index}`}
            className="w-12 h-12 bg-secondary/30 rounded border border-dashed border-secondary"
          ></div>
        ))}
      </div>
      
      {/* Détails de l'objet sélectionné */}
      {selectedItem !== null && (
        <div className="bg-card p-3 rounded mb-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className={`font-bold ${getRarityClass(sortedInventory[selectedItem].rarity)}`}>
              {sortedInventory[selectedItem].name}
            </h3>
            <div className="text-sm">
              {sortedInventory[selectedItem].type === 'weapon' ? 'Arme' : 
               sortedInventory[selectedItem].type === 'armor' ? 'Armure' : 
               sortedInventory[selectedItem].type === 'accessory' ? 'Accessoire' : 
               'Consommable'}
            </div>
          </div>
          
          <p className="text-sm mb-3">{sortedInventory[selectedItem].description}</p>
          
          {/* Statistiques de l'objet */}
          {(sortedInventory[selectedItem].type === 'weapon' || 
            sortedInventory[selectedItem].type === 'armor' || 
            sortedInventory[selectedItem].type === 'accessory') && (
            <div className="grid grid-cols-2 gap-1 text-sm mb-3">
              {Object.entries(sortedInventory[selectedItem].stats || {}).map(([stat, value]) => (
                value !== 0 && (
                  <div key={stat} className="flex justify-between">
                    <span>{stat.charAt(0).toUpperCase() + stat.slice(1)}</span>
                    <span className={value > 0 ? 'text-green-500' : 'text-red-500'}>
                      {value > 0 ? `+${value}` : value}
                    </span>
                  </div>
                )
              ))}
            </div>
          )}
          
          {/* Effets de l'objet */}
          {sortedInventory[selectedItem].effects && sortedInventory[selectedItem].effects.length > 0 && (
            <div className="mb-3">
              <h4 className="text-sm font-medium mb-1">Effets</h4>
              <ul className="text-sm list-disc list-inside">
                {sortedInventory[selectedItem].effects.map((effect, i) => (
                  <li key={i} className="text-accent">{effect}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="flex justify-between text-sm mb-3">
            <span>Niveau requis: {sortedInventory[selectedItem].requiredLevel || 1}</span>
            <span>{sortedInventory[selectedItem].value} or</span>
          </div>
          
          {/* Actions */}
          <div className="flex space-x-2">
            {(sortedInventory[selectedItem].type === 'weapon' || 
              sortedInventory[selectedItem].type === 'armor' || 
              sortedInventory[selectedItem].type === 'accessory') && (
              <Button 
                className="flex-1"
                onClick={() => {
                  onEquipItem && onEquipItem(sortedInventory[selectedItem]);
                  setSelectedItem(null);
                }}
              >
                Équiper
              </Button>
            )}
            
            {sortedInventory[selectedItem].type === 'consumable' && (
              <Button 
                className="flex-1"
                onClick={() => {
                  onUseItem && onUseItem(sortedInventory[selectedItem]);
                  setSelectedItem(null);
                }}
              >
                Utiliser
              </Button>
            )}
            
            <Button 
              variant="outline"
              className="flex-1"
              onClick={() => {
                onDropItem && onDropItem(sortedInventory[selectedItem]);
                setSelectedItem(null);
              }}
            >
              Jeter
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPanel;

