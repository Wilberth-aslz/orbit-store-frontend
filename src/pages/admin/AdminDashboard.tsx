import { useState } from "react";
import { AdminCategories } from "./AdminCategories";
import { AdminProducts } from "./AdminProducts";
import { AdminUsers } from "./AdminUsers";

type Tab = "products" | "categories" | "users";

const TABS: { key: Tab; label: string }[] = [
  { key: "products", label: "Productos" },
  { key: "categories", label: "Categorias" },
  { key: "users", label: "Usuarios" },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("products");

  return (
    <div className="container-app animate-fade-in py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold md:text-3xl">Panel de administracion</h1>
        <p className="mt-1" style={{ color: "var(--text-secondary)" }}>
          Gestiona el catalogo de ORBIT Store: productos, categorias y usuarios.
        </p>
      </div>

      <div className="mb-8 flex gap-2 border-b" style={{ borderColor: "var(--border)" }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="px-4 py-3 text-sm font-medium"
            style={{
              color: tab === t.key ? "var(--accent)" : "var(--text-secondary)",
              borderBottom: tab === t.key ? "2px solid var(--accent)" : "2px solid transparent",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "products" && <AdminProducts />}
      {tab === "categories" && <AdminCategories />}
      {tab === "users" && <AdminUsers />}
    </div>
  );
}
