import { Link } from "react-router-dom";
import { Image, Search, User, Crown, LogIn } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export default function NavbarOriginal({ searchQuery, onSearchChange, onAuthClick }) {
  const { user } = useAuth();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50" style={{ paddingTop: "env(safe-area-inset-top)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Image className="w-4.5 h-4.5 text-primary" />
            </div>
            <span className="font-heading font-bold text-lg tracking-tight">
              Wall<span className="text-primary">Art</span>
            </span>
          </Link>

          <div className="relative w-full max-w-xs sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar wallpapers..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border/50 rounded-xl text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {user ? (
              <>
                <Link to="/premium" className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-body text-yellow-500 hover:bg-yellow-500/10 rounded-xl transition-colors">
                  <Crown className="w-3.5 h-3.5" />
                  Premium
                </Link>
                <Link to="/profile" className="w-9 h-9 rounded-xl bg-secondary border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
                  <User className="w-4 h-4" />
                </Link>
              </>
            ) : (
              <button onClick={() => onAuthClick?.()} className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-body hover:bg-primary/90 transition-all">
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Entrar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
