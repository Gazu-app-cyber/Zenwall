import { Crown, ImageIcon, Search, UserCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

export default function Navbar({ searchQuery, onSearchChange, onAuthClick }) {
  const { user } = useAuth();

  return (
    <header className="safe-top sticky top-0 z-40 border-b border-white/5 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary shadow-[0_0_30px_rgba(124,58,237,0.15)]">
            <ImageIcon className="h-5 w-5" />
          </span>
          <span className="font-heading text-2xl font-bold tracking-tight">
            Wall<span className="text-primary">Art</span>
          </span>
        </Link>

        <label className="mx-auto hidden w-full max-w-md items-center gap-2 rounded-2xl border border-white/10 bg-card/80 px-4 py-3 md:flex">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar wallpapers..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </label>

        <div className="ml-auto flex items-center gap-2">
          <Link
            to="/premium"
            className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-yellow-400 transition hover:text-yellow-300 md:inline-flex"
          >
            <Crown className="h-4 w-4" />
            Premium
          </Link>

          {user ? (
            <Link
              to="/profile"
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-card/80 text-muted-foreground transition hover:text-foreground"
            >
              <UserCircle2 className="h-5 w-5" />
            </Link>
          ) : (
            <button
              onClick={onAuthClick}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-primary transition hover:bg-primary/15"
            >
              <UserCircle2 className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <div className="mx-auto block max-w-7xl px-4 pb-3 md:hidden sm:px-6">
        <label className="flex w-full items-center gap-2 rounded-2xl border border-white/10 bg-card/80 px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar wallpapers..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </label>
      </div>
    </header>
  );
}
