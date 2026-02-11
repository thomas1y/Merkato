'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/app/lib/store/features/auth/selectors';

// List of public routes that don't require authentication
const publicRoutes = [
  '/',
  '/products',
  '/products/',
  '/cart',
  '/login',
  '/register',
  '/about',
  '/contact'
];

// Routes that start with these prefixes are public
const publicPrefixes = [
  '/products/',
  '/categories/'
];

export default function AuthGuard({ children }) {
  const pathname = usePathname();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Check if current route is public
  const isPublicRoute = () => {
    // Exact match in public routes
    if (publicRoutes.includes(pathname)) {
      return true;
    }
    
    // Check prefixes
    return publicPrefixes.some(prefix => pathname.startsWith(prefix));
  };

  useEffect(() => {
    // Log route access for debugging (remove in production)
    if (process.env.NODE_ENV === 'development') {
      console.log(`Route: ${pathname}`, {
        isPublic: isPublicRoute(),
        isAuthenticated
      });
    }
  }, [pathname, isAuthenticated]);

  // No need to guard public routes
  if (isPublicRoute()) {
    return children;
  }

  // For protected routes, we'll use ProtectedRoute component
  // This is just a wrapper - actual protection happens in the page components
  return children;
}