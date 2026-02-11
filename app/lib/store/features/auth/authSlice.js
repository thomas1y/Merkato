import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mergeCarts } from '@/app/lib/utils/auth'; // We'll update this

// Mock API call - will replace with real API later
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue, getState }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      // Mock successful login (demo credentials)
      if (email === 'demo@merkato.com' && password === 'password123') {
        // Get guest cart from state
        const state = getState();
        const guestCart = state.cart;
        
        // Mock user's saved cart from database
        const userSavedCart = {
          items: [
            {
              id: 1,
              name: 'Wireless Headphones',
              price: 79.99,
              image: '/images/headphones.jpg',
              quantity: 1,
              maxStock: 15
            },
            {
              id: 4,
              name: 'Smart Watch',
              price: 299.99,
              image: '/images/watch.jpg',
              quantity: 1,
              maxStock: 10
            }
          ],
          totalQuantity: 2,
          subtotal: 379.98
        };
        
        // Merge guest cart with user's saved cart
        const mergedCart = mergeCarts(guestCart, userSavedCart);
        
        return {
          user: {
            id: 'usr_123',
            name: 'Demo User',
            email: 'demo@merkato.com',
            avatar: null,
            role: 'customer',
            createdAt: new Date().toISOString()
          },
          token: 'mock_jwt_token_' + Date.now(),
          cart: mergedCart, // Send merged cart back
          needsCartSync: true
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
  async ({ name, email, password, confirmPassword }, { rejectWithValue, getState }) => {
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
      
      // Get guest cart from state
      const state = getState();
      const guestCart = state.cart;
      
      // For new users, they start with empty cart
      // But we want to save their guest cart to their new account
      
      return {
        user: {
          id: 'usr_' + Date.now(),
          name,
          email,
          avatar: null,
          role: 'customer',
          createdAt: new Date().toISOString()
        },
        token: 'mock_jwt_token_' + Date.now(),
        cart: guestCart, // Save guest cart to user's account
        needsCartSync: guestCart.items.length > 0 // Only show sync notification if cart has items
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// NEW: Fetch user's cart from server
export const fetchUserCart = createAsyncThunk(
  'auth/fetchUserCart',
  async (_, { rejectWithValue, getState }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const state = getState();
      const userId = state.auth.user?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      // Mock user's saved cart from database
      // In production, this would be an API call
      return {
        items: [
          {
            id: 1,
            name: 'Wireless Headphones',
            price: 79.99,
            image: '/images/headphones.jpg',
            quantity: 1,
            maxStock: 15
          },
          {
            id: 4,
            name: 'Smart Watch',
            price: 299.99,
            image: '/images/watch.jpg',
            quantity: 1,
            maxStock: 10
          }
        ],
        totalQuantity: 2,
        subtotal: 379.98
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
  showSyncNotification: false, // NEW
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
      state.showSyncNotification = false;
      
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
    // NEW: Dismiss cart sync notification
    dismissSyncNotification: (state) => {
      state.showSyncNotification = false;
      state.cartSync = true;
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
        state.showSyncNotification = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        state.cartSync = false; // Reset cart sync flag
        state.showSyncNotification = action.payload.needsCartSync || false; // Show notification if needed
        
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
        state.showSyncNotification = false;
      })
      
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.showSyncNotification = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        state.cartSync = false;
        state.showSyncNotification = action.payload.needsCartSync || false;
        
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
        state.showSyncNotification = false;
      })
      
      // FETCH USER CART
      .addCase(fetchUserCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserCart.fulfilled, (state, action) => {
        state.isLoading = false;
        // Cart data will be handled by cartSlice
      })
      .addCase(fetchUserCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch cart';
      });
  }
});

export const { 
  logout, 
  clearError, 
  setCartSync, 
  dismissSyncNotification,  
  updateUserProfile 
} = authSlice.actions;

export default authSlice.reducer;