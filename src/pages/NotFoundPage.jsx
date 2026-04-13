import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="page page--narrow">
      <div className="container narrow-stack center-text">
        <h1>Pagina nao encontrada</h1>
        <p className="muted">A rota que voce tentou acessar nao existe.</p>
        <Link to="/" className="button button--primary">
          Voltar para Home
        </Link>
      </div>
    </div>
  );
}
