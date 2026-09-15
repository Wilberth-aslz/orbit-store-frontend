import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const linkBase = "text-sm font-medium transition-colors";

export function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    setOpen(false);
    navigate("/");
  }

  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur"
      style={{ borderColor: "var(--border)", background: "rgba(10,15,26,0.85)" }}
    >
      <div className="container-app flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-black"
            style={{ background: "var(--accent)", color: "#04120f" }}
          >
            O
          </span>
          <span style={{ color: "var(--text-primary)" }}>ORBIT</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? "" : "hover:opacity-80"}`
            }
            style={({ isActive }) => ({ color: isActive ? "var(--accent)" : "var(--text-secondary)" })}
            end
          >
            Catalogo
          </NavLink>
          {user && (
            <NavLink
              to="/favoritos"
              className={linkBase}
              style={({ isActive }) => ({ color: isActive ? "var(--accent)" : "var(--text-secondary)" })}
            >
              Favoritos
            </NavLink>
          )}
          {isAdmin && (
            <NavLink
              to="/admin"
              className={linkBase}
              style={({ isActive }) => ({ color: isActive ? "var(--accent)" : "var(--text-secondary)" })}
            >
              Panel admin
            </NavLink>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Hola, {user.name.split(" ")[0]}
              </span>
              <button onClick={handleLogout} className="btn-ghost rounded-lg px-4 py-2 text-sm">
                Cerrar sesion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost rounded-lg px-4 py-2 text-sm">
                Iniciar sesion
              </Link>
              <Link to="/register" className="btn-accent rounded-lg px-4 py-2 text-sm">
                Crear cuenta
              </Link>
            </>
          )}
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg md:hidden"
          style={{ border: "1px solid var(--border-strong)" }}
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menu"
        >
          <span style={{ color: "var(--text-primary)" }}>{open ? "✕" : "☰"}</span>
        </button>
      </div>

      {open && (
        <div className="border-t md:hidden animate-fade-in" style={{ borderColor: "var(--border)" }}>
          <div className="container-app flex flex-col gap-3 py-4">
            <Link to="/" onClick={() => setOpen(false)} style={{ color: "var(--text-secondary)" }}>
              Catalogo
            </Link>
            {user && (
              <Link to="/favoritos" onClick={() => setOpen(false)} style={{ color: "var(--text-secondary)" }}>
                Favoritos
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" onClick={() => setOpen(false)} style={{ color: "var(--text-secondary)" }}>
                Panel admin
              </Link>
            )}
            {user ? (
              <button onClick={handleLogout} className="btn-ghost rounded-lg px-4 py-2 text-left text-sm">
                Cerrar sesion
              </button>
            ) : (
              <div className="flex gap-3 pt-2">
                <Link to="/login" onClick={() => setOpen(false)} className="btn-ghost flex-1 rounded-lg px-4 py-2 text-center text-sm">
                  Iniciar sesion
                </Link>
                <Link to="/register" onClick={() => setOpen(false)} className="btn-accent flex-1 rounded-lg px-4 py-2 text-center text-sm">
                  Crear cuenta
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
