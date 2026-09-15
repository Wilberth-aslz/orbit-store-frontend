import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItemBase =
  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors border-l-2";

/// Navegacion lateral fija en escritorio (md+), y panel deslizable tipo
/// "hamburguesa" en movil (controlado por `open`/`onClose` desde App.tsx).
export function Sidebar({ open, onClose }: SidebarProps) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    onClose();
    navigate("/");
  }

  const itemStyle = (isActive: boolean) => ({
    color: isActive ? "var(--accent)" : "var(--text-secondary)",
    background: isActive ? "var(--accent-soft)" : "transparent",
    borderColor: isActive ? "var(--accent)" : "transparent",
  });

  const content = (
    <div className="flex h-full flex-col">
      <Link to="/" onClick={onClose} className="flex items-center gap-2 px-5 py-5 text-lg font-bold tracking-tight">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-black"
          style={{ background: "var(--accent)", color: "#04120f" }}
        >
          O
        </span>
        <span style={{ color: "var(--text-primary)" }}>ORBIT</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        <NavLink to="/" end onClick={onClose} className={navItemBase} style={({ isActive }) => itemStyle(isActive)}>
          <span aria-hidden>🛍️</span>
          Catalogo
        </NavLink>
        {user && (
          <NavLink to="/favoritos" onClick={onClose} className={navItemBase} style={({ isActive }) => itemStyle(isActive)}>
            <span aria-hidden>♥</span>
            Favoritos
          </NavLink>
        )}
        {isAdmin && (
          <NavLink to="/admin" onClick={onClose} className={navItemBase} style={({ isActive }) => itemStyle(isActive)}>
            <span aria-hidden>📊</span>
            Panel de control
          </NavLink>
        )}
      </nav>

      <div className="border-t p-4" style={{ borderColor: "var(--border)" }}>
        {user ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                style={{ background: "var(--surface-2)", color: "var(--accent)" }}
              >
                {user.name.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  {user.name}
                </p>
                <p className="truncate text-xs" style={{ color: "var(--text-muted)" }}>
                  {user.role === "ADMIN" ? "Administrador" : "Cliente"}
                </p>
              </div>
            </div>
            <button onClick={handleLogout} className="btn-ghost w-full rounded-lg px-3 py-2 text-sm">
              Cerrar sesion
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Link to="/login" onClick={onClose} className="btn-ghost w-full rounded-lg px-3 py-2 text-center text-sm">
              Iniciar sesion
            </Link>
            <Link to="/register" onClick={onClose} className="btn-accent w-full rounded-lg px-3 py-2 text-center text-sm">
              Crear cuenta
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Escritorio: fija, siempre visible */}
      <aside
        className="sticky top-0 hidden h-screen w-60 shrink-0 border-r md:block"
        style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
      >
        {content}
      </aside>

      {/* Movil: panel deslizable + overlay, abierto/cerrado con el boton hamburguesa */}
      <div className={`fixed inset-0 z-50 md:hidden ${open ? "" : "pointer-events-none"}`}>
        <div
          onClick={onClose}
          className="absolute inset-0 transition-opacity duration-200"
          style={{ background: "rgba(5,8,14,0.7)", opacity: open ? 1 : 0 }}
        />
        <aside
          className="absolute inset-y-0 left-0 w-72 max-w-[80vw] border-r transition-transform duration-200"
          style={{
            borderColor: "var(--border)",
            background: "var(--bg-elevated)",
            transform: open ? "translateX(0)" : "translateX(-100%)",
          }}
        >
          {content}
        </aside>
      </div>
    </>
  );
}
