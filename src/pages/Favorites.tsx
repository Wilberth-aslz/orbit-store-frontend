import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { api, extractErrorMessage } from "../lib/api";
import { PageSpinner } from "../components/ui/Spinner";
import { ProductCard } from "../components/ui/ProductCard";
import { IconHeart } from "../components/ui/Icons";
import type { Favorite } from "../types";

export default function Favorites() {
  const { notify } = useToast();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/favorites")
      .then(({ data }) => setFavorites(data.data))
      .catch((err) => notify(extractErrorMessage(err), "error"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <PageSpinner />;

  return (
    <div className="container-app animate-fade-in py-14">
      <h1 className="text-2xl font-bold md:text-3xl">Tus favoritos</h1>
      <p className="mt-1" style={{ color: "var(--text-secondary)" }}>
        Productos que guardaste para despues.
      </p>

      {favorites.length === 0 ? (
        <div className="card-surface mt-8 flex flex-col items-center gap-3 py-16 text-center">
          <p className="text-lg font-semibold">Aun no tienes favoritos</p>
          <p className="flex items-center justify-center gap-1.5 text-sm" style={{ color: "var(--text-muted)" }}>
            Explora el catalogo y guarda lo que te guste con
            <IconHeart size={14} />
          </p>
          <Link to="/" className="btn-accent mt-2 rounded-lg px-5 py-2.5 text-sm">
            Ir al catalogo
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((fav) => (
            <ProductCard
              key={fav.id}
              product={fav.product}
              isFavorite
              onToggleFavorite={(productId, next) => {
                if (!next) setFavorites((prev) => prev.filter((f) => f.productId !== productId));
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
