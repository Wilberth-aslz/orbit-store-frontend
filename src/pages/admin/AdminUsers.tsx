import { useEffect, useState } from "react";
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
  const { notify } = useToast();
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/users")
      .then(({ data }) => setUsers(data.data))
      .catch((err) => notify(extractErrorMessage(err), "error"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <PageSpinner />;

  return (
    <div className="animate-fade-in">
      <p className="mb-5 text-sm" style={{ color: "var(--text-secondary)" }}>
        {users.length} usuario(s) registrados
      </p>

      <div className="card-surface overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <th className="px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>Nombre</th>
              <th className="px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>Correo</th>
              <th className="px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>Rol</th>
              <th className="px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>Favoritos</th>
              <th className="px-4 py-3 font-medium" style={{ color: "var(--text-muted)" }}>Registrado</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td className="px-4 py-3 font-medium">{user.name}</td>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
