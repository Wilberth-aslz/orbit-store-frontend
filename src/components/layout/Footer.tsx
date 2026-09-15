const STATS = [
  { label: "Productos activos", value: "500+" },
  { label: "Clientes felices", value: "12,000+" },
  { label: "Calificacion promedio", value: "4.8/5" },
];

const SOCIALS = [
  { label: "Facebook", href: "#", icon: "f" },
  { label: "Instagram", href: "#", icon: "◎" },
  { label: "X / Twitter", href: "#", icon: "𝕏" },
  { label: "YouTube", href: "#", icon: "▶" },
];

export function Footer() {
  return (
    <footer className="border-t" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
      {/* --- Circulos de estadisticas (elemento del wireframe) --- */}
      <div className="container-app py-14">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-3 text-center">
              <div
                className="flex h-24 w-24 items-center justify-center rounded-full text-lg font-bold"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border-strong)",
                  color: "var(--accent)",
                }}
              >
                {stat.value}
              </div>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t" style={{ borderColor: "var(--border)" }}>
        <div className="container-app flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
              ORBIT
            </p>
            <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
              Reto de periodo de prueba - Desarrollo de Software - Turing Inteligencia Artificial.
            </p>
          </div>

          <div className="flex gap-3">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors"
                style={{ border: "1px solid var(--border-strong)", color: "var(--text-secondary)" }}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
