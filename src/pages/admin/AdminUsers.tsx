import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { api, extractErrorMessage } from "../../lib/api";
import { PageSpinner } from "../../components/ui/Spinner";

interface AdminUserRow {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  createdAt: string;
  _count: { favorites: number };
}

const dateFormatter = new Intl.DateTimeFormat("es-MX", { day: "2-digit", month: "short", year: "numeric" });

export function AdminUsers() {
  const { user: currentUser } = useAuth();
  const { notify } = useToast();
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    api
      .get("/users")
      .then(({ data }) => setUsers(data.data))
      .catch((err) => notify(extractErrorMessage(err), "error"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleToggleRole(target: AdminUserRow) {
    const nextRole = target.role === "ADMIN" ? "USER" : "ADMIN";
    const confirmMsg =
      nextRole === "ADMIN"
        ? `¿Dar privilegios de administrador a "${target.name}"? Podra gestionar todo el catalogo y usuarios.`
        : `¿Quitarle el rol de administrador a "${target.name}"?`;
    if (!confirm(confirmMsg)) return;

    setUpdatingId(target.id);
    try {
      const { data } = await api.patch(`/users/${target.id}/role`, { role: nextRole });
      setUsers((prev) => prev.map((u) => (u.id === target.id ? data.data : u)));
      notify(
        nextRole === "ADMIN" ? `${target.name} ahora es administrador` : `${target.name} ya no es administrador`,
        "success"
      );
    } catch (err) {
      notify(extractErrorMessage(err), "error");
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) return <PageSpinner />;

  return (
    <div className="animate-fade-in">
      <p className="mb-5 text-sm" style={{ color: "var(--text-secondary)" }}>
        {users.length} usuario(s) registrados
      </p>

      <div className="card-surface overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <th className="px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>Nombre</th>
              <th className="px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>Correo</th>
              <th className="px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>Rol</th>
              <th className="px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>Favoritos</th>
              <th className="px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>Registrado</th>
              <th className="px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isSelf = user.id === currentUser?.id;
              return (
                <tr key={user.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td className="px-4 py-3 font-medium">
                    {user.name}
                    {isSelf && (
                      <span className="ml-2 text-xs" style={{ color: "var(--text-muted)" }}>
                        (tu)
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{user.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className="rounded-full px-2.5 py-1 text-xs font-semibold"
                      style={{
                        background: user.role === "ADMIN" ? "var(--accent-soft)" : "var(--surface-2)",
                        color: user.role === "ADMIN" ? "var(--accent)" : "var(--text-secondary)",
                      }}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">{user._count.favorites}</td>
                  <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>
                    {dateFormatter.format(new Date(user.createdAt))}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {isSelf ? (
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                        —
                      </span>
                    ) : (
                      <button
                        onClick={() => handleToggleRole(user)}
                        disabled={updatingId === user.id}
                        className="btn-ghost rounded-lg px-3 py-1.5 text-xs disabled:opacity-60"
                      >
                        {updatingId === user.id ? "Guardando..." : user.role === "ADMIN" ? "Quitar admin" : "Hacer admin"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
