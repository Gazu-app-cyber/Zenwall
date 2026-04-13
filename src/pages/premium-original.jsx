import { useState } from "react";
import { Crown, Check, Zap, Bookmark, FolderOpen, Ban, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";

const features = [
  { icon: Bookmark, text: "Saves ilimitados por dia" },
  { icon: FolderOpen, text: "Pastas ilimitadas" },
  { icon: Ban, text: "Sem anúncios" },
  { icon: Zap, text: "Acesso prioritário a novos wallpapers" },
  { icon: Crown, text: "Badge Premium no perfil" },
];

export default function PremiumOriginal() {
  const { user, openAuthModal } = useAuth();
  const [loading] = useState(false);
  const [success] = useState(false);

  const isPremium = user?.is_premium;

  const handleSubscribe = () => {
    if (!user) {
      openAuthModal();
      return;
    }

    toast.error("Pagamento não configurado. Entre em contato com o suporte.");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-12">
        <Link
          to="/"
          className="mb-10 flex items-center gap-2 text-sm font-body text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>

        {success || isPremium ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-yellow-500/10">
              <Crown className="h-10 w-10 text-yellow-500" />
            </div>
            <h1 className="mb-3 font-heading text-3xl font-bold">Você é Premium!</h1>
            <p className="mb-8 font-body text-muted-foreground">
              Aproveite saves ilimitados, sem anúncios e todas as vantagens exclusivas.
            </p>
            <Link
              to="/"
              className="rounded-xl bg-primary px-6 py-3 font-body font-medium text-primary-foreground transition-all hover:bg-primary/90"
            >
              Explorar wallpapers
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-10 text-center">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-4 py-1.5 text-xs font-body text-yellow-500">
                <Crown className="h-3.5 w-3.5" />
                Plano Premium
              </div>
              <h1 className="mb-3 font-heading text-4xl font-bold">
                Acesso <span className="text-primary">Ilimitado</span>
              </h1>
              <p className="font-body text-muted-foreground">
                Salve quantos wallpapers quiser, sem anúncios, sem limites.
              </p>
            </div>

            <div className="mb-6 rounded-3xl border border-border/30 bg-card p-8">
              <div className="mb-6 flex items-end gap-1">
                <span className="font-heading text-5xl font-bold">R$ 20</span>
                <span className="mb-2 font-body text-muted-foreground">/mês</span>
              </div>
              <div className="mb-8 space-y-3">
                {features.map(({ text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Check className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-sm font-body">{text}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="w-full rounded-xl bg-primary py-3.5 font-body font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 disabled:opacity-50"
              >
                <span className="flex items-center justify-center gap-2">
                  {loading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <Crown className="h-4 w-4" />
                  )}
                  {loading ? "Processando..." : "Assinar agora"}
                </span>
              </button>
            </div>

            <div className="text-center">
              <p className="text-xs font-body text-muted-foreground">
                Plano gratuito: 3 saves/dia com anúncios. Reset todo dia à meia-noite (horário de Brasília).
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
