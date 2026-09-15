import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PasswordInput } from "../components/ui/PasswordInput";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la cuenta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-app flex min-h-[80vh] items-center justify-center py-16">
      <div className="card-surface w-full max-w-md p-8 animate-fade-in">
        <h1 className="text-2xl font-bold">Crea tu cuenta</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          Guarda tus productos favoritos en ORBIT Store
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" htmlFor="name">
              Nombre
            </label>
            <input
              id="name"
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-base px-4 py-2.5 text-sm"
              placeholder="Tu nombre"
            />
          </div>
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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-base px-4 py-2.5 text-sm"
              placeholder="Minimo 6 caracteres"
            />
          </div>

          {error && (
            <p className="rounded-lg px-3 py-2 text-sm" style={{ background: "var(--danger-soft)", color: "var(--danger)" }}>
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-accent mt-2 rounded-lg px-4 py-3 text-sm">
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" style={{ color: "var(--accent)" }}>
            Inicia sesion
          </Link>
        </p>
      </div>
    </div>
  );
}
