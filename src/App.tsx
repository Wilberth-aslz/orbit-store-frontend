import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Footer } from "./components/layout/Footer";
import { MobileTopBar } from "./components/layout/MobileTopBar";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { Sidebar } from "./components/layout/Sidebar";
import Favorites from "./pages/Favorites";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopBar onOpenMenu={() => setMenuOpen(true)} />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/favoritos"
              element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="container-app flex min-h-[60vh] flex-col items-center justify-center gap-2 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p style={{ color: "var(--text-secondary)" }}>Esta pagina no existe.</p>
    </div>
  );
}
