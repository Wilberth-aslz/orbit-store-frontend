import type { Category } from "../../types";

interface HeroProps {
  categories: Category[];
  onPickCategory: (slug: string) => void;
}

/// Hero + 3 botones de categoria rapida (elemento del wireframe 1) que
/// filtran el catalogo de abajo y hacen scroll hacia el.
export function Hero({ categories, onPickCategory }: HeroProps) {
  const quickPicks = categories.slice(0, 3);

  function handlePick(slug: string) {
    onPickCategory(slug);
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section
      className="relative overflow-hidden border-b"
      style={{ borderColor: "var(--border)" }}
    >
      <div
        className="pointer-events-none absolute -top-24 right-[-10%] h-[420px] w-[420px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, var(--accent-soft), transparent 70%)" }}
      />
      <div className="container-app relative flex flex-col items-center gap-6 py-20 text-center md:py-28">
        <span
          className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest"
          style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
        >
          Nueva coleccion disponible
        </span>
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
          Todo lo que necesitas, en un solo lugar
        </h1>
        <p className="max-w-xl text-base md:text-lg" style={{ color: "var(--text-secondary)" }}>
          Electronica, ropa, hogar y deportes seleccionados con cuidado. Envios rapidos, precios justos.
        </p>

        {quickPicks.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            {quickPicks.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handlePick(cat.slug)}
                className="btn-ghost rounded-full px-5 py-2.5 text-sm font-medium"
              >
                {cat.name}
              </button>
            ))}
            <button onClick={() => handlePick("")} className="btn-accent rounded-full px-5 py-2.5 text-sm">
              Ver todo el catalogo
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
