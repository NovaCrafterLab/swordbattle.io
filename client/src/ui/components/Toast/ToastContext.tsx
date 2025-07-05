// client/src/ui/components/Toast/ToastContext.tsx
// React context for global toast notifications

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from 'react'

/* ---------- types ---------- */
export type ToastType = 'success' | 'error' | 'info'

export interface ToastItem {
  id: number
  type: ToastType
  message: string
  duration: number
}

/* ---------- context ---------- */
interface ToastCtx {
  toasts: ToastItem[]
  addToast: (type: ToastType, msg: string, duration?: number) => number
  removeToast: (id: number) => void
}

const ToastContext = createContext<ToastCtx | null>(null)

/* ---------- global helper ---------- */
let _toastAddInternal: ToastCtx['addToast'] = () => 0

export const toast = (
  type: ToastType,
  message: string,
  duration = 3000,
) => _toastAddInternal(type, message, duration)

/* ---------- provider ---------- */
export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const nextId = useRef(1)

  /* add a toast */
  const addToast = useCallback<ToastCtx['addToast']>(
    (type, message, duration = 3000) => {
      const id = nextId.current++
      setToasts((prev) => [...prev, { id, type, message, duration }])
      return id
    },
    [],
  )

  /* remove a toast */
  const removeToast = useCallback<ToastCtx['removeToast']>((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  _toastAddInternal = addToast

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  )
}

/* ---------- hook ---------- */
export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
