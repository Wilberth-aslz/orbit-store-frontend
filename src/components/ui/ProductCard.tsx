import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { api, extractErrorMessage } from "../../lib/api";
import type { Product } from "../../types";

const currency = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });

interface ProductCardProps {
  product: Product;
  isFavorite?: boolean;
  onToggleFavorite?: (productId: number, next: boolean) => void;
}

export function ProductCard({ product, isFavorite = false, onToggleFavorite }: ProductCardProps) {
  const { user } = useAuth();
  const { notify } = useToast();
  const [busy, setBusy] = useState(false);
  const [favState, setFavState] = useState(isFavorite);

  async function handleToggleFavorite() {
    if (!user) {
      notify("Inicia sesion para guardar favoritos", "info");
      return;
    }
    setBusy(true);
    try {
      if (favState) {
        await api.delete(`/favorites/${product.id}`);
        setFavState(false);
        onToggleFavorite?.(product.id, false);
        notify("Se quito de tus favoritos", "info");
      } else {
        await api.post(`/favorites/${product.id}`);
        setFavState(true);
        onToggleFavorite?.(product.id, true);
        notify("Agregado a tus favoritos", "success");
      }
    } catch (err) {
      notify(extractErrorMessage(err), "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="card-surface group flex flex-col overflow-hidden transition-transform hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden" style={{ background: "var(--surface-2)" }}>
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <button
          onClick={handleToggleFavorite}
          disabled={busy}
          aria-label={favState ? "Quitar de favoritos" : "Agregar a favoritos"}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-base backdrop-blur transition-transform hover:scale-110 disabled:opacity-60"
          style={{ background: "rgba(10,15,26,0.65)", color: favState ? "var(--accent)" : "#fff" }}
        >
          {favState ? "♥" : "♡"}
        </button>
        {product.stock <= 3 && product.stock > 0 && (
          <span
            className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold"
            style={{ background: "var(--warning)", color: "#1a1400" }}
          >
            Quedan {product.stock}
          </span>
        )}
        {product.stock === 0 && (
          <span
            className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold"
            style={{ background: "var(--danger)", color: "#2a0a0a" }}
          >
            Agotado
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <span
          className="w-fit rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide"
          style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
        >
          {product.category.name}
        </span>
        <h3 className="line-clamp-2 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {product.name}
        </h3>
        <p className="line-clamp-2 text-xs" style={{ color: "var(--text-muted)" }}>
          {product.description}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
            {currency.format(product.price)}
          </span>
        </div>
      </div>
    </article>
  );
}
