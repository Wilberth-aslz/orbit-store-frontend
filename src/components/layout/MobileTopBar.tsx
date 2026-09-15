import { Link } from "react-router-dom";
import { IconMenu } from "../ui/Icons";

interface MobileTopBarProps {
  onOpenMenu: () => void;
}

/// Barra superior delgada, solo visible en movil (el sidebar ya cubre este
/// espacio en escritorio). Contiene el logo y el boton hamburguesa que abre
/// el panel de navegacion lateral deslizable.
export function MobileTopBar({ onOpenMenu }: MobileTopBarProps) {
  return (
    <header
      className="sticky top-0 z-40 flex h-14 items-center justify-between border-b px-4 backdrop-blur md:hidden"
      style={{ borderColor: "var(--border)", background: "rgba(10,15,26,0.85)" }}
    >
      <Link to="/" className="flex items-center gap-2 text-base font-bold tracking-tight">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-black"
          style={{ background: "var(--accent)", color: "#04120f" }}
        >
          O
        </span>
        <span style={{ color: "var(--text-primary)" }}>ORBIT</span>
      </Link>

      <button
        onClick={onOpenMenu}
        aria-label="Abrir menu"
        className="flex h-10 w-10 items-center justify-center rounded-lg"
        style={{ border: "1px solid var(--border-strong)" }}
      >
        <IconMenu style={{ color: "var(--text-primary)" }} />
      </button>
    </header>
  );
}
