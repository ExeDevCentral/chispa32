"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastData {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastItemProps {
  toast: ToastData;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Fade in
    const showTimer = setTimeout(() => setVisible(true), 10);
    // Start fade out before removal
    const hideTimer = setTimeout(() => setVisible(false), 2700);
    // Remove from DOM
    const removeTimer = setTimeout(() => onRemove(toast.id), 3000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [toast.id, onRemove]);

  const styles: Record<ToastType, { container: string; icon: React.ReactNode }> = {
    success: {
      container:
        "bg-[#191C21] border-l-4 border-[#38D39F] text-[#FAF8F3]",
      icon: <CheckCircle2 className="w-4 h-4 text-[#38D39F] shrink-0" />,
    },
    error: {
      container:
        "bg-[#191C21] border-l-4 border-[#FF5500] text-[#FAF8F3]",
      icon: <AlertTriangle className="w-4 h-4 text-[#FF5500] shrink-0" />,
    },
    info: {
      container:
        "bg-[#191C21] border-l-4 border-[#60A5FA] text-[#FAF8F3]",
      icon: <Info className="w-4 h-4 text-[#60A5FA] shrink-0" />,
    },
  };

  const { container, icon } = styles[toast.type];

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg
        font-mono text-xs font-bold min-w-64 max-w-80
        transition-all duration-300 ease-out
        ${container}
        ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}
      `}
    >
      {icon}
      <span className="flex-1 leading-snug">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-[#8C929E] hover:text-[#FAF8F3] transition-colors ml-1"
        aria-label="Cerrar notificación"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastData[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 right-4 z-[9999] flex flex-col gap-2 items-end pointer-events-none"
      aria-label="Notificaciones"
    >
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} onRemove={onRemove} />
        </div>
      ))}
    </div>
  );
}
