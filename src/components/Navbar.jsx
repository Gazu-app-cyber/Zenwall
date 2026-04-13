import { Search, UserCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

export default function Navbar({ searchQuery, onSearchChange, onAuthClick }) {
  const { user } = useAuth();

  return (
    <header className="safe-top sticky top-0 z-40 border-b border-border/40 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4 sm:px-6">
        <Link to="/" className="shrink-0 font-heading text-xl font-bold tracking-tight">
          ZenWall
        </Link>
        <label className="flex flex-1 items-center gap-2 rounded-full border border-border/60 bg-card/70 px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar por tema, autor ou categoria"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </label>
        {user ? (
          <Link to="/profile" className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-4 py-3 text-sm">
            <UserCircle2 className="h-4 w-4" />
            <span className="hidden sm:inline">{user.full_name || "Perfil"}</span>
          </Link>
        ) : (
          <button onClick={onAuthClick} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">
            <UserCircle2 className="h-4 w-4" />
            Conta
          </button>
        )}
      </div>
    </header>
  );
}
