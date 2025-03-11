// src/pages/DashboardPage.tsx
import React from "react";
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { logout } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

const DashboardPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              Hola, {user?.username || "Usuario"}
            </span>
            <button
              onClick={handleLogout}
              className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Bienvenido a tu panel</h2>
          <p className="text-gray-600">
            Has iniciado sesión correctamente. Aquí puedes comenzar a utilizar
            todas las funcionalidades de la aplicación.
          </p>

          {/* Aquí puedes agregar el contenido principal del dashboard */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Tarjeta de ejemplo */}
            <div className="bg-purple-50 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-purple-800">
                  Proyectos
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Administra tus proyectos y colabora con otros desarrolladores.
                </p>
              </div>
              <div className="bg-purple-100 px-4 py-3">
                <a
                  href="#"
                  className="text-sm font-medium text-purple-700 hover:text-purple-900"
                >
                  Ver proyectos →
                </a>
              </div>
            </div>

            {/* Otra tarjeta de ejemplo */}
            <div className="bg-indigo-50 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-indigo-800">
                  Repositorios
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Conecta tus repositorios de GitHub y gestiona tu código.
                </p>
              </div>
              <div className="bg-indigo-100 px-4 py-3">
                <a
                  href="#"
                  className="text-sm font-medium text-indigo-700 hover:text-indigo-900"
                >
                  Ver repositorios →
                </a>
              </div>
            </div>

            {/* Tercera tarjeta de ejemplo */}
            <div className="bg-blue-50 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-blue-800">Perfil</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Actualiza tu información personal y configura tu cuenta.
                </p>
              </div>
              <div className="bg-blue-100 px-4 py-3">
                <a
                  href="#"
                  className="text-sm font-medium text-blue-700 hover:text-blue-900"
                >
                  Editar perfil →
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
