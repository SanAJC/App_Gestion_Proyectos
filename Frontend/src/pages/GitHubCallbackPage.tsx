// src/pages/GitHubCallbackPage.tsx
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { setTokens, loadUserProfile } from "../store/slices/authSlice";

const GitHubCallbackPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const githubToken = params.get("githubToken");
    const userParam = params.get("user");

    if (token && githubToken) {
      localStorage.setItem("token", token);
      localStorage.setItem("githubToken", githubToken);

      // Si viene el usuario en la URL, lo guardamos
      if (userParam) {
        const user = JSON.parse(decodeURIComponent(userParam));
        localStorage.setItem("user", JSON.stringify(user));
        dispatch(setTokens({ token, githubToken, user }));
      } else {
        // Si no viene, intenta cargarlo desde el backend
        dispatch(setTokens({ token, githubToken }));
        dispatch(loadUserProfile());
      }

      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [dispatch, location, navigate]);

  return null; // Este componente no necesita renderizar nada
};

export default GitHubCallbackPage;
