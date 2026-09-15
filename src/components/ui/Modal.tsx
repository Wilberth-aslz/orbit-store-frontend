import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { IconClose } from "./Icons";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div
        className="absolute inset-0"
        style={{ background: "rgba(5,8,14,0.7)", backdropFilter: "blur(2px)" }}
        onClick={onClose}
      />
      <div
        className="card-surface relative z-10 w-full max-w-lg animate-fade-in p-6"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{ border: "1px solid var(--border-strong)", color: "var(--text-secondary)" }}
          >
            <IconClose size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}
