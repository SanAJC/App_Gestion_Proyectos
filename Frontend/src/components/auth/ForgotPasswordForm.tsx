import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Aquí irá la lógica para enviar el correo de recuperación
      // Por ahora solo simulamos una respuesta
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage("Se ha enviado un enlace de recuperación a tu correo");
    } catch (error) {
        setMessage(`Error al enviar el correo de recuperación: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold mb-8 text-[#2C8780]">
          Recuperar contraseña
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#333333] mb-2 text-justify">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-[#F2F2F2] rounded-md focus:outline-none"
              placeholder="correo@ejemplo.com"
              required
            />
          </div>

          {message && (
            <div className={`p-2 text-sm rounded-md ${
              message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-[#2C8780] hover:bg-black text-white font-medium rounded-md focus:outline-none disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Enviar enlace de recuperación"}
          </button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-[#333333] hover:underline"
            >
              Volver al inicio de sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;