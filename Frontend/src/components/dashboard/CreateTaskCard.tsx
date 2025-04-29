// src/components/dashboard/CreateTaskCard.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const CreateTaskCard: React.FC = () => {
  return (
    <div className="bg-teal-800 rounded-lg p-4 text-white">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-lg font-medium">Crear Tarea</h3>
          <p className="text-sm opacity-90">Crear nueva tarea</p>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-white text-teal-800 hover:bg-teal-50 border-none"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default CreateTaskCard;
