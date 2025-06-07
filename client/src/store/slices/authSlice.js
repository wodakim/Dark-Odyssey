import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/auth.service';

// État initial
const initialState = {
  user: authService.getCurrentUser(),
  token: authService.getToken(),
  isLoggedIn: authService.isLoggedIn(),
  isLoading: false,
  error: null,
};

// Actions asynchrones
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      
      if (response.status && response.status !== 201) {
        return rejectWithValue(response.message || 'Erreur lors de l\'inscription');
      }
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors de l\'inscription');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      
      if (response.status && response.status !== 200) {
        return rejectWithValue(response.message || 'Erreur lors de la connexion');
      }
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors de la connexion');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.logout();
      
      if (response.status && response.status !== 200) {
        return rejectWithValue(response.message || 'Erreur lors de la déconnexion');
      }
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors de la déconnexion');
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.refreshToken();
      
      if (response.status && response.status !== 200) {
        return rejectWithValue(response.message || 'Erreur lors du rafraîchissement du token');
      }
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Erreur lors du rafraîchissement du token');
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.isLoggedIn = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.isLoggedIn = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isLoggedIn = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        // Même en cas d'erreur, on déconnecte l'utilisateur
        state.user = null;
        state.token = null;
        state.isLoggedIn = false;
      })
      
      // Refresh Token
      .addCase(refreshToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        // En cas d'erreur de rafraîchissement, on déconnecte l'utilisateur
        state.user = null;
        state.token = null;
        state.isLoggedIn = false;
      });
  },
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;

