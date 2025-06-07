import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import characterService from '../../services/character.service';

// État initial
const initialState = {
  characters: [],
  currentCharacter: null,
  isLoading: false,
  error: null,
};

// Actions asynchrones
export const fetchCharacters = createAsyncThunk(
  'character/fetchCharacters',
  async (_, { rejectWithValue }) => {
    try {
      const response = await characterService.getCharacters();
      
      if (response.status && response.status !== 200) {
        return rejectWithValue(response.message || 'Erreur lors de la récupération des personnages');
      }
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors de la récupération des personnages');
    }
  }
);

export const fetchCharacterById = createAsyncThunk(
  'character/fetchCharacterById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await characterService.getCharacterById(id);
      
      if (response.status && response.status !== 200) {
        return rejectWithValue(response.message || 'Erreur lors de la récupération du personnage');
      }
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors de la récupération du personnage');
    }
  }
);

export const createCharacter = createAsyncThunk(
  'character/createCharacter',
  async (characterData, { rejectWithValue }) => {
    try {
      const response = await characterService.createCharacter(characterData);
      
      if (response.status && response.status !== 201) {
        return rejectWithValue(response.message || 'Erreur lors de la création du personnage');
      }
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors de la création du personnage');
    }
  }
);

export const updateCharacter = createAsyncThunk(
  'character/updateCharacter',
  async ({ id, characterData }, { rejectWithValue }) => {
    try {
      const response = await characterService.updateCharacter(id, characterData);
      
      if (response.status && response.status !== 200) {
        return rejectWithValue(response.message || 'Erreur lors de la mise à jour du personnage');
      }
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors de la mise à jour du personnage');
    }
  }
);

export const deleteCharacter = createAsyncThunk(
  'character/deleteCharacter',
  async (id, { rejectWithValue }) => {
    try {
      const response = await characterService.deleteCharacter(id);
      
      if (response.status && response.status !== 200) {
        return rejectWithValue(response.message || 'Erreur lors de la suppression du personnage');
      }
      
      return { id, ...response };
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors de la suppression du personnage');
    }
  }
);

export const assignStatPoint = createAsyncThunk(
  'character/assignStatPoint',
  async ({ id, statData }, { rejectWithValue }) => {
    try {
      const response = await characterService.assignStatPoint(id, statData);
      
      if (response.status && response.status !== 200) {
        return rejectWithValue(response.message || 'Erreur lors de l\'assignation du point de statistique');
      }
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors de l\'assignation du point de statistique');
    }
  }
);

export const updateAppearance = createAsyncThunk(
  'character/updateAppearance',
  async ({ id, appearanceData }, { rejectWithValue }) => {
    try {
      const response = await characterService.updateAppearance(id, appearanceData);
      
      if (response.status && response.status !== 200) {
        return rejectWithValue(response.message || 'Erreur lors de la mise à jour de l\'apparence');
      }
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors de la mise à jour de l\'apparence');
    }
  }
);

export const equipItem = createAsyncThunk(
  'character/equipItem',
  async ({ id, equipData }, { rejectWithValue }) => {
    try {
      const response = await characterService.equipItem(id, equipData);
      
      if (response.status && response.status !== 200) {
        return rejectWithValue(response.message || 'Erreur lors de l\'équipement de l\'objet');
      }
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors de l\'équipement de l\'objet');
    }
  }
);

export const unequipItem = createAsyncThunk(
  'character/unequipItem',
  async ({ id, unequipData }, { rejectWithValue }) => {
    try {
      const response = await characterService.unequipItem(id, unequipData);
      
      if (response.status && response.status !== 200) {
        return rejectWithValue(response.message || 'Erreur lors du déséquipement de l\'objet');
      }
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors du déséquipement de l\'objet');
    }
  }
);

// Slice
const characterSlice = createSlice({
  name: 'character',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentCharacter: (state, action) => {
      state.currentCharacter = action.payload;
    },
    clearCurrentCharacter: (state) => {
      state.currentCharacter = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Characters
      .addCase(fetchCharacters.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCharacters.fulfilled, (state, action) => {
        state.isLoading = false;
        state.characters = action.payload;
      })
      .addCase(fetchCharacters.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch Character By Id
      .addCase(fetchCharacterById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCharacterById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCharacter = action.payload;
      })
      .addCase(fetchCharacterById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Create Character
      .addCase(createCharacter.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCharacter.fulfilled, (state, action) => {
        state.isLoading = false;
        state.characters.push(action.payload);
        state.currentCharacter = action.payload;
      })
      .addCase(createCharacter.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update Character
      .addCase(updateCharacter.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCharacter.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.characters.findIndex(char => char._id === action.payload._id);
        if (index !== -1) {
          state.characters[index] = action.payload;
        }
        if (state.currentCharacter && state.currentCharacter._id === action.payload._id) {
          state.currentCharacter = action.payload;
        }
      })
      .addCase(updateCharacter.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Delete Character
      .addCase(deleteCharacter.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCharacter.fulfilled, (state, action) => {
        state.isLoading = false;
        state.characters = state.characters.filter(char => char._id !== action.payload.id);
        if (state.currentCharacter && state.currentCharacter._id === action.payload.id) {
          state.currentCharacter = null;
        }
      })
      .addCase(deleteCharacter.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Assign Stat Point
      .addCase(assignStatPoint.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(assignStatPoint.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.currentCharacter && state.currentCharacter._id === action.payload._id) {
          state.currentCharacter = action.payload;
        }
        const index = state.characters.findIndex(char => char._id === action.payload._id);
        if (index !== -1) {
          state.characters[index] = action.payload;
        }
      })
      .addCase(assignStatPoint.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update Appearance
      .addCase(updateAppearance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateAppearance.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.currentCharacter && state.currentCharacter._id === action.payload._id) {
          state.currentCharacter = action.payload;
        }
        const index = state.characters.findIndex(char => char._id === action.payload._id);
        if (index !== -1) {
          state.characters[index] = action.payload;
        }
      })
      .addCase(updateAppearance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Equip Item
      .addCase(equipItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(equipItem.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.currentCharacter && state.currentCharacter._id === action.payload._id) {
          state.currentCharacter = action.payload;
        }
        const index = state.characters.findIndex(char => char._id === action.payload._id);
        if (index !== -1) {
          state.characters[index] = action.payload;
        }
      })
      .addCase(equipItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Unequip Item
      .addCase(unequipItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(unequipItem.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.currentCharacter && state.currentCharacter._id === action.payload._id) {
          state.currentCharacter = action.payload;
        }
        const index = state.characters.findIndex(char => char._id === action.payload._id);
        if (index !== -1) {
          state.characters[index] = action.payload;
        }
      })
      .addCase(unequipItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setCurrentCharacter, clearCurrentCharacter } = characterSlice.actions;

export default characterSlice.reducer;

