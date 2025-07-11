// client/src/ui/components/Toast/ToastContainer.tsx
// Renders all active toasts in a fixed viewport corner

import React from 'react';
import { createPortal } from 'react-dom';
import Toast from './Toast';
import { useToast } from './ToastContext';
import './Toast.scss';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  /* ensure portal target exists */
  const root =
    document.getElementById('toast-root') ||
    (() => {
      const el = document.createElement('div');
      el.id = 'toast-root';
      document.body.appendChild(el);
      return el;
    })();

  return createPortal(
    <div className="toast-stack">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onClose={removeToast} />
      ))}
    </div>,
    root,
  );
};

export default ToastContainer;
