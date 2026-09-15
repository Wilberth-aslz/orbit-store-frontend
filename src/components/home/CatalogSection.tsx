import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { api, extractErrorMessage } from "../../lib/api";
import type { ApiListMeta, Category, Product } from "../../types";
import { CategoryTabs } from "../ui/CategoryTabs";
import { ProductCard } from "../ui/ProductCard";

const PAGE_SIZE = 6; // 2x3, como en el wireframe

interface CatalogSectionProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (slug: string) => void;
}

/// Grid de 6 tarjetas (2 filas x 3) del wireframe, alimentado por NUESTRO
/// backend (Prisma -> Express -> React), con filtro de categoria y boton
/// "Cargar mas" (paginacion) -> cumple el requisito de JS que cambia entre
/// categorias y carga mas elementos.
export function CatalogSection({ categories, activeCategory, onCategoryChange }: CatalogSectionProps) {
  const { user } = useAuth();
  const { notify } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [meta, setMeta] = useState<ApiListMeta | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState("");

  const tabs = [{ key: "", label: "Todo" }, ...categories.map((c) => ({ key: c.slug, label: c.name }))];

  // Carga inicial / cuando cambia categoria o busqueda -> resetea a pagina 1.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setPage(1);

    api
      .get("/products", { params: { category: activeCategory || undefined, search: search || undefined, page: 1, limit: PAGE_SIZE } })
      .then(({ data }) => {
        if (cancelled) return;
        setProducts(data.data);
        setMeta(data.meta);
      })
      .catch((err) => notify(extractErrorMessage(err), "error"))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, search]);

  // Carga los favoritos del usuario logueado para marcar los corazones.
  useEffect(() => {
    if (!user) {
      setFavoriteIds(new Set());
      return;
    }
    api
      .get("/favorites")
      .then(({ data }) => setFavoriteIds(new Set(data.data.map((f: { productId: number }) => f.productId))))
      .catch(() => {});
  }, [user]);

  async function handleLoadMore() {
    if (!meta?.hasMore) return;
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const { data } = await api.get("/products", {
        params: { category: activeCategory || undefined, search: search || undefined, page: nextPage, limit: PAGE_SIZE },
      });
      setProducts((prev) => [...prev, ...data.data]);
      setMeta(data.meta);
      setPage(nextPage);
    } catch (err) {
      notify(extractErrorMessage(err), "error");
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <section id="catalogo" className="container-app py-16 md:py-20">
      <div className="mb-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold md:text-3xl">Catalogo</h2>
          <p style={{ color: "var(--text-secondary)" }}>
            Productos de nuestra propia tienda, servidos desde el backend (Express + Prisma).
          </p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CategoryTabs options={tabs} active={activeCategory} onChange={onCategoryChange} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar producto..."
            className="input-base w-full px-4 py-2.5 text-sm md:w-64"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div key={i} className="skeleton aspect-square rounded-2xl" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="card-surface flex flex-col items-center gap-2 py-16 text-center">
          <p className="text-lg font-semibold">No encontramos productos</p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Prueba con otra categoria o termino de busqueda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isFavorite={favoriteIds.has(product.id)}
              onToggleFavorite={(id, next) =>
                setFavoriteIds((prev) => {
                  const copy = new Set(prev);
                  if (next) copy.add(id);
                  else copy.delete(id);
                  return copy;
                })
              }
            />
          ))}
        </div>
      )}

      {meta?.hasMore && (
        <div className="mt-10 flex justify-center">
          <button onClick={handleLoadMore} disabled={loadingMore} className="btn-ghost rounded-full px-8 py-3 text-sm font-medium">
            {loadingMore ? "Cargando..." : "Cargar mas productos"}
          </button>
        </div>
      )}
    </section>
  );
}
