import { lazy } from "react";

// Función para mejorar la carga de componentes lazy
function createLazyComponent(importFn: () => Promise<any>) {
  const Component = lazy(importFn);

  // Inicia la precarga inmediatamente
  importFn();

  return Component;
}


export const RadarChart = createLazyComponent(
  () => import("@/components/dashboard/RadarChart")
);

export const CalendarCard = createLazyComponent(
  () => import("@/components/dashboard/CalendarCard")
);

export const CreateTaskCard = createLazyComponent(
  () => import("@/components/dashboard/CreateTaskCard")
);

export const Timeline = createLazyComponent(
  () => import("@/components/dashboard/Timeline")
);

export const CreateTaskModal = createLazyComponent(
  () => import("@/components/boardTrello/create-task-modal")
);
