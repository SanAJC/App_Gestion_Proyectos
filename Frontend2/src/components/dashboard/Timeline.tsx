// src/components/dashboard/Timeline.tsx
import React from "react";
import TimelineEvent from "./TimelineEvent";

const Timeline: React.FC = () => {
  return (
    <div className="relative pl-8 before:absolute before:left-4 before:top-0 before:h-full before:w-0.5 before:bg-teal-600">
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

export default Timeline;
