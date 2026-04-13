import { Check, Crown, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";

const FEATURES = [
  "Downloads e salvamentos ilimitados",
  "Acesso sem anuncios",
  "Colecao completa e carregamento continuo",
  "Pastas ilimitadas para organizar favoritos",
  "Badge Premium no perfil",
];

export default function Premium() {
  const navigate = useNavigate();
  const { user, openAuthModal, refreshUser } = useAuth();

  const handleSubscribe = () => {
    if (!user) {
      openAuthModal();
      return;
    }

    base44.entities.User.upsert({
      ...user,
      is_premium: true,
      premium_started_at: new Date().toISOString(),
    });
    refreshUser();
    toast.success("Premium ativado neste dispositivo");
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-background pb-28 md:pb-0">
      <main className="mx-auto flex w-full max-w-3xl flex-col px-4 py-10 sm:px-6 sm:py-14">
        <Link to="/" className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>

        <section className="mt-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/25 bg-yellow-500/10 px-5 py-2 text-sm text-yellow-400">
            <Crown className="h-4 w-4" />
            Plano Premium
          </div>

          <h1 className="mt-7 font-heading text-5xl font-bold tracking-[-0.04em] text-white sm:text-6xl">
            Acesso
            <span className="ml-3 bg-gradient-to-r from-primary via-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
              ilimitado
            </span>
          </h1>

          <p className="mt-5 text-xl text-muted-foreground">
            Salve quantos wallpapers quiser, sem anuncios, sem limites.
          </p>
        </section>

        <section className="mt-12 rounded-[2rem] border border-white/8 bg-card/80 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-10">
          <div className="mb-10 flex items-end gap-2">
            <span className="font-heading text-6xl font-bold tracking-[-0.05em] text-white">R$ 20</span>
            <span className="pb-2 text-2xl text-muted-foreground">/mês</span>
          </div>

          <div className="space-y-5">
            {FEATURES.map((feature) => (
              <div key={feature} className="flex items-center gap-4 text-lg text-white">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Check className="h-4 w-4" />
                </span>
                {feature}
              </div>
            ))}
          </div>

          <button
            onClick={handleSubscribe}
            className="mt-10 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-violet-500 px-4 py-4 text-lg font-semibold text-primary-foreground shadow-[0_20px_45px_rgba(124,58,237,0.35)] transition hover:opacity-95"
          >
            <Crown className="h-5 w-5" />
            {user?.is_premium ? "Premium ativo" : "Assinar agora"}
          </button>
        </section>

        <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-muted-foreground">
          Plano gratuito: 3 saves/dia com anuncios. Reset todo dia à meia-noite (horário de Brasília).
        </p>
      </main>
    </div>
  );
}
