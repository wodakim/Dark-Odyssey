import { createSlice } from '@reduxjs/toolkit';

// État initial
const initialState = {
  activePanel: 'game', // 'game', 'character', 'inventory', 'skills', 'map', 'chat', 'settings'
  notifications: [],
  modals: {
    characterCreation: false,
    itemDetails: false,
    confirmAction: false,
    settings: false,
  },
  modalData: null,
  theme: localStorage.getItem('theme') || 'dark',
  soundEnabled: localStorage.getItem('soundEnabled') !== 'false',
  musicEnabled: localStorage.getItem('musicEnabled') !== 'false',
  volume: parseInt(localStorage.getItem('volume')) || 50,
};

// Slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActivePanel: (state, action) => {
      state.activePanel = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    openModal: (state, action) => {
      const { modalType, modalData } = action.payload;
      state.modals[modalType] = true;
      state.modalData = modalData;
    },
    closeModal: (state, action) => {
      state.modals[action.payload] = false;
      if (Object.values(state.modals).every((modal) => !modal)) {
        state.modalData = null;
      }
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach((modal) => {
        state.modals[modal] = false;
      });
      state.modalData = null;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
      localStorage.setItem('soundEnabled', state.soundEnabled);
    },
    toggleMusic: (state) => {
      state.musicEnabled = !state.musicEnabled;
      localStorage.setItem('musicEnabled', state.musicEnabled);
    },
    setVolume: (state, action) => {
      state.volume = action.payload;
      localStorage.setItem('volume', action.payload);
    },
  },
});

export const {
  setActivePanel,
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  closeAllModals,
  setTheme,
  toggleSound,
  toggleMusic,
  setVolume,
} = uiSlice.actions;

export default uiSlice.reducer;

