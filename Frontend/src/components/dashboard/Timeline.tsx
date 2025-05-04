import { Check, X } from "lucide-react";

const Timeline = () => {
  return (
    <div className="relative pl-6 before:absolute before:left-3 before:top-0 before:h-full before:w-0.5 before:bg-[#2C8780]">
      <TimelineEvent
        title="Llamada diaria"
        time="9:00 AM"
        description="Debatir las tareas del equipo para el día."
        users={[1, 2, 3, 4]}
        completed={true}
      />
      <TimelineEvent
        title="Reunión sobre requisitos"
        time="11:00 AM"
        description="Discutir las directrices de los requisitos para el proyecto."
        users={[1, 2, 3, 4]}
        completed={false}
      />
    </div>
  );
};

interface TimelineEventProps {
  title: string;
  time: string;
  description: string;
  users: number[];
  completed: boolean;
}

const TimelineEvent = ({
  title,
  time,
  description,
  users,
  completed,
}: TimelineEventProps) => {
  return (
    <div className="relative mb-12 mt-6">
      {/* Círculo de la línea de tiempo */}
      <div className="absolute -left-4 mt-1.5 h-3 w-3 rounded-full bg-[#2C8780]"></div>

      {/* Tarjeta del evento */}
      <div className="ml-6 rounded-2xl bg-[#2C8780] text-white overflow-hidden shadow-md h-44">
        <div className="p-6 h-full relative">
          {/* Título */}
          <h3 className="text-lg font-semibold text-left">{title}</h3>

          {/* Hora en la esquina superior derecha */}
          <div className="absolute top-7 right-6 text-white text-base">
            {time}
          </div>

          {/* Descripción */}
          <p className="text-white opacity-80 text-sm mt-2 max-w-[230px] text-left">
            {description}
          </p>

          {/* Avatares de usuarios en la parte inferior izquierda */}
          <div className="absolute bottom-6 left-6 flex -space-x-3">
            {users.map((_, id) => (
              <div
                key={id}
                className="h-9 w-9 rounded-full border-1.5 border-white overflow-hidden bg-white"
              >
                <img
                  src={`/api/placeholder/37/37`}
                  alt={`User ${id + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Botones de acción en la parte inferior derecha */}
          {completed ? (
            <div className="absolute bottom-6 right-6 bg-white h-9 w-9 rounded-md flex items-center justify-center">
              <Check className="w-5 h-5 text-[#2C8780]" />
            </div>
          ) : (
            <div className="absolute bottom-6 right-6 flex space-x-3">
              <div className="bg-white h-9 w-9 rounded-md flex items-center justify-center">
                <X className="w-5 h-5 text-[#A1A1AA]" />
              </div>
              <div className="bg-white h-9 w-9 rounded-md flex items-center justify-center">
                <Check className="w-5 h-5 text-[#2C8780]" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
