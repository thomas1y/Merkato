// Basic auth selectors
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
export const selectCartSync = (state) => state.auth.cartSync;
export const selectShowSyncNotification = (state) => state.auth.showSyncNotification; // NEW

// Derived selectors
export const selectUserName = (state) => state.auth.user?.name || null;
export const selectUserEmail = (state) => state.auth.user?.email || null;
export const selectUserRole = (state) => state.auth.user?.role || 'guest';
export const selectIsAdmin = (state) => state.auth.user?.role === 'admin';

// Check if user is logged in AND cart sync is needed
export const selectNeedsCartSync = (state) => 
  state.auth.isAuthenticated && !state.auth.cartSync;

// User greeting based on time of day
export const selectUserGreeting = (state) => {
  if (!state.auth.user?.name) return 'Welcome';
  
  const hour = new Date().getHours();
  const name = state.auth.user.name.split(' ')[0];
  
  if (hour < 12) return `Good morning, ${name}`;
  if (hour < 18) return `Good afternoon, ${name}`;
  return `Good evening, ${name}`;
};

// Check if user has completed profile
export const selectIsProfileComplete = (state) => {
  const user = state.auth.user;
  if (!user) return false;
  
  return !!(
    user.name &&
    user.email &&
    user.phone
  );
};

// NEW: Get user's first name
export const selectUserFirstName = (state) => {
  const name = state.auth.user?.name;
  if (!name) return null;
  return name.split(' ')[0];
};