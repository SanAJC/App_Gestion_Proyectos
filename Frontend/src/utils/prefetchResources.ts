// Este archivo configura el prefetch de recursos críticos para mejorar la experiencia de usuario
import { useEffect } from "react";


const COMPONENTS_TO_PREFETCH = [
  () => import("@/components/dashboard/RadarChart"),
  () => import("@/components/dashboard/CalendarCard"),
  () => import("@/components/dashboard/CreateTaskCard"),
  () => import("@/components/dashboard/Timeline"),
  () => import("@/components/boardTrello/create-task-modal"),
];


const CRITICAL_RESOURCES = [
  "../public/assets/img/Vector.svg",
  "../public/assets/img/Logo.svg",
];

export function usePrefetchResources() {
  useEffect(() => {
    
    const prefetchComponent = async (importFn: () => Promise<any>) => {
      try {
        await importFn();
      } catch (e) {
        console.warn("Error precargando componente:", e);
      }
    };

    
    const prefetchImage = (url: string) => {
      const img = new Image();
      img.src = url;
    };

    
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(() => {
        
        COMPONENTS_TO_PREFETCH.forEach((importFn) => {
          prefetchComponent(importFn);
        });

        
        CRITICAL_RESOURCES.forEach((url) => {
          prefetchImage(url);
        });
      });
    } else {
      // Fallback para navegadores que no soportan requestIdleCallback
      setTimeout(() => {
        COMPONENTS_TO_PREFETCH.forEach((importFn) => {
          prefetchComponent(importFn);
        });

        CRITICAL_RESOURCES.forEach((url) => {
          prefetchImage(url);
        });
      }, 1000); 
    }
  }, []);
}

export default usePrefetchResources;
