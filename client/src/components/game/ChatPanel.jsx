import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button.jsx';

const ChatPanel = ({ messages = [], onSendMessage, channels = ['global', 'local', 'guild', 'trade'] }) => {
  const [messageInput, setMessageInput] = useState('');
  const [activeChannel, setActiveChannel] = useState('global');
  const [showEmojis, setShowEmojis] = useState(false);
  const chatContainerRef = useRef(null);
  
  // Liste d'emojis
  const emojis = ['😀', '😂', '😍', '🤔', '😎', '👍', '❤️', '🔥', '⚔️', '🛡️', '✨', '💰', '🧙‍♂️', '👹', '🐉', '🏆'];
  
  // Faire défiler automatiquement vers le bas lorsque de nouveaux messages arrivent
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Fonction pour obtenir la couleur du canal
  const getChannelColor = (channel) => {
    switch (channel) {
      case 'global': return 'text-blue-400';
      case 'local': return 'text-green-400';
      case 'guild': return 'text-purple-400';
      case 'trade': return 'text-yellow-400';
      case 'system': return 'text-red-400';
      case 'whisper': return 'text-pink-400';
      default: return '';
    }
  };
  
  // Fonction pour envoyer un message
  const handleSendMessage = () => {
    if (messageInput.trim() === '') return;
    
    onSendMessage && onSendMessage({
      channel: activeChannel,
      content: messageInput.trim()
    });
    
    setMessageInput('');
    setShowEmojis(false);
  };
  
  // Fonction pour insérer un emoji
  const insertEmoji = (emoji) => {
    setMessageInput(prev => prev + emoji);
  };
  
  // Fonction pour formater le temps
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-bold mb-2">Chat</h2>
      
      {/* Onglets des canaux */}
      <div className="flex mb-2 overflow-x-auto">
        {channels.map(channel => (
          <button
            key={channel}
            className={`px-3 py-1 text-sm whitespace-nowrap ${activeChannel === channel ? 'bg-primary text-primary-foreground rounded' : 'text-muted-foreground'}`}
            onClick={() => setActiveChannel(channel)}
          >
            {channel.charAt(0).toUpperCase() + channel.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Zone de messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 bg-secondary/20 rounded p-2 mb-2 overflow-y-auto"
      >
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            Aucun message dans ce canal.
          </div>
        ) : (
          messages
            .filter(msg => activeChannel === 'all' || msg.channel === activeChannel)
            .map((message, index) => (
              <div key={index} className="mb-2">
                <div className="flex items-start">
                  <span className="text-xs text-muted-foreground mr-1">
                    {formatTime(message.timestamp)}
                  </span>
                  <span className={`font-bold mr-1 ${getChannelColor(message.channel)}`}>
                    [{message.channel}]
                  </span>
                  <span className="font-bold mr-1">
                    {message.sender}:
                  </span>
                  <span className="break-words">{message.content}</span>
                </div>
              </div>
            ))
        )}
      </div>
      
      {/* Zone de saisie */}
      <div className="relative">
        <div className="flex">
          <input 
            type="text" 
            className="flex-1 px-3 py-2 bg-input text-foreground rounded-l-md"
            placeholder={`Écrire dans #${activeChannel}...`}
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <Button 
            variant="ghost"
            className="rounded-none border-y border-r border-input"
            onClick={() => setShowEmojis(!showEmojis)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
              <line x1="9" y1="9" x2="9.01" y2="9"></line>
              <line x1="15" y1="9" x2="15.01" y2="9"></line>
            </svg>
          </Button>
          <Button 
            className="rounded-l-none"
            onClick={handleSendMessage}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m22 2-7 20-4-9-9-4Z"></path>
              <path d="M22 2 11 13"></path>
            </svg>
          </Button>
        </div>
        
        {/* Sélecteur d'emojis */}
        {showEmojis && (
          <div className="absolute bottom-full left-0 right-0 bg-card border border-border rounded p-2 mb-1 grid grid-cols-8 gap-1">
            {emojis.map((emoji, index) => (
              <button
                key={index}
                className="w-8 h-8 flex items-center justify-center hover:bg-secondary rounded"
                onClick={() => insertEmoji(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Aide */}
      <div className="mt-2 text-xs text-muted-foreground">
        <p>Commandes: /w [nom] pour chuchoter, /g pour guilde, /t pour commerce</p>
      </div>
    </div>
  );
};

export default ChatPanel;

