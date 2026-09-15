import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PasswordInput } from "../components/ui/PasswordInput";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesion");
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(role: "admin" | "user") {
    setEmail(role === "admin" ? "admin@orbit.com" : "user@orbit.com");
    setPassword(role === "admin" ? "Admin123!" : "User123!");
  }

  return (
    <div className="container-app flex min-h-[80vh] items-center justify-center py-16">
      <div className="card-surface w-full max-w-md p-8 animate-fade-in">
        <h1 className="text-2xl font-bold">Inicia sesion</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          Accede a tu cuenta de ORBIT Store
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="email">
              Correo
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-base px-4 py-2.5 text-sm"
              placeholder="tucorreo@ejemplo.com"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="password">
              Contrasena
            </label>
            <PasswordInput
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-base px-4 py-2.5 text-sm"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="rounded-lg px-3 py-2 text-sm" style={{ background: "var(--danger-soft)", color: "var(--danger)" }}>
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-accent mt-2 rounded-lg px-4 py-3 text-sm">
            {loading ? "Entrando..." : "Iniciar sesion"}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-2 border-t pt-5" style={{ borderColor: "var(--border)" }}>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Cuentas de prueba (creadas por el seed del backend):
          </p>
          <div className="flex gap-2">
            <button type="button" onClick={() => fillDemo("admin")} className="btn-ghost flex-1 rounded-lg px-3 py-2 text-xs">
              Usar admin demo
            </button>
            <button type="button" onClick={() => fillDemo("user")} className="btn-ghost flex-1 rounded-lg px-3 py-2 text-xs">
              Usar usuario demo
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
          ¿No tienes cuenta?{" "}
          <Link to="/register" style={{ color: "var(--accent)" }}>
            Registrate
          </Link>
        </p>
      </div>
    </div>
  );
}
