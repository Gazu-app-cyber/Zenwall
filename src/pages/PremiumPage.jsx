import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { activatePremium } from "@/services/storage/authStorage";

const features = [
  "Saves ilimitados por dia",
  "Pastas ilimitadas",
  "Sem anuncios",
  "Acesso prioritario a novos wallpapers",
  "Badge Premium no perfil",
];

export default function PremiumPage() {
  const { user, refreshUser, openAuthModal } = useAuth();

  const handleSubscribe = () => {
    if (!user) {
      openAuthModal();
      return;
    }

    activatePremium(user.id);
    refreshUser();
    window.alert("Plano Premium ativado nesta base local.");
  };

  return (
    <div className="page page--narrow">
      <div className="container narrow-stack">
        <Link to="/" className="back-link">
          ← Voltar
        </Link>

        <div className="premium-hero">
          <div className="hero__tag hero__tag--gold">Plano Premium</div>
          <h1 className="premium-title">
            Acesso <span>ilimitado</span>
          </h1>
          <p>Salve quantos wallpapers quiser, sem anuncios e sem limites.</p>
        </div>

        <section className="pricing-card">
          <div className="pricing-card__price">
            <strong>R$ 20</strong>
            <span>/mes</span>
          </div>
          <ul className="feature-list">
            {features.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <button type="button" className="button button--primary button--full" onClick={handleSubscribe}>
            {user?.isPremium ? "Premium ativo" : "Assinar agora"}
          </button>
        </section>

        <p className="muted center-text">
          Plano gratuito: 3 saves por dia com anuncios. Reset todo dia a meia-noite no horario de Brasilia.
        </p>
      </div>
    </div>
  );
}
