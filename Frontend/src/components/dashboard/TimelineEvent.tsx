import { Check, X } from "lucide-react";

interface TimelineEventProps {
  title: string;
  time: string;
  description: string;
  users: Array<number>;
  completed: boolean;
}

// Componente de evento de línea de tiempo
const TimelineEvent = ({
  title,
  time,
  description,
  users,
  completed,
}: TimelineEventProps) => {
  return (
    <div className="relative mb-8 mt-4">
      {/* Círculo de la línea de tiempo */}
      <div className="absolute -left-4 mt-1.5 h-3 w-3 rounded-full bg-teal-600 ring-4 ring-white"></div>

      {/* Tarjeta del evento */}
      <div className="ml-6 rounded-xl bg-teal-600 text-white overflow-hidden shadow-md">
        <div className="p-5">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium">{title}</h3>
              <p className="text-teal-100 text-sm mt-1">{time}</p>
            </div>

            {/* Botones de acción */}
            {completed ? (
              <div className="bg-white h-10 w-10 rounded-lg flex items-center justify-center shadow-sm">
                <Check className="h-5 w-5 text-teal-600" />
              </div>
            ) : (
              <div className="flex space-x-2">
                <div className="bg-white h-10 w-10 rounded-lg flex items-center justify-center shadow-sm">
                  <X className="h-5 w-5 text-gray-500" />
                </div>
                <div className="bg-white h-10 w-10 rounded-lg flex items-center justify-center shadow-sm">
                  <Check className="h-5 w-5 text-teal-600" />
                </div>
              </div>
            )}
          </div>

          {/* Descripción */}
          <p className="text-teal-50 text-sm mt-2">{description}</p>

          {/* Avatares de usuarios */}
          <div className="flex -space-x-3 mt-4">
            {users.map((_, id) => (
              <div
                key={id}
                className="h-9 w-9 rounded-full border-2 border-teal-600 overflow-hidden bg-white"
              >
                <img
                  src={`/api/placeholder/36/36`}
                  alt={`User ${id + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineEvent;
