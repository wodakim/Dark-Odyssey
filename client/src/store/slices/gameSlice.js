import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/api.service';
import { API_ENDPOINTS } from '../../config/api';
import authService from '../../services/auth.service';

// État initial
const initialState = {
  zones: [],
  currentZone: null,
  monsters: [],
  items: [],
  events: [],
  isLoading: false,
  error: null,
};

// Actions asynchrones
export const fetchZones = createAsyncThunk(
  'game/fetchZones',
  async (_, { rejectWithValue }) => {
    try {
      const token = authService.getToken();
      const response = await apiService.get(API_ENDPOINTS.zones.list, { token });
      
      if (response.status && response.status !== 200) {
        return rejectWithValue(response.message || 'Erreur lors de la récupération des zones');
      }
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors de la récupération des zones');
    }
  }
);

export const fetchZoneById = createAsyncThunk(
  'game/fetchZoneById',
  async (id, { rejectWithValue }) => {
    try {
      const token = authService.getToken();
      const response = await apiService.get(API_ENDPOINTS.zones.get(id), { token });
      
      if (response.status && response.status !== 200) {
        return rejectWithValue(response.message || 'Erreur lors de la récupération de la zone');
      }
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors de la récupération de la zone');
    }
  }
);

export const exploreZone = createAsyncThunk(
  'game/exploreZone',
  async (id, { rejectWithValue }) => {
    try {
      const token = authService.getToken();
      const response = await apiService.post(API_ENDPOINTS.zones.explore(id), {}, { token });
      
      if (response.status && response.status !== 200) {
        return rejectWithValue(response.message || 'Erreur lors de l\'exploration de la zone');
      }
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors de l\'exploration de la zone');
    }
  }
);

export const travelToZone = createAsyncThunk(
  'game/travelToZone',
  async (id, { rejectWithValue }) => {
    try {
      const token = authService.getToken();
      const response = await apiService.post(API_ENDPOINTS.zones.travel(id), {}, { token });
      
      if (response.status && response.status !== 200) {
        return rejectWithValue(response.message || 'Erreur lors du voyage vers la zone');
      }
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors du voyage vers la zone');
    }
  }
);

export const fetchMonsters = createAsyncThunk(
  'game/fetchMonsters',
  async (_, { rejectWithValue }) => {
    try {
      const token = authService.getToken();
      const response = await apiService.get(API_ENDPOINTS.monsters.list, { token });
      
      if (response.status && response.status !== 200) {
        return rejectWithValue(response.message || 'Erreur lors de la récupération des monstres');
      }
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors de la récupération des monstres');
    }
  }
);

export const fetchMonstersByZone = createAsyncThunk(
  'game/fetchMonstersByZone',
  async (zoneId, { rejectWithValue }) => {
    try {
      const token = authService.getToken();
      const response = await apiService.get(API_ENDPOINTS.monsters.byZone(zoneId), { token });
      
      if (response.status && response.status !== 200) {
        return rejectWithValue(response.message || 'Erreur lors de la récupération des monstres de la zone');
      }
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors de la récupération des monstres de la zone');
    }
  }
);

export const fetchItems = createAsyncThunk(
  'game/fetchItems',
  async (_, { rejectWithValue }) => {
    try {
      const token = authService.getToken();
      const response = await apiService.get(API_ENDPOINTS.items.list, { token });
      
      if (response.status && response.status !== 200) {
        return rejectWithValue(response.message || 'Erreur lors de la récupération des objets');
      }
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors de la récupération des objets');
    }
  }
);

export const useItem = createAsyncThunk(
  'game/useItem',
  async (itemId, { rejectWithValue }) => {
    try {
      const token = authService.getToken();
      const response = await apiService.post(API_ENDPOINTS.items.use(itemId), {}, { token });
      
      if (response.status && response.status !== 200) {
        return rejectWithValue(response.message || 'Erreur lors de l\'utilisation de l\'objet');
      }
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors de l\'utilisation de l\'objet');
    }
  }
);

export const sellItem = createAsyncThunk(
  'game/sellItem',
  async (itemId, { rejectWithValue }) => {
    try {
      const token = authService.getToken();
      const response = await apiService.post(API_ENDPOINTS.items.sell(itemId), {}, { token });
      
      if (response.status && response.status !== 200) {
        return rejectWithValue(response.message || 'Erreur lors de la vente de l\'objet');
      }
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors de la vente de l\'objet');
    }
  }
);

export const buyItem = createAsyncThunk(
  'game/buyItem',
  async (itemId, { rejectWithValue }) => {
    try {
      const token = authService.getToken();
      const response = await apiService.post(API_ENDPOINTS.items.buy(itemId), {}, { token });
      
      if (response.status && response.status !== 200) {
        return rejectWithValue(response.message || 'Erreur lors de l\'achat de l\'objet');
      }
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors de l\'achat de l\'objet');
    }
  }
);

// Slice
const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentZone: (state, action) => {
      state.currentZone = action.payload;
    },
    addEvent: (state, action) => {
      state.events.push(action.payload);
    },
    clearEvents: (state) => {
      state.events = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Zones
      .addCase(fetchZones.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchZones.fulfilled, (state, action) => {
        state.isLoading = false;
        state.zones = action.payload;
      })
      .addCase(fetchZones.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch Zone By Id
      .addCase(fetchZoneById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchZoneById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentZone = action.payload;
      })
      .addCase(fetchZoneById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Explore Zone
      .addCase(exploreZone.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(exploreZone.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.event) {
          state.events.push(action.payload.event);
        }
      })
      .addCase(exploreZone.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Travel To Zone
      .addCase(travelToZone.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(travelToZone.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentZone = action.payload.zone;
        state.events = [];
      })
      .addCase(travelToZone.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch Monsters
      .addCase(fetchMonsters.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMonsters.fulfilled, (state, action) => {
        state.isLoading = false;
        state.monsters = action.payload;
      })
      .addCase(fetchMonsters.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch Monsters By Zone
      .addCase(fetchMonstersByZone.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMonstersByZone.fulfilled, (state, action) => {
        state.isLoading = false;
        state.monsters = action.payload;
      })
      .addCase(fetchMonstersByZone.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch Items
      .addCase(fetchItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Use Item
      .addCase(useItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(useItem.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(useItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Sell Item
      .addCase(sellItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sellItem.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(sellItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Buy Item
      .addCase(buyItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(buyItem.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(buyItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setCurrentZone, addEvent, clearEvents } = gameSlice.actions;

export default gameSlice.reducer;

