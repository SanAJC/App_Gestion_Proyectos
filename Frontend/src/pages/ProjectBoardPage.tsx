// src/pages/ProjectBoardPage.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Pencil, Search, LayoutGrid, List, Github } from "lucide-react";
import BoardView from "@/components/boardTrello/board-view";
import ListView from "@/components/boardTrello/list-view";
import CreateTaskModal from "@/components/boardTrello/create-task-modal";
import Sidebar from "@/components/boardTrello/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import api from "@/services/api";
import { Task } from "@/types/task";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function ProjectBoardPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeView, setActiveView] = useState<"board" | "list">("board");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialStatus, setModalInitialStatus] = useState<
    "por-hacer" | "en-proceso" | "hecho" | "por-verificar"
  >("por-hacer");
  const [isGithubSheetOpen, setIsGithubSheetOpen] = useState(false);
  const [githubBranches, setGithubBranches] = useState<string[]>([]);
  const [githubRepoInfo, setGithubRepoInfo] = useState<any>(null);
  const [githubLoading, setGithubLoading] = useState(false);
  const [githubError, setGithubError] = useState<string | null>(null);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [errorTasks, setErrorTasks] = useState<string | null>(null);
  const [savingTask, setSavingTask] = useState(false);
  const [updatingTaskStatus, setUpdatingTaskStatus] = useState<string | null>(
    null
  );
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [projectMembers, setProjectMembers] = useState<
    { id: string; email: string; username: string; image: string }[]
  >([]);
  const [projectDetails, setProjectDetails] = useState<any>(null);

  // Obtener la información del usuario autenticado
  const currentUser = useSelector((state: RootState) => state.auth.user);

  // Cargar tareas y detalles del proyecto al montar el componente
  useEffect(() => {
    fetchTasks();
    fetchProjectDetails();
  }, [projectId]);

  // Función para obtener las tareas del backend
  const fetchTasks = () => {
    if (projectId) {
      setLoadingTasks(true);
      setErrorTasks(null);
      api
        .get(`/tasks/${projectId}`)
        .then((response) => {
          const tasksData = response.data.tasks || response.data;

          if (Array.isArray(tasksData)) {
            setTasks(tasksData);
          } else {
            console.error(
              "API did not return an array on fetch:",
              response.data
            );
            setTasks([]);
            setErrorTasks("Invalid data format from API.");
          }
          setLoadingTasks(false);
        })
        .catch((error) => {
          console.error("Error fetching tasks:", error);
          setErrorTasks("Failed to load tasks.");
          setLoadingTasks(false);
        });
    }
  };

  // Función para obtener los detalles del proyecto
  const fetchProjectDetails = async () => {
    if (!projectId) return;

    try {
      const response = await api.get(`/projects/${projectId}`);
      const projectData = response.data.project || response.data;

      setProjectDetails(projectData);

      // Procesar los miembros del proyecto
      if (
        projectData &&
        projectData.miembros &&
        Array.isArray(projectData.miembros)
      ) {
        const membersPromises = projectData.miembros.map(
          async (email: string) => {
            try {
              // Obtener información detallada del usuario
              const userResponse = await api.get(
                `/auth/check-user?email=${encodeURIComponent(email)}`
              );
              const userData = userResponse.data;

              return {
                id:
                  userData.userId ||
                  `user-${Math.random().toString(36).substring(2, 9)}`,
                email: email,
                username: userData.exists ? userData.username : email,
                image: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  userData.username || email
                )}&background=random`,
              };
            } catch (error) {
              console.error(
                `Error al obtener datos del usuario ${email}:`,
                error
              );
              return {
                id: `user-${Math.random().toString(36).substring(2, 9)}`,
                email: email,
                username: email,
                image: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  email
                )}&background=random`,
              };
            }
          }
        );

        const membersData = await Promise.all(membersPromises);
        setProjectMembers(membersData);
      }
    } catch (error) {
      console.error("Error al obtener detalles del proyecto:", error);
    }
  };
  useEffect(() => {
    if (isGithubSheetOpen && projectDetails?.githubRepo?.url) {
      setGithubLoading(true);
      setGithubError(null);

      // Extraer usuario y nombre del repositorio de la URL
      const githubUrlParts = projectDetails.githubRepo.url.match(
        /github\.com\/([^\/]+)\/([^\/]+)/
      );
      const repoOwner = githubUrlParts ? githubUrlParts[1] : "empresa";
      const repoName = githubUrlParts ? githubUrlParts[2] : projectId;

      // Obtener ramas
      fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/branches`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setGithubBranches(data.map((b: any) => b.name));
          } else {
            console.error("GitHub API did not return an array:", data);
            setGithubBranches([]);
            setGithubError("Invalid data format from GitHub API.");
          }
        })
        .catch((err) => {
          console.error("Error al cargar ramas de GitHub:", err);
          setGithubError("Error al cargar ramas de GitHub");
        })
        .finally(() => {
          setGithubLoading(false);
        });

      // Obtener información del repositorio
      fetch(`https://api.github.com/repos/${repoOwner}/${repoName}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.id) {
            setGithubRepoInfo(data);
          } else {
            console.error("GitHub API did not return repo data:", data);
          }
        })
        .catch((err) => {
          console.error("Error al cargar información del repositorio:", err);
        });
    }
  }, [isGithubSheetOpen, projectId, projectDetails]);

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    const task = tasks.find((t) => t.id === draggableId);
    if (!task) return;

    const originalTasks = [...tasks];

    const newTasks = [...tasks];
    const taskIndex = newTasks.findIndex((t) => t.id === draggableId);
    let newStatus: "por-hacer" | "en-proceso" | "hecho" | "por-verificar";
    let newTags: string[] = [];
    switch (destination.droppableId) {
      case "por-hacer":
        newStatus = "por-hacer";
        newTags = ["Por hacer"];
        break;
      case "en-proceso":
        newStatus = "en-proceso";
        newTags = ["En proceso"];
        break;
      case "hecho":
        newStatus = "hecho";
        newTags = ["Hecho"];
        break;
      case "por-verificar":
        newStatus = "por-verificar";
        newTags = ["Por verificar"];
        break;
      default:
        newStatus = "por-hacer";
        newTags = ["Por hacer"];
    }

    // Mantener todas las etiquetas adicionales que no sean de estado
    const otherTags =
      task.tags && task.tags.length > 1
        ? task.tags.filter(
            (tag) =>
              !["Por hacer", "En proceso", "Hecho", "Por verificar"].includes(
                tag
              )
          )
        : [];
    const updatedTask = {
      ...newTasks[taskIndex],
      status: newStatus,
      tags: otherTags.length > 0 ? [newTags[0], ...otherTags] : newTags,
      commentsList: newTasks[taskIndex].commentsList,
      attachmentsList: newTasks[taskIndex].attachmentsList,
    };
    newTasks[taskIndex] = updatedTask;
    setTasks(newTasks);

    if (projectId) {
      setUpdatingTaskStatus(draggableId);
      api
        .put(`/tasks/${projectId}/${updatedTask.id}`, {
          status: newStatus,
          tags: updatedTask.tags,
        })
        .then((response) => {
          console.log("Task status updated in backend:", response.data);

          if (response.data && response.data.id) {
            setTasks((prevTasks) =>
              prevTasks.map((t) =>
                t.id === updatedTask.id ? response.data : t
              )
            );
          }
        })
        .catch((error) => {
          console.error("Error updating task status in backend:", error);

          setTasks(originalTasks);
          setErrorTasks(
            `Failed to update status for task ${updatedTask.taskId}.`
          );
        })
        .finally(() => {
          setUpdatingTaskStatus(null);
        });
    } else {
      console.error("Cannot update task: Project ID is missing.");
      setErrorTasks("Cannot update task: Project ID is missing.");

      setTasks(originalTasks);
    }
  };
  // *** FIN MODIFICACIÓN onDragEnd ***
  const openModalWithStatus = (
    status: "por-hacer" | "en-proceso" | "hecho" | "por-verificar"
  ) => {
    setModalInitialStatus(status);
    setIsModalOpen(true);
  };
  const handleSaveTask = (newTaskData: Omit<Task, "id">) => {
    if (!projectId) {
      console.error("Cannot save task: Project ID is missing.");
      setErrorTasks("Cannot save task: Project ID is missing.");
      setIsModalOpen(false);
      return;
    }

    setSavingTask(true);
    setErrorTasks(null);

    // Preparar los datos para la API con imágenes por defecto
    const taskDataWithImages = {
      ...newTaskData,
      assignees: newTaskData.assignees.map((a) => ({
        ...a,
        image: a.image || `https://picsum.photos/seed/${a.id}/32/32`,
      })),
    };
    if (editingTask) {
      api
        .put(`/tasks/${projectId}/${editingTask.id}`, taskDataWithImages)
        .then((response) => {
          console.log("Task updated in backend:", response.data);

          if (response.data && response.data.id) {
            setTasks((prevTasks) =>
              prevTasks.map((task) =>
                task.id === editingTask.id ? response.data : task
              )
            );
          } else {
            // Si no se recibe la tarea completa del backend, usamos los datos locales
            setTasks((prevTasks) =>
              prevTasks.map((task) =>
                task.id === editingTask.id
                  ? { ...task, ...taskDataWithImages, id: editingTask.id }
                  : task
              )
            );
          }
          setEditingTask(null);
          setIsModalOpen(false);
        })
        .catch((error) => {
          console.error("Error updating task in backend:", error);
          setErrorTasks("Error al actualizar la tarea.");
        })
        .finally(() => {
          setSavingTask(false);
        });
    } else {
      // Crear nueva tarea
      api
        .post(`/tasks/${projectId}`, taskDataWithImages)
        .then((response) => {
          console.log("Task created in backend:", response.data);
          const createdTask = response.data as Task;
          setTasks((prevTasks) => [...prevTasks, createdTask]);
          setIsModalOpen(false);
        })
        .catch((error) => {
          console.error("Error creating task in backend:", error);
          setErrorTasks("Error al crear la tarea.");
        })
        .finally(() => {
          setSavingTask(false);
        });
    }
  };

  // Función para editar una tarea
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setModalInitialStatus(task.status);
    setIsModalOpen(true);
  };

  // Función para eliminar una tarea
  const handleDeleteTask = async (taskId: string) => {
    if (!projectId) {
      console.error("Cannot delete task: Project ID is missing.");
      setErrorTasks("Cannot delete task: Project ID is missing.");
      return;
    }

    if (window.confirm("¿Estás seguro de que deseas eliminar esta tarea?")) {
      setUpdatingTaskStatus(taskId);
      try {
        await api.delete(`/tasks/${projectId}/${taskId}`);

        // Actualizamos el estado local eliminando la tarea
        setTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskId));

        console.log("Tarea eliminada con éxito");
      } catch (error) {
        console.error("Error al eliminar la tarea:", error);
        setErrorTasks("No se pudo eliminar la tarea.");
      } finally {
        setUpdatingTaskStatus(null);
      }
    }
  };
  // Filtrar tareas por estado
  const todoTasks = tasks.filter((task) => task.status === "por-hacer");
  const inProcessTasks = tasks.filter((task) => task.status === "en-proceso");
  const doneTasks = tasks.filter((task) => task.status === "hecho");
  const toVerifyTasks = tasks.filter((task) => task.status === "por-verificar"); // Añadida si usas esta columna

  return (
    <div className="flex h-screen bg-[#f2f2f2]">
      <SidebarProvider>
        <Sidebar />
      </SidebarProvider>
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="px-6 pt-5 pb-4 flex justify-between items-center border-b border-gray-200">
          <div className="flex items-center gap-2">
            <h1 className="text-[#1F2633] text-2xl font-bold">
              Centro de actividades {projectId ? `(${projectId})` : ""}
            </h1>
            <button className="text-gray-400 hover:text-gray-600">
              <Pencil size={18} />
            </button>
          </div>{" "}
          <div className="flex items-center gap-2">
            {/* Avatares del Header */}
            <div className="flex -space-x-2">
              {projectMembers.slice(0, 4).map((member) => (
                <img
                  key={member.id}
                  className="w-10 h-10 rounded-full border-2 border-white"
                  src={member.image}
                  alt={`Avatar de ${member.username}`}
                  title={member.username}
                />
              ))}
              {projectMembers.length > 4 && (
                <div className="w-10 h-10 bg-[#F2F4F7] rounded-full flex justify-center items-center border-2 border-white">
                  <span className="text-[#606C80] text-xs font-bold">
                    +{projectMembers.length - 4}
                  </span>
                </div>
              )}
            </div>{" "}
            {/* Botón para abrir el modal de nueva tarea */}
            <button
              onClick={() => openModalWithStatus("por-hacer")}
              className="w-10 h-10 bg-white rounded-full border-2 border-[#EBEEF2] flex justify-center items-center hover:bg-gray-50"
              disabled={savingTask}
            >
              <span className="text-[#606C80] font-bold text-lg leading-none pb-1">
                +
              </span>
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Botones de vista */}
            <div className="flex h-10 rounded-lg border border-[#EBEEF2] overflow-hidden">
              <button
                onClick={() => setActiveView("board")}
                className={`h-10 px-4 py-2 flex items-center gap-2 ${
                  activeView === "board"
                    ? "bg-[#FAFBFC] text-[#1F2633]"
                    : "bg-white text-[#606C80]"
                } hover:bg-gray-50 transition-colors`}
              >
                <LayoutGrid
                  size={16}
                  className={
                    activeView === "board" ? "text-[#606C80]" : "text-[#C7CED9]"
                  }
                />
                <span className="text-xs font-medium">Board View</span>
              </button>
              <button
                onClick={() => setActiveView("list")}
                className={`h-10 px-4 py-2 flex items-center gap-2 ${
                  activeView === "list"
                    ? "bg-[#FAFBFC] text-[#1F2633]"
                    : "bg-white text-[#606C80]"
                } hover:bg-gray-50 transition-colors`}
              >
                <List
                  size={16}
                  className={
                    activeView === "list" ? "text-[#606C80]" : "text-[#C7CED9]"
                  }
                />
                <span className="text-xs font-medium">Lista</span>
              </button>
            </div>

            <button
              onClick={() => setIsGithubSheetOpen(true)}
              className="h-10 px-4 py-2 bg-white rounded-lg border border-[#EBEEF2] flex items-center gap-2"
            >
              <Github size={16} className="text-[#C7CED9]" />
              <span className="text-[#98A2B2] text-xs font-medium">
                informacion del repositorio
              </span>
            </button>
          </div>

          {/* Barra de búsqueda */}
          <div className="flex items-center gap-4">
            <div className="w-[240px] h-10 px-3 py-2 bg-white rounded-lg border border-[#EBEEF2] flex items-center gap-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <Search size={16} className="text-[#C7CED9]" />
              <input
                type="text"
                placeholder="Buscar tareas"
                className="flex-1 border-none text-sm focus:outline-none text-[#606C80] placeholder-[#98A2B2] bg-transparent"
              />
            </div>
          </div>
        </div>

        {/* Indicadores de carga y error */}
        {loadingTasks && (
          <div className="px-6 text-center text-gray-600">
            Cargando tareas...
          </div>
        )}
        {errorTasks && (
          <div className="px-6 text-center text-red-500">
            Error: {errorTasks}
          </div>
        )}

        {/* Contenido principal basado en la vista activa */}
        {/* Solo renderizamos si no hay error y ya no estamos cargando */}
        {!loadingTasks &&
          !errorTasks &&
          (activeView === "board" ? (
            <BoardView
              tasks={tasks}
              todoTasks={todoTasks}
              inProcessTasks={inProcessTasks}
              doneTasks={doneTasks}
              toVerifyTasks={toVerifyTasks}
              onDragEnd={onDragEnd}
              onAddTask={openModalWithStatus}
              onEditTask={(task) => {
                setEditingTask(task);
                setIsModalOpen(true);
              }}
              onDeleteTask={handleDeleteTask}
            />
          ) : (
            <ListView tasks={tasks} />
          ))}

        {updatingTaskStatus && (
          <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow-lg">
            Actualizando tarea...
          </div>
        )}
      </div>{" "}
      {/* Modal para crear tareas */}{" "}
      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        initialStatus={modalInitialStatus}
        isSaving={savingTask}
        taskToEdit={editingTask}
        projectMembers={projectMembers}
        currentUser={currentUser ? {
          uid: currentUser.uid || '',
          email: currentUser.email || '',
          username: currentUser.username,
          displayName: currentUser.displayName
        } : null}
      />
      {/* Sheet para información de GitHub */}
      <Sheet open={isGithubSheetOpen} onOpenChange={setIsGithubSheetOpen}>
        <SheetContent
          side="right"
          className="max-w-xl w-full bg-white border-none shadow-xl p-8 flex flex-col items-center justify-start overflow-y-auto"
        >
          <SheetHeader className="w-full mb-4">
            <SheetTitle className="text-2xl font-bold text-[#1F2633]">
              Información del repositorio
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-6 w-full">
            {" "}
            {/* Ramas activas */}
            <div className="bg-[#FAFBFC] rounded-lg p-6 shadow border-none">
              <h3 className="font-bold text-lg mb-4 text-[#1F2633]">
                Ramas activas
              </h3>
              {!projectDetails?.githubRepo ? (
                <p className="text-gray-500">
                  No hay repositorio asociado para mostrar ramas.
                </p>
              ) : githubLoading ? (
                <p>Cargando ramas...</p>
              ) : githubError ? (
                <p className="text-red-500">{githubError}</p>
              ) : githubBranches.length === 0 ? (
                <p className="text-gray-500">
                  No se encontraron ramas en este repositorio.
                </p>
              ) : (
                <ul className="space-y-2">
                  {githubBranches.map((branch) => (
                    <li
                      key={branch}
                      className="flex items-center justify-between"
                    >
                      <span className="font-mono text-blue-700">{branch}</span>
                      <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                        {branch === "main" || branch === "master"
                          ? "Principal"
                          : "Desarrollo"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Repositorio */}
            <div className="bg-[#FAFBFC] rounded-lg p-6 shadow border-none">
              <h3 className="font-bold text-lg mb-4 text-[#1F2633]">
                Repositorio
              </h3>
              {projectDetails?.githubRepo ? (
                <>
                  <p>
                    <a
                      href={projectDetails.githubRepo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {projectDetails.githubRepo.url.replace("https://", "")}
                    </a>
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Nombre del repositorio: {projectDetails.githubRepo.name}
                  </p>
                  <a
                    href={projectDetails.githubRepo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block px-3 py-1 border rounded text-xs bg-white hover:bg-gray-50"
                  >
                    Ver en GitHub
                  </a>
                </>
              ) : (
                <p className="text-gray-500">
                  Este proyecto no tiene un repositorio de GitHub asociado.
                </p>
              )}
            </div>
            {/* Estadísticas del Repositorio */}
            {projectDetails?.githubRepo && githubRepoInfo && (
              <div className="bg-[#FAFBFC] rounded-lg p-6 shadow border-none">
                <h3 className="font-bold text-lg mb-4 text-[#1F2633]">
                  Estadísticas del Repositorio
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500">Stars</p>
                    <p className="font-bold text-lg">
                      {githubRepoInfo.stargazers_count || 0}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500">Forks</p>
                    <p className="font-bold text-lg">
                      {githubRepoInfo.forks_count || 0}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500">Issues abiertas</p>
                    <p className="font-bold text-lg">
                      {githubRepoInfo.open_issues_count || 0}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500">Observadores</p>
                    <p className="font-bold text-lg">
                      {githubRepoInfo.watchers_count || 0}
                    </p>
                  </div>
                </div>
                <div className="mt-4 bg-white p-3 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500">Actualizado</p>
                  <p className="font-medium">
                    {githubRepoInfo.updated_at
                      ? new Date(githubRepoInfo.updated_at).toLocaleDateString(
                          "es-ES",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )
                      : "Fecha no disponible"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
