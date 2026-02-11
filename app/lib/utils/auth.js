// Token management utilities
export const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const auth = localStorage.getItem('merkato_auth');
    if (auth) {
      const parsed = JSON.parse(auth);
      return parsed.token || null;
    }
  } catch (error) {
    console.error('Failed to get auth token:', error);
  }
  return null;
};

export const setAuthToken = (token, user) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('merkato_auth', JSON.stringify({ token, user }));
  } catch (error) {
    console.error('Failed to save auth token:', error);
  }
};

export const removeAuthToken = () => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem('merkato_auth');
  } catch (error) {
    console.error('Failed to remove auth token:', error);
  }
};

// Check if token is expired (mock implementation)
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  // Mock token expiration check
  // In production, decode JWT and check exp claim
  return false;
};

// Get auth header for API requests
export const getAuthHeader = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// UPDATED: Enhanced cart merging logic
export const mergeCarts = (guestCart, userCart) => {
  // Handle case where one cart is empty
  if (!guestCart?.items?.length) return userCart;
  if (!userCart?.items?.length) return guestCart;
  
  const mergedItems = [...userCart.items];
  
  guestCart.items.forEach(guestItem => {
    const existingItem = mergedItems.find(item => item.id === guestItem.id);
    
    if (existingItem) {
      // Combine quantities, respecting stock limits
      const maxStock = existingItem.maxStock || guestItem.maxStock || 99;
      existingItem.quantity = Math.min(
        existingItem.quantity + guestItem.quantity,
        maxStock
      );
      
      // Preserve the higher price (if different)
      if (guestItem.price > existingItem.price) {
        existingItem.price = guestItem.price;
      }
      
      // Preserve the better image
      if (guestItem.image && !existingItem.image) {
        existingItem.image = guestItem.image;
      }
    } else {
      // Add new item from guest cart
      mergedItems.push({ ...guestItem });
    }
  });
  
  // Calculate totals
  const totalQuantity = mergedItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = mergedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  return {
    items: mergedItems,
    totalQuantity,
    subtotal
  };
};

// NEW: Save user cart to server
export const saveUserCart = async (userId, cart) => {
  // In production, this would be an API call
  console.log(`Saving cart for user ${userId}:`, cart);
  return Promise.resolve({ success: true });
};

// NEW: Clear guest cart data
export const clearGuestCart = () => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem('merkato_cart');
  } catch (error) {
    console.error('Failed to clear guest cart:', error);
  }
};

// Format user display name
export const formatUserName = (user) => {
  if (!user) return 'Guest';
  
  if (user.name) {
    // Return first name only
    return user.name.split(' ')[0];
  }
  
  if (user.email) {
    // Return part before @ symbol
    return user.email.split('@')[0];
  }
  
  return 'User';
};


export const getCartSyncMessage = (itemCount) => {
  if (itemCount === 0) {
    return 'Your cart is ready';
  } else if (itemCount === 1) {
    return '1 item has been added to your cart';
  } else {
    return `${itemCount} items have been added to your cart`;
  }
};