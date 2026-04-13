import { X } from "lucide-react";

export default function Drawer({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true">
      <div
        className="safe-bottom absolute inset-x-0 bottom-0 mx-auto w-full max-w-2xl rounded-t-[2rem] border border-border/60 bg-card p-5 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-border" />
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="font-heading text-lg font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary text-muted-foreground transition hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
