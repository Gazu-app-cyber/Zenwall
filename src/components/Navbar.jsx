import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar({ searchQuery, onSearchChange }) {
  const { user, openAuthModal } = useAuth();
  const location = useLocation();

  return (
    <header className="topbar">
      <div className="container topbar__inner">
        <Link to="/" className="brand">
          <span className="brand__badge">WA</span>
          <span className="brand__name">
            Wall<span>Art</span>
          </span>
        </Link>

        {location.pathname === "/" ? (
          <label className="searchbar">
            <span className="searchbar__icon">⌕</span>
            <input
              type="text"
              placeholder="Buscar wallpapers..."
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </label>
        ) : (
          <div className="topbar__spacer" />
        )}

        <div className="topbar__actions">
          <Link to="/premium" className="text-link text-link--gold">
            Premium
          </Link>
          {user ? (
            <Link to="/profile" className="icon-pill">
              {user.fullName?.slice(0, 1).toUpperCase() || user.email.slice(0, 1).toUpperCase()}
            </Link>
          ) : (
            <button type="button" className="button button--primary" onClick={openAuthModal}>
              Entrar
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
