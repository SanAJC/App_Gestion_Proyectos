// src/pages/GitHubCallbackPage.tsx
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { checkGithubCallback } from "../store/slices/authSlice";

const GitHubCallbackPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get("code");
    const token = queryParams.get("token");
    const githubToken = queryParams.get("githubToken");

    if (code) {
      // Flujo anterior si solo hay un código
      dispatch(checkGithubCallback(code))
        .unwrap()
        .then(() => {
          navigate("/dashboard");
        })
        .catch(() => {});
    } else if (token && githubToken) {
      // Nuevo flujo donde el backend ya procesó el código y nos envió los tokens
      // Establece los tokens manualmente
      localStorage.setItem("token", token);
      localStorage.setItem("githubToken", githubToken);

      // Obtener información del usuario con el token
      // (Esto requerirá una modificación en tu authSlice para manejar esta nueva acción)
      dispatch({ type: "auth/setTokens", payload: { token, githubToken } });

      // Redirigir al dashboard
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [dispatch, location, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700 mb-4"></div>
        <p className="text-gray-700">Autenticando con GitHub...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error de autenticación
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-2 px-4 bg-purple-700 hover:bg-purple-800 text-white font-medium rounded-md"
          >
            Volver al inicio de sesión
          </button>
        </div>
      </div>
    );
  }

  // Si no hay error ni está cargando, pero tampoco se ha autenticado aún
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <p className="text-gray-700">Redirigiendo...</p>
    </div>
  );
};

export default GitHubCallbackPage;
