import { useEffect, useState, type FormEvent } from "react";
import { useToast } from "../../context/ToastContext";
import { api, extractErrorMessage } from "../../lib/api";
import type { Category } from "../../types";
import { Modal } from "../../components/ui/Modal";
import { PageSpinner } from "../../components/ui/Spinner";

export function AdminCategories() {
  const { notify } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get("/categories");
      setCategories(data.data);
    } catch (err) {
      notify(extractErrorMessage(err), "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openCreate() {
    setEditing(null);
    setName("");
    setModalOpen(true);
  }

  function openEdit(category: Category) {
    setEditing(category);
    setName(category.name);
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/categories/${editing.id}`, { name });
        notify("Categoria actualizada", "success");
      } else {
        await api.post("/categories", { name });
        notify("Categoria creada", "success");
      }
      setModalOpen(false);
      await load();
    } catch (err) {
      notify(extractErrorMessage(err), "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(category: Category) {
    if (!confirm(`¿Eliminar la categoria "${category.name}"?`)) return;
    try {
      await api.delete(`/categories/${category.id}`);
      notify("Categoria eliminada", "success");
      setCategories((prev) => prev.filter((c) => c.id !== category.id));
    } catch (err) {
      notify(extractErrorMessage(err), "error");
    }
  }

  if (loading) return <PageSpinner />;

  return (
    <div className="animate-fade-in">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {categories.length} categoria(s)
        </p>
        <button onClick={openCreate} className="btn-accent rounded-lg px-4 py-2.5 text-sm">
          + Nueva categoria
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div key={category.id} className="card-surface flex items-center justify-between p-4">
            <div>
              <p className="font-semibold">{category.name}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {category._count?.products ?? 0} producto(s) · /{category.slug}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(category)} className="btn-ghost rounded-lg px-3 py-1.5 text-xs">
                Editar
              </button>
              <button
                onClick={() => handleDelete(category)}
                className="rounded-lg px-3 py-1.5 text-xs"
                style={{ border: "1px solid var(--danger)", color: "var(--danger)" }}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Editar categoria" : "Nueva categoria"}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Nombre</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} className="input-base px-3 py-2 text-sm" />
          </div>
          <button type="submit" disabled={saving} className="btn-accent mt-2 rounded-lg px-4 py-3 text-sm">
            {saving ? "Guardando..." : editing ? "Guardar cambios" : "Crear categoria"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
