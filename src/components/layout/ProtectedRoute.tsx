import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { Role } from "../../types";
import { PageSpinner } from "../ui/Spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: Role;
}

/// Envuelve rutas que requieren sesion iniciada, y opcionalmente un rol
/// especifico (ej. ADMIN para el panel de administracion).
export function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) return <PageSpinner />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
