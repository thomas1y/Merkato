'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectAuthLoading } from '@/app/lib/store/features/auth/selectors';

export default function PublicOnlyRoute({ children }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);

  useEffect(() => {
    // Wait for auth to finish loading
    if (!isLoading) {
      if (isAuthenticated) {
        // Get the return URL from query params or default to home
        const returnUrl = searchParams.get('returnUrl');
        const redirectTo = returnUrl ? decodeURIComponent(returnUrl) : '/';
        router.push(redirectTo);
      }
    }
  }, [isAuthenticated, isLoading, router, searchParams]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If authenticated, don't render public content (redirect will happen)
  if (isAuthenticated) {
    return null;
  }

  // Not authenticated - render the public content
  return children;
}