// src/App.tsx
import React, { useEffect } from "react";
import Router from "./routes/Router";
import { useAppSelector } from "./hooks/useAppSelector";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { loadUserProfile } from "./store/slices/authSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import usePrefetchResources from "./utils/prefetchResources";
import "./styles/optimizations.css"; // Importamos las optimizaciones

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // Usar el hook para precargar recursos
  usePrefetchResources();

  useEffect(() => {
    // Si hay un token (isAuthenticated) pero no hay información de usuario, cargar el perfil
    if (isAuthenticated && !user) {
      dispatch(loadUserProfile());
    }
  }, [dispatch, isAuthenticated, user]);

  return (
    <>
      <Router />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default App;
