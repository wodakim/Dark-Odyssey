import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import combatService from '../../services/combat.service';

// État initial
const initialState = {
  inCombat: false,
  combatData: null,
  character: null,
  monster: null,
  turn: 0,
  logs: [],
  rewards: null,
  isLoading: false,
  error: null,
};

// Actions asynchrones
export const startCombat = createAsyncThunk(
  'combat/startCombat',
  async (combatData, { rejectWithValue }) => {
    try {
      const response = await combatService.startCombat(combatData);
      
      if (response.status && response.status !== 200) {
        return rejectWithValue(response.message || 'Erreur lors du démarrage du combat');
      }
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors du démarrage du combat');
    }
  }
);

export const attack = createAsyncThunk(
  'combat/attack',
  async (_, { rejectWithValue }) => {
    try {
      const response = await combatService.attack();
      
      if (response.status && response.status !== 200) {
        return rejectWithValue(response.message || 'Erreur lors de l\'attaque');
      }
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors de l\'attaque');
    }
  }
);

export const useSkill = createAsyncThunk(
  'combat/useSkill',
  async ({ skillId, skillData }, { rejectWithValue }) => {
    try {
      const response = await combatService.useSkill(skillId, skillData);
      
      if (response.status && response.status !== 200) {
        return rejectWithValue(response.message || 'Erreur lors de l\'utilisation de la compétence');
      }
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors de l\'utilisation de la compétence');
    }
  }
);

export const useItem = createAsyncThunk(
  'combat/useItem',
  async ({ itemId, itemData }, { rejectWithValue }) => {
    try {
      const response = await combatService.useItem(itemId, itemData);
      
      if (response.status && response.status !== 200) {
        return rejectWithValue(response.message || 'Erreur lors de l\'utilisation de l\'objet');
      }
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors de l\'utilisation de l\'objet');
    }
  }
);

export const flee = createAsyncThunk(
  'combat/flee',
  async (_, { rejectWithValue }) => {
    try {
      const response = await combatService.flee();
      
      if (response.status && response.status !== 200) {
        return rejectWithValue(response.message || 'Erreur lors de la fuite');
      }
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors de la fuite');
    }
  }
);

export const getCombatStatus = createAsyncThunk(
  'combat/getCombatStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await combatService.getCombatStatus();
      
      if (response.status && response.status !== 200) {
        return rejectWithValue(response.message || 'Erreur lors de la récupération du statut du combat');
      }
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors de la récupération du statut du combat');
    }
  }
);

// Slice
const combatSlice = createSlice({
  name: 'combat',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addCombatLog: (state, action) => {
      state.logs.push(action.payload);
    },
    clearCombat: (state) => {
      state.inCombat = false;
      state.combatData = null;
      state.character = null;
      state.monster = null;
      state.turn = 0;
      state.logs = [];
      state.rewards = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Start Combat
      .addCase(startCombat.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startCombat.fulfilled, (state, action) => {
        state.isLoading = false;
        state.inCombat = true;
        state.combatData = action.payload;
        state.character = action.payload.character;
        state.monster = action.payload.monster;
        state.turn = action.payload.turn;
        state.logs = action.payload.logs || [];
      })
      .addCase(startCombat.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Attack
      .addCase(attack.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(attack.fulfilled, (state, action) => {
        state.isLoading = false;
        state.combatData = action.payload;
        state.character = action.payload.character;
        state.monster = action.payload.monster;
        state.turn = action.payload.turn;
        
        if (action.payload.logs) {
          state.logs = [...state.logs, ...action.payload.logs];
        }
        
        if (action.payload.rewards) {
          state.rewards = action.payload.rewards;
          state.inCombat = false;
        }
      })
      .addCase(attack.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Use Skill
      .addCase(useSkill.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(useSkill.fulfilled, (state, action) => {
        state.isLoading = false;
        state.combatData = action.payload;
        state.character = action.payload.character;
        state.monster = action.payload.monster;
        state.turn = action.payload.turn;
        
        if (action.payload.logs) {
          state.logs = [...state.logs, ...action.payload.logs];
        }
        
        if (action.payload.rewards) {
          state.rewards = action.payload.rewards;
          state.inCombat = false;
        }
      })
      .addCase(useSkill.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Use Item
      .addCase(useItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(useItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.combatData = action.payload;
        state.character = action.payload.character;
        state.monster = action.payload.monster;
        state.turn = action.payload.turn;
        
        if (action.payload.logs) {
          state.logs = [...state.logs, ...action.payload.logs];
        }
      })
      .addCase(useItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Flee
      .addCase(flee.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(flee.fulfilled, (state, action) => {
        state.isLoading = false;
        
        if (action.payload.success) {
          state.inCombat = false;
          state.combatData = null;
          state.character = null;
          state.monster = null;
          state.turn = 0;
          state.logs = [];
          state.rewards = null;
        } else {
          state.combatData = action.payload;
          state.character = action.payload.character;
          state.monster = action.payload.monster;
          state.turn = action.payload.turn;
          
          if (action.payload.logs) {
            state.logs = [...state.logs, ...action.payload.logs];
          }
        }
      })
      .addCase(flee.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Get Combat Status
      .addCase(getCombatStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCombatStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        
        if (action.payload.inCombat) {
          state.inCombat = true;
          state.combatData = action.payload;
          state.character = action.payload.character;
          state.monster = action.payload.monster;
          state.turn = action.payload.turn;
          state.logs = action.payload.logs || [];
        } else {
          state.inCombat = false;
        }
      })
      .addCase(getCombatStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, addCombatLog, clearCombat } = combatSlice.actions;

export default combatSlice.reducer;

