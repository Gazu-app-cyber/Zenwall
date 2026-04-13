import { NavLink } from "react-router-dom";

const items = [
  { to: "/", label: "Home" },
  { to: "/premium", label: "Premium" },
  { to: "/profile", label: "Perfil" },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <div className="bottom-nav__inner">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive ? "bottom-nav__link bottom-nav__link--active" : "bottom-nav__link"
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
