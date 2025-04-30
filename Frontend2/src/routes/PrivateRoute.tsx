// src/routes/PrivateRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector";

const PrivateRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  // Si está cargando, muestra un spinner o loader
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  // Si no está autenticado, redirige al login
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
