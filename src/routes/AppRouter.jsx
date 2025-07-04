import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Páginas públicas
import Login from "../pages/Login";
import Register from "../pages/Register";
import RecuperarContraseña from "../pages/RecuperarContraseña";

// Páginas protegidas
import Home from "../pages/Home";
import ProtectedRoute from "../routes/ProtectedRoute";
import ProtectedByRole from "../routes/ProtectedByRole";

// Cliente
import ClienteDashboard from "../pages/cliente/ClienteDashboard";

// Admin
import AdminLayout from "../pages/admin/layout/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProductos from "../pages/admin/AdminProductos";
import AdminUsuarios from "../pages/admin/AdminUsuarios";
import AdminAdministradores from "../pages/admin/AdminAdministradores";
import AdminEmpresas from "../pages/admin/AdminEmpresas";

export default function AppRouter() {
  return (
    <Routes>
      {/* Redirección inicial */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/recuperar" element={<RecuperarContraseña />} />

      {/* Rutas protegidas generales */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* Rutas protegidas por rol: Cliente */}
      <Route
        path="/cliente/dashboard"
        element={
          <ProtectedByRole allowed={["cliente"]}>
            <ClienteDashboard />
          </ProtectedByRole>
        }
      />

      {/* Rutas protegidas por rol: Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedByRole allowed={["admin"]}>
            <AdminLayout />
          </ProtectedByRole>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="productos" element={<AdminProductos />} />
        <Route path="usuarios" element={<AdminUsuarios />} />
        <Route path="administradores" element={<AdminAdministradores />} />
        <Route path="empresas" element={<AdminEmpresas />} />
        <Route
          path="test"
          element={<div className="bg-warning p-3">TEST ADMIN</div>}
        />
      </Route>
    </Routes>
  );
}

