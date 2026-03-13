import { useState, useEffect, useCallback } from 'react';

interface Toast {
  id: number;
  message: string;
}

let toastId = 0;
let addToastGlobal: ((msg: string) => void) | null = null;

export function showXPToast(message: string) {
  addToastGlobal?.(message);
}

export function XPToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  useEffect(() => {
    addToastGlobal = addToast;
    return () => { addToastGlobal = null; };
  }, [addToast]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div key={t.id} className="xp-toast">
          <div className="flex items-center gap-2">
            <span className="text-lg">💬</span>
            <span>{t.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
