// src/components/auth/LoginForm.tsx
import React, { useState } from "react";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { login } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import GitHubLoginButton from "./GitHubLoginButton";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(login({ email, password })).unwrap();
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full mx-auto bg-white  shadow-md overflow-hidden">
      {/* Video a la izquierda (en lugar de imagen) */}
      <div className="md:w-2/2 bg-gradient-to-r flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Login"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Formulario a la derecha */}
      <div className="w-2xl p-8 flex flex-col justify-center ">
        <h2 className="text-4xl font-bold mb-12 text-left text-[#2C8780]">
          Bienvenido a <br />
          CoAPP{" "}
        </h2>
        {/* Botón de GitHub */}
        <GitHubLoginButton />

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <div className="px-4 text-sm text-gray-500">o</div>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#333333] mb-3 text-left"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-3  bg-[#F2F2F2] rounded-md focus:outline-none text-[#808080] "
              placeholder="juanes@gmail.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#333333] mb-4 text-left"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-[#F2F2F2] rounded-md focus:outline-none text-[#808080]"
              placeholder="********"
              required
            />
          </div>
          <div className="text-right">
            <a
              href="/contraseña-incorrecta"
              className="text-[#333333] font-medium"
            >
              ¿Haz olvidado tu contraseña?
            </a>
          </div>
          {error && (
            <div className="p-2 text-sm text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-purple-700 hover:bg-purple-800 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 mt-6"
            id="loginButton"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Iniciando sesión...
              </span>
            ) : (
              "Iniciar sesión"
            )}
          </button>

          <div className="text-center mt-4">
            <p className="text-sm text-[#333333]">
              ¿No tienes cuenta?{" "}
              <a href="/register" className="text-[#2C8780] font-medium">
                Regístrate aquí
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
