'use client';

import { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, selectIsAuthenticated, selectAuthLoading } from '@/app/lib/store/features/auth/selectors';
import { logout } from '@/app/lib/store/features/auth/authSlice';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);

  const handleLogout = () => {
    dispatch(logout());
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    logout: handleLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};