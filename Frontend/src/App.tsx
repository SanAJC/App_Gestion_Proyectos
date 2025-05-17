// src/App.tsx
import React, { useEffect } from "react";
import Router from "./routes/Router";
import { useAppSelector } from "./hooks/useAppSelector";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { loadUserProfile } from "./store/slices/authSlice";

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Si hay un token (isAuthenticated) pero no hay información de usuario, cargar el perfil
    if (isAuthenticated && !user) {
      dispatch(loadUserProfile());
    }
  }, [dispatch, isAuthenticated, user]);

  return <Router />;
};

export default App;