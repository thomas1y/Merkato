'use client';

import { useDispatch } from 'react-redux';
import { addToast } from '../store/features/ui/uiSlice';

export function useToast() {
  const dispatch = useDispatch();
  
  const showToast = (type, message, duration = 3000) => {
    dispatch(addToast({ type, message, duration }));
  };
  
  return {
    success: (message, duration) => showToast('success', message, duration),
    error: (message, duration) => showToast('error', message, duration),
    info: (message, duration) => showToast('info', message, duration),
    cart: (message, duration) => showToast('cart', message, duration),
    warning: (message, duration) => showToast('warning', message, duration),
  };
}