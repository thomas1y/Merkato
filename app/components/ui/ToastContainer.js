'use client';

import { useSelector } from 'react-redux';
import ToastNotification from './ToastNotification';
import { selectToasts } from '@/app/lib/store/features/ui/selectors';

export default function ToastContainer() {
  const toasts = useSelector(selectToasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[1000] flex flex-col items-end">
      {toasts.map((toast) => (
        <ToastNotification key={toast.id} toast={toast} />
      ))}
    </div>
  );
}