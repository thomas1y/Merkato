'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { dismissSyncNotification } from '@/app/lib/store/features/auth/authSlice';
import { selectShowSyncNotification, selectUser } from '@/app/lib/store/features/auth/selectors';
import { selectCartTotalQuantity } from '@/app/lib/store/features/cart/selectors';
import { getCartSyncMessage } from '@/app/lib/utils/auth';
import { useToast } from '@/app/lib/hooks/useToast';

export default function CartSyncNotification() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const showNotification = useSelector(selectShowSyncNotification);
  const user = useSelector(selectUser);
  const cartItemCount = useSelector(selectCartTotalQuantity);

  useEffect(() => {
    if (showNotification && cartItemCount > 0) {
      // Show custom toast notification for cart sync
      toast.custom((t) => (
        <div className="bg-white rounded-lg shadow-lg border border-blue-100 p-4 max-w-md w-full">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-gray-900">
                Welcome back, {user?.name?.split(' ')[0] || 'there'}! 👋
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                {getCartSyncMessage(cartItemCount)}
              </p>
              <div className="mt-4 flex space-x-3">
                <Link
                  href="/cart"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => {
                    dispatch(dismissSyncNotification());
                    toast.dismiss(t.id);
                  }}
                >
                  View Cart
                </Link>
                <button
                  onClick={() => {
                    dispatch(dismissSyncNotification());
                    toast.dismiss(t.id);
                  }}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
            <button
              onClick={() => {
                dispatch(dismissSyncNotification());
                toast.dismiss(t.id);
              }}
              className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      ), {
        duration: 10000, // 10 seconds
        position: 'bottom-right',
      });
      
      // Dismiss the Redux flag after showing notification
      setTimeout(() => {
        dispatch(dismissSyncNotification());
      }, 500);
    }
  }, [showNotification, cartItemCount, user, dispatch, toast]);
  
  return null; // This component doesn't render anything, just triggers toast
}