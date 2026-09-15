import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, extractErrorMessage, getStoredToken, setStoredToken } from "../lib/api";
import type { User } from "../types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [loading, setLoading] = useState(true);

  // Al montar, si hay token guardado, valida la sesion contra /auth/me.
  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const stored = getStoredToken();
      if (!stored) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get("/auth/me");
        if (!cancelled) {
          setUser(data.data);
          setToken(stored);
        }
      } catch {
        setStoredToken(null);
        if (!cancelled) {
          setUser(null);
          setToken(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  async function login(email: string, password: string) {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setStoredToken(data.data.token);
      setToken(data.data.token);
      setUser(data.data.user);
    } catch (err) {
      throw new Error(extractErrorMessage(err, "No se pudo iniciar sesion"));
    }
  }

  async function register(name: string, email: string, password: string) {
    try {
      const { data } = await api.post("/auth/register", { name, email, password });
      setStoredToken(data.data.token);
      setToken(data.data.token);
      setUser(data.data.user);
    } catch (err) {
      throw new Error(extractErrorMessage(err, "No se pudo crear la cuenta"));
    }
  }

  function logout() {
    setStoredToken(null);
    setToken(null);
    setUser(null);
  }

  const value: AuthContextValue = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAdmin: user?.role === "ADMIN",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
