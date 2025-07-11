// client/src/ui/components/Toast/Toast.tsx
// Single toast notification with auto-dismiss + fade animation

import React, { useEffect, useState } from 'react';
import { ToastItem } from './ToastContext';

interface Props {
  toast: ToastItem;
  onClose: (id: number) => void;
}

const Toast: React.FC<Props> = ({ toast, onClose }) => {
  const [leaving, setLeaving] = useState(false);

  /* auto-dismiss timer */
  useEffect(() => {
    const timer = setTimeout(() => setLeaving(true), toast.duration);
    return () => clearTimeout(timer);
  }, [toast.duration]);

  /* trigger real close after fade-out */
  useEffect(() => {
    if (!leaving) return;
    const timer = setTimeout(() => onClose(toast.id), 300); // match CSS fade-out
    return () => clearTimeout(timer);
  }, [leaving, onClose, toast.id]);

  return (
    <div
      className={`toast toast--${toast.type} ${leaving ? 'toast--leave' : ''}`}
    >
      <span className="toast-msg">{toast.message}</span>
      <button className="toast-close" onClick={() => setLeaving(true)}>
        ×
      </button>
    </div>
  );
};

export default Toast;
