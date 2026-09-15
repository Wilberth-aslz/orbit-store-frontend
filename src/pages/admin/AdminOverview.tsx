import { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext";
import { api, extractErrorMessage } from "../../lib/api";
import type { DashboardSummary } from "../../types";
import { PageSpinner } from "../../components/ui/Spinner";
import { IconAlertCircle, IconAlertTriangle, IconCheckCircle } from "../../components/ui/Icons";

const currency = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });
const compactCurrency = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  notation: "compact",
  maximumFractionDigits: 1,
});

// Chart mark specs (grosor de barra, radio de esquina, separador) siguiendo
// la guia interna de visualizacion de datos: barra <=24px, esquina superior
// redondeada 4px, base cuadrada, gap de 2px del color de superficie entre
// barras adyacentes, etiqueta de valor directa en la punta.
const BAR_WIDTH = 24;
const CHART_HEIGHT = 160;
const BAR_COLOR = "#14b8a6"; // mismo acento de marca -- serie unica, sin necesidad de leyenda

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-surface flex flex-col gap-1.5 p-5">
      <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
        {label}
      </span>
      <span className="text-2xl font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
        {value}
      </span>
    </div>
  );
}

function CategoryBarChart({ data }: { data: DashboardSummary["byCategory"] }) {
  const max = Math.max(1, ...data.map((d) => d.inventoryValue));
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="card-surface p-5">
      <div className="mb-1 flex items-baseline justify-between">
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Valor de inventario por categoria
        </h3>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          precio × stock
        </span>
      </div>

      <div
        className="mt-6 grid gap-4"
        style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))`, height: CHART_HEIGHT + 44 }}
      >
        {data.map((d) => {
          const barHeight = Math.max(4, (d.inventoryValue / max) * CHART_HEIGHT);
          const isHovered = hovered === d.slug;
          return (
            <div key={d.slug} className="flex flex-col items-center justify-end gap-2">
              <span
                className="text-xs font-medium tabular-nums transition-opacity"
                style={{ color: "var(--text-secondary)", opacity: isHovered ? 1 : 0.85 }}
              >
                {compactCurrency.format(d.inventoryValue)}
              </span>
              <div style={{ height: CHART_HEIGHT }} className="flex items-end">
                <div
                  role="img"
                  aria-label={`${d.category}: ${currency.format(d.inventoryValue)}, ${d.productCount} producto(s)`}
                  onMouseEnter={() => setHovered(d.slug)}
                  onMouseLeave={() => setHovered(null)}
                  className="cursor-default transition-[opacity,transform] duration-150"
                  style={{
                    width: BAR_WIDTH,
                    height: Math.round(barHeight),
                    background: BAR_COLOR,
                    borderRadius: "4px 4px 0 0",
                    opacity: isHovered ? 1 : 0.85,
                    transform: isHovered ? "scaleX(1.08)" : "scaleX(1)",
                  }}
                  title={`${d.category}: ${currency.format(d.inventoryValue)} · ${d.productCount} producto(s)`}
                />
              </div>
              <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                {d.category}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LowStockList({ items }: { items: DashboardSummary["lowStock"] }) {
  return (
    <div className="card-surface p-5">
      <h3 className="mb-4 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
        Alertas de inventario
      </h3>

      {items.length === 0 ? (
        <div className="flex items-center gap-2 py-6 text-sm" style={{ color: "var(--text-secondary)" }}>
          <IconCheckCircle size={16} style={{ color: "var(--accent)" }} />
          Todo el catalogo tiene buen nivel de stock.
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((item) => {
            const isCritical = item.status === "critical";
            const color = isCritical ? "var(--danger)" : "var(--warning)";
            return (
              <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-2 truncate">
                  <span style={{ color }}>
                    {isCritical ? <IconAlertCircle size={16} /> : <IconAlertTriangle size={16} />}
                  </span>
                  <span className="truncate" style={{ color: "var(--text-primary)" }}>
                    {item.name}
                  </span>
                  <span className="shrink-0 text-xs" style={{ color: "var(--text-muted)" }}>
                    · {item.category}
                  </span>
                </div>
                <span className="shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold" style={{ background: `${color}22`, color }}>
                  {isCritical ? "Agotado" : `${item.stock} en stock`}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function AdminOverview() {
  const { notify } = useToast();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/dashboard")
      .then(({ data }) => setSummary(data.data))
      .catch((err) => notify(extractErrorMessage(err), "error"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <PageSpinner />;
  if (!summary) return null;

  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Productos" value={String(summary.totals.products)} />
        <StatTile label="Categorias" value={String(summary.totals.categories)} />
        <StatTile label="Usuarios registrados" value={String(summary.totals.users)} />
        <StatTile label="Valor del inventario" value={currency.format(summary.totals.inventoryValue)} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <CategoryBarChart data={summary.byCategory} />
        <LowStockList items={summary.lowStock} />
      </div>
    </div>
  );
}
