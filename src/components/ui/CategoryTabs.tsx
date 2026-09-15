interface CategoryTabsProps {
  options: { key: string; label: string }[];
  active: string;
  onChange: (key: string) => void;
}

/// Tabs de categoria reutilizables (usadas en el catalogo propio y en la
/// seccion de tendencias externa). Cumple el requisito de "cambiar entre
/// los elementos a mostrar (como una categoria)" con JS puro de React.
export function CategoryTabs({ options, active, onChange }: CategoryTabsProps) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist">
      {options.map((opt) => {
        const isActive = opt.key === active;
        return (
          <button
            key={opt.key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(opt.key)}
            className="rounded-full px-4 py-2 text-sm font-medium transition-all"
            style={{
              background: isActive ? "var(--accent)" : "var(--surface)",
              color: isActive ? "#04120f" : "var(--text-secondary)",
              border: `1px solid ${isActive ? "var(--accent)" : "var(--border-strong)"}`,
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
