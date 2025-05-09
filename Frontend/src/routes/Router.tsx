// src/routes/Router.tsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector";
import PrivateRoute from "./PrivateRoute";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";
import ProjectBoardPage from "../pages/ProjectBoardPage"; // Importamos la nueva página

// Importamos las páginas
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import ProjectsPage from "../pages/ProjectsPage";
import GitHubCallbackPage from "../pages/GitHubCallbackPage";
import NotFoundPage from "../pages/NotFoundPage";
import ProfileSettings from "../components/settings/ProfileSettings";

const Router: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />
          }
        />
        <Route path="/github/callback" element={<GitHubCallbackPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />

        {/* Rutas privadas */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/project/:projectId" element={<ProjectBoardPage />} />
          <Route path="/settings" element={<ProfileSettings />} />
        </Route>

        {/* Ruta principal y 404 */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
