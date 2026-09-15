import { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext";
import { extractErrorMessage } from "../../lib/api";
import { fetchTrendingByCategory, TREND_CATEGORIES } from "../../lib/fakestore";
import type { FakeStoreProduct } from "../../types";
import { CategoryTabs } from "../ui/CategoryTabs";
import { IconStar } from "../ui/Icons";

const currency = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });

/// Seccion "Tendencias" -- los 4 bloques de color del wireframe. Este es EL
/// apartado que se llena mediante el llamado a una API externa
/// (https://fakestoreapi.com), como pide el reto. Las tabs de categoria
/// disparan una nueva peticion fetch cada vez que cambian.
export function TrendsSection() {
  const { notify } = useToast();
  const [category, setCategory] = useState(TREND_CATEGORIES[0].key);
  const [items, setItems] = useState<FakeStoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    fetchTrendingByCategory(category, 4)
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(true);
        notify(extractErrorMessage(err, "No se pudo cargar la API externa de tendencias"), "error");
      })
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  return (
    <section className="border-y py-16 md:py-20" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
      <div className="container-app">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--accent)" }}>
              API externa · fakestoreapi.com
            </span>
            <h2 className="mt-2 text-2xl font-bold md:text-3xl">Tendencias del momento</h2>
            <p className="mt-1" style={{ color: "var(--text-secondary)" }}>
              Lo mas popular fuera de ORBIT, consultado en vivo por categoria.
            </p>
          </div>
          <CategoryTabs options={TREND_CATEGORIES} active={category} onChange={setCategory} />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-64 rounded-2xl" />
            ))}
          </div>
        ) : error ? (
          <div className="card-surface flex flex-col items-center gap-2 py-14 text-center">
            <p className="font-semibold">No se pudo cargar la API externa en este momento.</p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              El catalogo propio de arriba sigue funcionando normalmente.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
              <a
                key={item.id}
                href="#"
                onClick={(e) => e.preventDefault()}
                className="card-surface group flex flex-col overflow-hidden p-5 transition-transform hover:-translate-y-1"
              >
                <div
                  className="mb-4 flex h-32 items-center justify-center rounded-xl p-4"
                  style={{ background: "#ffffff" }}
                >
                  <img src={item.image} alt={item.title} className="h-full w-full object-contain" loading="lazy" />
                </div>
                <h3 className="line-clamp-2 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  {item.title}
                </h3>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-base font-bold" style={{ color: "var(--accent)" }}>
                    {currency.format(item.price)}
                  </span>
                  <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                    <IconStar size={12} style={{ color: "var(--warning)" }} />
                    {item.rating.rate} ({item.rating.count})
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
