// src/components/dashboard/CreateTaskCard.tsx
import React from "react";

interface CreateTaskCardProps {
  onClick?: () => void;
}

const CreateTaskCard: React.FC<CreateTaskCardProps> = ({ onClick }) => {
  // Función para manejar el clic en la tarjeta completa
  const handleCardClick = () => {
    if (onClick) onClick();
  };

  return (
    <div
      className="bg-[#2C8780] rounded-xl text-white w-full h-24 cursor-pointer relative"
      style={{
        background: "linear-gradient(228deg, #2C8780 0%, #232323 100%)",
        borderRadius: "12px",
      }}
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-center p-4 h-full">
        <div className="ml-2">
          <h3 className="text-lg font-semibold font-poppins">Crear Tarea</h3>
          <p className="text-sm font-normal font-poppins">Crear nueva tarea</p>
        </div>
        <div
          className="flex items-center justify-center bg-white rounded-md h-13 w-13 text-[#0C0B0B]"
          style={{ width: "52px", height: "52px" }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="w-6 h-0.5 bg-[#0C0B0B] rounded-lg absolute"></div>
            <div className="w-0.5 h-6 bg-[#0C0B0B] rounded-lg absolute"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskCard;
