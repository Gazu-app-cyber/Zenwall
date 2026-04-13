import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">404</p>
      <h1 className="mt-3 font-heading text-4xl font-bold">Pagina nao encontrada</h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        Esse caminho nao existe mais por aqui. Volte para a galeria e siga explorando.
      </p>
      <Link to="/" className="mt-6 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
        Ir para Home
      </Link>
    </div>
  );
}
