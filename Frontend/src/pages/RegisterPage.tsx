// src/pages/RegisterPage.tsx
import React from "react";
import RegisterForm from "../components/auth/RegisterForm";

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen flex  justify-center ">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
