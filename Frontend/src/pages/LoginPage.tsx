// src/pages/LoginPage.tsx
import React from "react";
import LoginForm from "../components/auth/LoginForm";

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex justify-center">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
