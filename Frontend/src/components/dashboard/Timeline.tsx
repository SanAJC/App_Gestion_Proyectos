import {  Clock } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/services/api";
import { Task } from "@/types/task";

interface TimelineTaskProps {
  id: string;
  title: string;
  status: string;
  projectTitle: string;
  projectId: string;
  assignees: {
    id: string;
    image: string;
    username?: string;
    email?: string;
    displayName?: string;
  }[];
}

const Timeline = () => {
  const [recentTasks, setRecentTasks] = useState<TimelineTaskProps[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchRecentTasks = async () => {
      try {
        // Obtener información del usuario autenticado
        const userUid = localStorage.getItem("uid");
        const userEmail = localStorage.getItem("userEmail");

        if (!userUid && !userEmail) {
          console.error("No se encontró información del usuario autenticado");
          setLoading(false);
          return;
        }

        // Primero obtenemos los proyectos del usuario
        const projectsResponse = await api.get(`/projects/user/${userUid}`);
        const projects = projectsResponse.data.projects || [];

        if (projects.length === 0) {
          setLoading(false);
          return;
        }

        // Optimización: Limitar a solo 3 proyectos más recientes para reducir las peticiones
        const recentProjects = projects.slice(0, 3);

        // Para cada proyecto, obtenemos sus tareas (en paralelo)
        const taskPromises = recentProjects.map(async (project: any) => {
          try {
            const tasksResponse = await api.get(`/tasks/${project.id}`);
            const tasks = tasksResponse.data.tasks || [];

            // Filtrar solo las tareas asignadas al usuario actual
            const userTasks = tasks.filter(
              (task: Task) =>
                task.assignees &&
                task.assignees.some(
                  (assignee) =>
                    assignee.id === userUid || assignee.email === userEmail
                )
            );

            // Devolver las tareas con información del proyecto
            return userTasks.map((task: Task) => ({
              ...task,
              projectTitle: project.title,
              projectId: project.id,
            }));
          } catch (error) {
            console.error(
              `Error al obtener tareas del proyecto ${project.id}:`,
              error
            );
            return [];
          }
        });

        // Esperamos todas las promesas y aplanamos el array
        const allTasks = (await Promise.all(taskPromises)).flat();

        // Optimización: Ordenamos y limitamos las tareas en memoria en lugar de pedir múltiples veces
        const sortedTasks = allTasks
          .sort((a, b) => {
            // Primero por estado
            if (a.status === "hecho" && b.status !== "hecho") return 1;
            if (a.status !== "hecho" && b.status === "hecho") return -1;

            // Luego por fecha de creación si existe (mostrando las más recientes primero)
            if (a.createdAt && b.createdAt) {
              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              );
            }
            return 0;
          })
          .slice(0, 3);

        setRecentTasks(sortedTasks);
      } catch (error) {
        console.error("Error al obtener las tareas recientes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentTasks();
  }, []);

  if (loading) {
    return (
      <div className="relative pl-6 before:absolute before:left-3 before:top-0 before:h-full before:w-0.5 before:bg-[#2C8780]">
        <div className="text-center py-4">Cargando tareas recientes...</div>
      </div>
    );
  }

  if (recentTasks.length === 0) {
    return (
      <div className="relative pl-6 before:absolute before:left-3 before:top-0 before:h-full before:w-0.5 before:bg-[#2C8780]">
        <div className="text-center py-4">No hay tareas recientes</div>
      </div>
    );
  }

  return (
    <div className="relative pl-6 before:absolute before:left-3 before:top-0 before:h-full before:w-0.5 before:bg-[#2C8780]">
      {recentTasks.map((task, ) => (
        <TimelineEvent
          key={task.id}
          title={task.title}
          description={`En proyecto: ${task.projectTitle}`}
          users={task.assignees}
          completed={task.status === "hecho"}
          status={task.status}
          projectId={task.projectId}
        />
      ))}
    </div>
  );
};

interface TimelineEventProps {
  title: string;
  description: string;
  users: {
    id: string;
    image: string;
    username?: string;
    email?: string;
    displayName?: string;
  }[];
  completed: boolean;
  status: string;
  projectId: string;
}

const TimelineEvent = ({
  title,
  description,
  users,
  
  status,
  projectId,
}: TimelineEventProps) => {
  // Obtener un color basado en el estado
  const getStatusColor = () => {
    switch (status) {
      case "hecho":
        return "bg-green-600";
      case "en-proceso":
        return "bg-blue-600";
      case "por-verificar":
        return "bg-yellow-600";
      default:
        return "bg-[#2C8780]";
    }
  };

  // Traducir el estado para mostrar
  const getStatusText = () => {
    switch (status) {
      case "hecho":
        return "Completada";
      case "en-proceso":
        return "En proceso";
      case "por-verificar":
        return "Por verificar";
      default:
        return "Por hacer";
    }
  };

  return (
    <div className="relative mb-12 mt-6">
      {/* Círculo de la línea de tiempo */}
      <div
        className={`absolute -left-4 mt-1.5 h-3 w-3 rounded-full ${getStatusColor()}`}
      ></div>

      {/* Tarjeta del evento */}
      <div
        className={`ml-6 rounded-2xl ${getStatusColor()} text-white overflow-hidden shadow-md h-44`}
      >
        <div className="p-6 h-full relative">
          {/* Título */}
          <h3 className="text-lg font-semibold text-left">{title}</h3>

          {/* Estado en la esquina superior derecha */}
          <div className="absolute top-7 right-6 text-white text-base flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {getStatusText()}
          </div>

          {/* Descripción */}
          <p className="text-white opacity-80 text-sm mt-2 max-w-[230px] text-left">
            {description}
          </p>

          {/* Avatares de usuarios en la parte inferior izquierda */}
          <div className="absolute bottom-6 left-6 flex -space-x-3">
            {users.length > 0 ? (
              users.slice(0, 3).map((user, id) => (
                <div
                  key={id}
                  className="h-9 w-9 rounded-full border-1.5 border-white overflow-hidden bg-white"
                  title={user.username || user.displayName || user.email}
                >
                  <img
                    src={user.image}
                    alt={user.username || "Usuario"}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="h-9 w-9 rounded-full border-1.5 border-white overflow-hidden bg-white">
                <div className="h-full w-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-500 text-xs">Sin asignar</span>
                </div>
              </div>
            )}
            {users.length > 3 && (
              <div className="h-9 w-9 rounded-full border-1.5 border-white flex items-center justify-center bg-white text-gray-600 text-xs font-medium">
                +{users.length - 3}
              </div>
            )}
          </div>

          {/* Botones de acción en la parte inferior derecha */}
          <a
            href={`/project/${projectId}`}
            className="absolute bottom-6 right-6 bg-white h-9 px-3 rounded-md flex items-center justify-center text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Ver tarea
          </a>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
