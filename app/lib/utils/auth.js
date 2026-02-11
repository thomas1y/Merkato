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

// Merge guest cart with user cart after login
export const mergeCarts = (guestCart, userCart) => {
  const merged = [...userCart];
  
  guestCart.forEach(guestItem => {
    const existingItem = merged.find(item => item.id === guestItem.id);
    
    if (existingItem) {
      // Combine quantities, respecting stock limits
      existingItem.quantity = Math.min(
        existingItem.quantity + guestItem.quantity,
        existingItem.maxStock || 99
      );
    } else {
      merged.push(guestItem);
    }
  });
  
  return merged;
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