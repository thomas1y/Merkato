import { createSlice } from '@reduxjs/toolkit';

// Load cart from localStorage
const loadCartFromStorage = () => {
  if (typeof window === 'undefined') {
    return { items: [], totalQuantity: 0, subtotal: 0 };
  }
  
  try {
    const savedCart = localStorage.getItem('merkato_cart');
    if (savedCart) {
      return JSON.parse(savedCart);
    }
  } catch (error) {
    console.error('Failed to load cart:', error);
  }
  
  return { items: [], totalQuantity: 0, subtotal: 0 };
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, name, price, image, maxStock, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity <= (maxStock || 99)) {
          existingItem.quantity = newQuantity;
        }
      } else {
        state.items.push({
          id,
          name,
          price,
          image,
          quantity,
          maxStock: maxStock || 99
        });
      }
      
      // Recalculate totals
      state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
      state.subtotal = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('merkato_cart', JSON.stringify(state));
      }
    },
    
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      
      // Recalculate totals
      state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
      state.subtotal = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('merkato_cart', JSON.stringify(state));
      }
    },
    
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item) {
        if (quantity >= 1 && quantity <= (item.maxStock || 99)) {
          item.quantity = quantity;
        }
      }
      
      // Recalculate totals
      state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
      state.subtotal = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('merkato_cart', JSON.stringify(state));
      }
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.subtotal = 0;
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('merkato_cart', JSON.stringify(state));
      }
    },
    
    // NEW: Sync cart after login
    syncCartWithUser: (state, action) => {
      const userCart = action.payload;
      
      if (userCart && userCart.items && userCart.items.length > 0) {
        // Merge user cart with existing guest cart
        const mergedItems = [...state.items];
        
        userCart.items.forEach(userItem => {
          const existingItem = mergedItems.find(item => item.id === userItem.id);
          
          if (existingItem) {
            // If item exists, take the higher quantity (respecting stock limits)
            existingItem.quantity = Math.min(
              Math.max(existingItem.quantity, userItem.quantity),
              existingItem.maxStock || 99
            );
          } else {
            // Add new item from user cart
            mergedItems.push(userItem);
          }
        });
        
        state.items = mergedItems;
      }
      
      // Recalculate totals
      state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
      state.subtotal = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('merkato_cart', JSON.stringify(state));
      }
    },
    
    // NEW: Set cart from server (when fetching user's saved cart)
    setCart: (state, action) => {
      const newCart = action.payload;
      state.items = newCart.items || [];
      state.totalQuantity = newCart.totalQuantity || 0;
      state.subtotal = newCart.subtotal || 0;
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('merkato_cart', JSON.stringify(state));
      }
    }
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart,
  syncCartWithUser,
  setCart 
} = cartSlice.actions;

export default cartSlice.reducer;