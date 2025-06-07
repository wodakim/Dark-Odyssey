import { createSlice } from '@reduxjs/toolkit';

// État initial
const initialState = {
  messages: [],
  activeChannel: 'global', // 'global', 'guild', 'local', 'trade', 'whisper'
  channels: [
    { id: 'global', name: 'Global', unread: 0 },
    { id: 'guild', name: 'Guilde', unread: 0 },
    { id: 'local', name: 'Local', unread: 0 },
    { id: 'trade', name: 'Commerce', unread: 0 },
    { id: 'whisper', name: 'Privé', unread: 0 },
  ],
  whisperTarget: null,
  isMinimized: false,
};

// Slice
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      const message = {
        id: Date.now(),
        timestamp: Date.now(),
        ...action.payload,
      };
      
      state.messages.push(message);
      
      // Limiter le nombre de messages à 100
      if (state.messages.length > 100) {
        state.messages.shift();
      }
      
      // Incrémenter le compteur de messages non lus si le canal n'est pas actif
      if (message.channel !== state.activeChannel) {
        const channelIndex = state.channels.findIndex((c) => c.id === message.channel);
        if (channelIndex !== -1) {
          state.channels[channelIndex].unread += 1;
        }
      }
    },
    setActiveChannel: (state, action) => {
      state.activeChannel = action.payload;
      
      // Réinitialiser le compteur de messages non lus pour ce canal
      const channelIndex = state.channels.findIndex((c) => c.id === action.payload);
      if (channelIndex !== -1) {
        state.channels[channelIndex].unread = 0;
      }
    },
    setWhisperTarget: (state, action) => {
      state.whisperTarget = action.payload;
      if (action.payload) {
        state.activeChannel = 'whisper';
      }
    },
    clearWhisperTarget: (state) => {
      state.whisperTarget = null;
      if (state.activeChannel === 'whisper') {
        state.activeChannel = 'global';
      }
    },
    toggleMinimize: (state) => {
      state.isMinimized = !state.isMinimized;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    clearChannelMessages: (state, action) => {
      state.messages = state.messages.filter((message) => message.channel !== action.payload);
    },
  },
});

export const {
  addMessage,
  setActiveChannel,
  setWhisperTarget,
  clearWhisperTarget,
  toggleMinimize,
  clearMessages,
  clearChannelMessages,
} = chatSlice.actions;

export default chatSlice.reducer;

