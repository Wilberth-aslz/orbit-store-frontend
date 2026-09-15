import { useEffect, useState, type FormEvent } from "react";
import { useToast } from "../../context/ToastContext";
import { api, extractErrorMessage } from "../../lib/api";
import type { Category, Product } from "../../types";
import { Modal } from "../../components/ui/Modal";
import { PageSpinner } from "../../components/ui/Spinner";

const currency = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });

interface FormState {
  name: string;
  description: string;
  price: string;
  stock: string;
  imageUrl: string;
  categoryId: string;
}

const EMPTY_FORM: FormState = { name: "", description: "", price: "", stock: "", imageUrl: "", categoryId: "" };

export function AdminProducts() {
  const { notify } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  async function loadAll() {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get("/products", { params: { limit: 50 } }),
        api.get("/categories"),
      ]);
      setProducts(productsRes.data.data);
      setCategories(categoriesRes.data.data);
    } catch (err) {
      notify(extractErrorMessage(err), "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(product: Product) {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock),
      imageUrl: product.imageUrl,
      categoryId: String(product.categoryId),
    });
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
      imageUrl: form.imageUrl,
      categoryId: Number(form.categoryId),
    };
    try {
      if (editing) {
        await api.put(`/products/${editing.id}`, payload);
        notify("Producto actualizado", "success");
      } else {
        await api.post("/products", payload);
        notify("Producto creado", "success");
      }
      setModalOpen(false);
      await loadAll();
    } catch (err) {
      notify(extractErrorMessage(err), "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(product: Product) {
    if (!confirm(`¿Eliminar "${product.name}"? Esta accion no se puede deshacer.`)) return;
    try {
      await api.delete(`/products/${product.id}`);
      notify("Producto eliminado", "success");
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    } catch (err) {
      notify(extractErrorMessage(err), "error");
    }
  }

  if (loading) return <PageSpinner />;

  return (
    <div className="animate-fade-in">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {products.length} producto(s) en el catalogo
        </p>
        <button onClick={openCreate} className="btn-accent rounded-lg px-4 py-2.5 text-sm">
          + Nuevo producto
        </button>
      </div>

      <div className="card-surface overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <th className="px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>Producto</th>
              <th className="px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>Categoria</th>
              <th className="px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>Precio</th>
              <th className="px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>Stock</th>
              <th className="px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td className="flex items-center gap-3 px-4 py-3">
                  <img src={product.imageUrl} alt="" className="h-10 w-10 rounded-lg object-cover" style={{ background: "var(--surface-2)" }} />
                  <span className="max-w-[220px] truncate font-medium">{product.name}</span>
                </td>
                <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{product.category.name}</td>
                <td className="px-4 py-3">{currency.format(product.price)}</td>
                <td className="px-4 py-3">{product.stock}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(product)} className="btn-ghost rounded-lg px-3 py-1.5 text-xs">
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
                      className="rounded-lg px-3 py-1.5 text-xs"
                      style={{ border: "1px solid var(--danger)", color: "var(--danger)" }}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar producto" : "Nuevo producto"}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Nombre</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-base px-3 py-2 text-sm" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Descripcion</label>
            <textarea
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input-base px-3 py-2 text-sm"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Precio (MXN)</label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="input-base px-3 py-2 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Stock</label>
              <input
                required
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="input-base px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">URL de imagen</label>
            <input
              required
              type="url"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="input-base px-3 py-2 text-sm"
              placeholder="https://..."
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Categoria</label>
            <select
              required
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="input-base px-3 py-2 text-sm"
            >
              <option value="" disabled>
                Selecciona una categoria
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={saving} className="btn-accent mt-2 rounded-lg px-4 py-3 text-sm">
            {saving ? "Guardando..." : editing ? "Guardar cambios" : "Crear producto"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
