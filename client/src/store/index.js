import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import characterReducer from './slices/characterSlice';
import combatReducer from './slices/combatSlice';
import gameReducer from './slices/gameSlice';
import uiReducer from './slices/uiSlice';
import chatReducer from './slices/chatSlice';

/**
 * Store Redux
 */
const store = configureStore({
  reducer: {
    auth: authReducer,
    character: characterReducer,
    combat: combatReducer,
    game: gameReducer,
    ui: uiReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;

