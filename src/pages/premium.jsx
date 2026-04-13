import { Check, Crown, ShieldCheck, Sparkles } from "lucide-react";
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
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10">
        <Link to="/" className="inline-flex w-fit items-center gap-2 rounded-full border border-border/60 bg-card/70 px-4 py-2 text-sm text-muted-foreground transition hover:text-foreground">
          Voltar para Home
        </Link>

        <section className="grid gap-6 lg:grid-cols-[1.15fr,0.85fr]">
          <div className="rounded-[2.25rem] border border-primary/20 bg-gradient-to-br from-primary/20 via-card to-card p-6 sm:p-8">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-sm text-yellow-400">
              <Crown className="h-4 w-4" />
              ZenWall Premium
            </div>
            <h1 className="max-w-xl font-heading text-4xl font-bold leading-tight sm:text-5xl">
              Todos os wallpapers sem limite, sem anuncios e por R$ 20 por mes.
            </h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
              O plano premium libera salvamentos ilimitados, acesso continuo a novas artes abertas e uma experiencia mobile limpa.
            </p>

            <div className="mt-8 grid gap-3">
              {FEATURES.map((feature) => (
                <div key={feature} className="flex items-center gap-3 rounded-2xl border border-border/40 bg-background/40 px-4 py-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <Check className="h-4 w-4" />
                  </span>
                  <span className="text-sm sm:text-base">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2.25rem] border border-border/60 bg-card/80 p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <p className="font-heading text-xl font-bold">Plano mensal</p>
                <p className="text-sm text-muted-foreground">Sem limite diario de saves</p>
              </div>
            </div>

            <div className="mb-6 flex items-end gap-2">
              <span className="font-heading text-5xl font-bold">R$ 20</span>
              <span className="pb-1 text-sm text-muted-foreground">por mes</span>
            </div>

            <button onClick={handleSubscribe} className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
              <Crown className="h-4 w-4" />
              {user?.is_premium ? "Premium ativo" : "Ativar Premium"}
            </button>

            <div className="rounded-2xl border border-border/50 bg-background/50 p-4 text-sm text-muted-foreground">
              <div className="mb-2 flex items-center gap-2 text-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Implementacao atual
              </div>
              O fluxo de pagamento foi deixado em modo local para demonstracao. Em producao, basta substituir essa acao pela confirmacao real do gateway.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
