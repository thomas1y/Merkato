import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock API call - will replace with real API later
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      // Mock successful login (demo credentials)
      if (email === 'demo@merkato.com' && password === 'password123') {
        return {
          user: {
            id: 'usr_123',
            name: 'Demo User',
            email: 'demo@merkato.com',
            avatar: null,
            role: 'customer',
            createdAt: new Date().toISOString()
          },
          token: 'mock_jwt_token_' + Date.now()
        };
      }
      
      throw new Error('Invalid email or password');
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, password, confirmPassword }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validation
      if (!name || !email || !password) {
        throw new Error('All fields are required');
      }
      
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      // Mock successful registration
      return {
        user: {
          id: 'usr_' + Date.now(),
          name,
          email,
          avatar: null,
          role: 'customer',
          createdAt: new Date().toISOString()
        },
        token: 'mock_jwt_token_' + Date.now()
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Load user from localStorage on app start
const loadUserFromStorage = () => {
  if (typeof window === 'undefined') {
    return {
      user: null,
      token: null,
      isAuthenticated: false
    };
  }
  
  try {
    const storedAuth = localStorage.getItem('merkato_auth');
    if (storedAuth) {
      const parsed = JSON.parse(storedAuth);
      return {
        user: parsed.user || null,
        token: parsed.token || null,
        isAuthenticated: !!parsed.token
      };
    }
  } catch (error) {
    console.error('Failed to load auth state:', error);
  }
  
  return {
    user: null,
    token: null,
    isAuthenticated: false
  };
};

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  cartSync: false,
  ...loadUserFromStorage()
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.cartSync = false;
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('merkato_auth');
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    setCartSync: (state, action) => {
      state.cartSync = action.payload;
    },
    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        
        // Update localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('merkato_auth', JSON.stringify({
            user: state.user,
            token: state.token
          }));
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('merkato_auth', JSON.stringify({
            user: action.payload.user,
            token: action.payload.token
          }));
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload || 'Login failed';
      })
      
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('merkato_auth', JSON.stringify({
            user: action.payload.user,
            token: action.payload.token
          }));
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload || 'Registration failed';
      });
  }
});

export const { logout, clearError, setCartSync, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;