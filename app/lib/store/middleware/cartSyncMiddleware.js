import { syncCartWithUser, setCart } from '../features/cart/cartSlice';
import { loginUser, registerUser, fetchUserCart } from '../features/auth/authSlice';
import { saveUserCart } from '@/app/lib/utils/auth';

// Middleware to handle cart synchronization after login/register
export const cartSyncMiddleware = store => next => action => {
  const result = next(action);
  
  // After successful login
  if (action.type === loginUser.fulfilled.type) {
    const { cart } = action.payload;
    
    if (cart && cart.items && cart.items.length > 0) {
      // Sync the cart with merged items
      store.dispatch(syncCartWithUser(cart));
    }
  }
  
  // After successful registration
  if (action.type === registerUser.fulfilled.type) {
    const { cart } = action.payload;
    
    if (cart && cart.items && cart.items.length > 0) {
      // Save guest cart to user account
      store.dispatch(syncCartWithUser(cart));
    }
  }
  
  // After fetching user's saved cart
  if (action.type === fetchUserCart.fulfilled.type) {
    const state = store.getState();
    const guestCart = state.cart;
    const userCart = action.payload;
    
    // Merge guest cart with user's saved cart
    const mergedItems = [...userCart.items];
    
    guestCart.items.forEach(guestItem => {
      const existingItem = mergedItems.find(item => item.id === guestItem.id);
      
      if (existingItem) {
        // Take the higher quantity, respecting stock limits
        existingItem.quantity = Math.min(
          Math.max(existingItem.quantity, guestItem.quantity),
          existingItem.maxStock || 99
        );
      } else {
        mergedItems.push({ ...guestItem });
      }
    });
    
    const totalQuantity = mergedItems.reduce((total, item) => total + item.quantity, 0);
    const subtotal = mergedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    store.dispatch(setCart({
      items: mergedItems,
      totalQuantity,
      subtotal
    }));
  }
  
  // Save cart to server when it changes (if user is logged in)
  if (action.type?.startsWith('cart/')) {
    const state = store.getState();
    const { auth, cart } = state;
    
    if (auth.isAuthenticated && auth.user) {
      // Debounce this in production
      saveUserCart(auth.user.id, cart);
    }
  }
  
  return result;
};