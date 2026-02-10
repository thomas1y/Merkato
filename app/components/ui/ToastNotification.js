'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { removeToast } from '@/app/lib/store/features/ui/uiSlice';
import { 
  FiCheckCircle, 
  FiAlertCircle, 
  FiInfo, 
  FiX,
  FiShoppingCart
} from 'react-icons/fi';

const toastIcons = {
  success: FiCheckCircle,
  error: FiAlertCircle,
  info: FiInfo,
  cart: FiShoppingCart,
  warning: FiAlertCircle,
};

const toastColors = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  cart: 'bg-blue-50 border-blue-200 text-blue-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
};

export default function ToastNotification({ toast }) {
  const dispatch = useDispatch();
  const { id, type, message, duration = 3000 } = toast;
  const Icon = toastIcons[type] || FiInfo;
  const colorClass = toastColors[type] || toastColors.info;

  // Auto-remove toast after duration
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeToast(id));
    }, duration);

    return () => clearTimeout(timer);
  }, [dispatch, id, duration]);

  return (
    <div className={`${colorClass} border rounded-lg shadow-lg p-4 mb-2 flex items-center justify-between min-w-64 max-w-md transition-all duration-300 animate-slideIn`}>
      <div className="flex items-center">
        <Icon className={`w-5 h-5 mr-3 ${
          type === 'success' ? 'text-green-600' :
          type === 'error' ? 'text-red-600' :
          type === 'warning' ? 'text-yellow-600' :
          'text-blue-600'
        }`} />
        <span className="text-sm font-medium">{message}</span>
      </div>
      <button
        onClick={() => dispatch(removeToast(id))}
        className="ml-4 text-gray-400 hover:text-gray-600"
      >
        <FiX className="w-4 h-4" />
      </button>
    </div>
  );
}