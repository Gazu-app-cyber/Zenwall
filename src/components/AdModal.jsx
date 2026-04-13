import { useEffect, useState } from "react";
import Drawer from "@/components/Drawer";

export default function AdModal({ open, onClose, onReward }) {
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    if (!open) {
      setSeconds(5);
      return;
    }
    const interval = window.setInterval(() => setSeconds((current) => (current > 0 ? current - 1 : 0)), 1000);
    return () => window.clearInterval(interval);
  }, [open]);

  return (
    <Drawer open={open} onClose={onClose} title="Assistir anuncio">
      <div className="space-y-4">
        <div className="rounded-[1.75rem] border border-border/50 bg-gradient-to-br from-primary/20 via-card to-card p-5">
          <p className="text-sm text-muted-foreground">
            Depois de 3 salvamentos por dia, o plano gratuito pede um anuncio para liberar mais 1 save.
          </p>
          <div className="mt-4 flex h-40 items-center justify-center rounded-[1.5rem] border border-dashed border-border bg-background/50">
            <span className="text-center text-sm text-muted-foreground">Espaco reservado para o SDK de anuncios</span>
          </div>
        </div>
        <button
          onClick={() => {
            onReward();
            onClose();
          }}
          disabled={seconds > 0}
          className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-40"
        >
          {seconds > 0 ? `Aguarde ${seconds}s` : "Liberar mais 1 save"}
        </button>
      </div>
    </Drawer>
  );
}
