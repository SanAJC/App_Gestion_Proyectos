"use client";

import { useState, useEffect } from "react";
import { Pencil, Search,  LayoutGrid, List, Github } from "lucide-react";
import BoardView from "@/components/boardTrello/board-view";
import ListView from "@/components/boardTrello/list-view";
import CreateTaskModal from "@/components/boardTrello/create-task-modal";
import Sidebar from "@/components/boardTrello/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

// Tipos para nuestros datos
type Task = {
  id: string;
  title: string;
  taskId: string;
  status: "to-do" | "in-process" | "done" | "to-verify";
  assignees: { id: string; image: string }[];
  comments: number;
  attachments: number;
  tags?: string[];
  // Opcional: Añadir una imagen principal para la card si quieres
  coverImage?: string;
};

// Datos iniciales para las tareas (CON IMÁGENES ALEATORIAS)
const initialTasks: Task[] = [
  {
    id: "task-1",
    title: "Model Answer",
    taskId: "#UI005",
    status: "to-do",
    assignees: [
      // Imagen aleatoria para user-1 (será la misma para user-1 en otras tareas)
      { id: "user-1", image: "https://picsum.photos/seed/user1/32/32" },
      // Imagen aleatoria para user-2
      { id: "user-2", image: "https://picsum.photos/seed/user2/32/32" },
    ],
    comments: 2,
    attachments: 4,
    tags: ["To Do"],
    // Añadimos una imagen de portada aleatoria para esta card
    coverImage: "https://picsum.photos/seed/task1cover/400/200",
  },
  {
    id: "task-2",
    title: "Add authentication pages",
    taskId: "#UI008",
    status: "to-do",
    assignees: [], // Sin asignados
    comments: 0,
    attachments: 0,
    tags: ["To Do"],
     // Sin imagen de portada
  },
  {
    id: "task-3",
    title: "Profile Page Structure",
    taskId: "#UI006",
    status: "to-do",
    assignees: [
       // Imagen aleatoria para user-3
      { id: "user-3", image: "https://picsum.photos/seed/user3/32/32" }
    ],
    comments: 2,
    attachments: 4,
    tags: ["To Do"],
    // Otra imagen de portada
    coverImage: "https://picsum.photos/seed/task3cover/400/200",
  },
  {
    id: "task-4",
    title: "Create calendar, chat and email app pages",
    taskId: "#UI003",
    status: "to-do",
    assignees: [
      { id: "user-1", image: "https://picsum.photos/seed/user1/32/32" },
      { id: "user-2", image: "https://picsum.photos/seed/user2/32/32" },
    ],
    comments: 2,
    attachments: 4,
    tags: ["Development", "Backlog"],
     // Sin imagen de portada
  },
  {
    id: "task-5",
    title: "Model Answer",
    taskId: "#002",
    status: "in-process",
    assignees: [
      { id: "user-1", image: "https://picsum.photos/seed/user1/32/32" },
      { id: "user-2", image: "https://picsum.photos/seed/user2/32/32" },
    ],
    comments: 2,
    attachments: 4,
    tags: ["In Process"],
    // Otra imagen de portada
    coverImage: "https://picsum.photos/seed/task5cover/400/200",
  },
  {
    id: "task-6",
    title: "Model Answer",
    taskId: "#002",
    status: "in-process",
    assignees: [
      { id: "user-1", image: "https://picsum.photos/seed/user1/32/32" },
      { id: "user-2", image: "https://picsum.photos/seed/user2/32/32" },
    ],
    comments: 2,
    attachments: 4,
    tags: ["In Process"],
     // Sin imagen de portada
  },
  {
    id: "task-7",
    title: "Model Answer",
    taskId: "#002",
    status: "done",
    assignees: [
      { id: "user-1", image: "https://picsum.photos/seed/user1/32/32" },
      { id: "user-2", image: "https://picsum.photos/seed/user2/32/32" },
    ],
    comments: 2,
    attachments: 4,
    tags: ["Done"],
     // Sin imagen de portada
  },
  {
    id: "task-8",
    title: "Create calendar, chat and email app pages",
    taskId: "#002",
    status: "done",
    assignees: [],
    comments: 0,
    attachments: 0,
    tags: ["Done"],
    // Otra imagen de portada
    coverImage: "https://picsum.photos/seed/task8cover/400/200",
  },
  {
    id: "task-9",
    title: "Product Design, Figma, Sketch (Software), Prototype",
    taskId: "#002",
    status: "done",
    assignees: [
      // Imagen aleatoria para user-4
      { id: "user-4", image: "https://picsum.photos/seed/user4/32/32" }
    ],
    comments: 2,
    attachments: 4,
    tags: ["Done"],
     // Sin imagen de portada
  },
  {
    id: "task-10",
    title: "Model Answer",
    taskId: "#002",
    status: "done", // Cambiado a done para que aparezca en esa columna si no existe 'to-verify' como columna visible
    assignees: [
      { id: "user-1", image: "https://picsum.photos/seed/user1/32/32" },
      // Imagen aleatoria para user-5
      { id: "user-5", image: "https://picsum.photos/seed/user5/32/32" },
    ],
    comments: 2,
    attachments: 4,
    tags: ["Done"], // Cambiado tag a 'Done'
    // Otra imagen de portada
    coverImage: "https://picsum.photos/seed/task10cover/400/200",
  },
];

export default function ProjectBoardPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeView, setActiveView] = useState<"board" | "list">("board");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialStatus, setModalInitialStatus] = useState<
    "to-do" | "in-process" | "done" | "to-verify"
  >("to-do");
  const [isGithubSheetOpen, setIsGithubSheetOpen] = useState(false);
  const [githubBranches, setGithubBranches] = useState<string[]>([]);
  const [githubLoading, setGithubLoading] = useState(false);
  const [githubError, setGithubError] = useState<string | null>(null);

  useEffect(() => {
    if (isGithubSheetOpen) {
      setGithubLoading(true);
      setGithubError(null);
      // Ejemplo usando fetch directamente a la API pública de GitHub
      fetch("https://api.github.com/repos/empresa/proyecto-1/branches")
        .then(res => res.json())
        .then(data => {
          setGithubBranches(data.map((b: any) => b.name));
          setGithubLoading(false);
        })
        .catch(err => {
          setGithubError("Error al cargar ramas");
          setGithubLoading(false);
        });
    }
  }, [isGithubSheetOpen]);

  // Función para manejar el drag and drop
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

    const newTasks = [...tasks];
    const taskIndex = newTasks.findIndex((t) => t.id === draggableId);

    let newStatus: "to-do" | "in-process" | "done" | "to-verify";
    let newTags: string[] = [];

    switch (destination.droppableId) {
      case "to-do":
        newStatus = "to-do";
        newTags = ["To Do"];
        break;
      case "in-process":
        newStatus = "in-process";
        newTags = ["In Process"];
        break;
      case "done":
        newStatus = "done";
        newTags = ["Done"];
        break;
      // Asegúrate de tener una columna 'to-verify' si usas este estado
      case "to-verify":
         newStatus = "to-verify";
         newTags = ["To Verify"];
         break;
      default:
        newStatus = "to-do"; // Estado por defecto
        newTags = ["To Do"];
    }

    newTasks[taskIndex] = {
      ...newTasks[taskIndex],
      status: newStatus,
      tags:
        task.tags && task.tags.length > 1
          ? [newTags[0], ...task.tags.slice(1)]
          : newTags,
    };

    setTasks(newTasks);
  };

  const openModalWithStatus = (
    status: "to-do" | "in-process" | "done" | "to-verify"
  ) => {
    setModalInitialStatus(status);
    setIsModalOpen(true);
  };

  const handleSaveTask = (newTaskData: Omit<Task, "id">) => {
    const newTask: Task = {
      ...newTaskData,
      id: `task-${Date.now()}`, // Usar Date.now() para un ID más único
       // Opcional: Añadir imagen de portada por defecto o dejarla undefined
       // coverImage: "https://picsum.photos/seed/newtaskcover/400/200",
      // Asegurarse que los assignees tengan URLs de imagen válidas si se añaden
      assignees: newTaskData.assignees.map(a => ({
          ...a,
          image: a.image || `https://picsum.photos/seed/${a.id}/32/32` // Asignar imagen si no la tiene
      }))
    };
    setTasks([...tasks, newTask]);
  };

  // Filtrar tareas por estado
  const todoTasks = tasks.filter((task) => task.status === "to-do");
  const inProcessTasks = tasks.filter((task) => task.status === "in-process");
  const doneTasks = tasks.filter((task) => task.status === "done");
  // Opcional: Si tienes la columna "To Verify"
  // const toVerifyTasks = tasks.filter((task) => task.status === "to-verify");

  return (
    <div className="flex h-screen bg-[#f2f2f2]">
      <SidebarProvider>
        <Sidebar />
      </SidebarProvider>

      <div className="flex-1 overflow-auto">
        {/* Header (CON IMÁGENES ALEATORIAS) */}
        <div className="px-6 pt-5 pb-4 flex justify-between items-center border-b border-gray-200">
          <div className="flex items-center gap-2">
            <h1 className="text-[#1F2633] text-2xl font-bold">
              Centro de actividades
            </h1>
            <button className="text-gray-400 hover:text-gray-600">
              <Pencil size={18} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {/* --- Imágenes de Header Modificadas --- */}
              <img
                className="w-10 h-10 rounded-full border-2 border-white"
                src="https://picsum.photos/seed/header1/40/40" // Imagen aleatoria 1
                alt="Avatar 1"
              />
              <img
                className="w-10 h-10 rounded-full border-2 border-white"
                src="https://picsum.photos/seed/header2/40/40" // Imagen aleatoria 2
                alt="Avatar 2"
              />
              <img
                className="w-10 h-10 rounded-full border-2 border-white"
                src="https://picsum.photos/seed/header3/40/40" // Imagen aleatoria 3
                alt="Avatar 3"
              />
              <img
                className="w-10 h-10 rounded-full border-2 border-white"
                src="https://picsum.photos/seed/header4/40/40" // Imagen aleatoria 4
                alt="Avatar 4"
              />
              {/* --- Fin Imágenes Modificadas --- */}
              <div className="w-10 h-10 bg-[#F2F4F7] rounded-full flex justify-center items-center border-2 border-white">
                <span className="text-[#606C80] text-xs font-bold">+5</span>
              </div>
            </div>
            <button
              onClick={() => openModalWithStatus('to-do')} // Abre modal en 'to-do' por defecto
              className="w-10 h-10 bg-white rounded-full border-2 border-[#EBEEF2] flex justify-center items-center hover:bg-gray-50"
            >
              <span className="text-[#606C80] font-bold text-lg leading-none pb-1">
                + {/* Ajustado para mejor centrado */}
              </span>
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-10 rounded-lg border border-[#EBEEF2] overflow-hidden">
              <button
                onClick={() => setActiveView("board")}
                className={`h-10 px-4 py-2 flex items-center gap-2 ${
                  activeView === "board"
                    ? "bg-[#FAFBFC] text-[#1F2633]" // Estilo activo mejorado
                    : "bg-white text-[#606C80]"
                } hover:bg-gray-50 transition-colors`}
              >
                <LayoutGrid size={16} className={activeView === "board" ? "text-[#606C80]" : "text-[#C7CED9]"} />
                <span className="text-xs font-medium">Board View</span>
              </button>
              <button
                onClick={() => setActiveView("list")}
                className={`h-10 px-4 py-2 flex items-center gap-2 ${
                  activeView === "list"
                    ? "bg-[#FAFBFC] text-[#1F2633]" // Estilo activo mejorado
                    : "bg-white text-[#606C80]"
                } hover:bg-gray-50 transition-colors`}
              >
                <List size={16} className={activeView === "list" ? "text-[#606C80]" : "text-[#C7CED9]"} />
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

          <div className="flex items-center gap-4">
            <div className="w-[240px] h-10 px-3 py-2 bg-white rounded-lg border border-[#EBEEF2] flex items-center gap-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <Search size={16} className="text-[#C7CED9]" />
              <input
                type="text"
                placeholder="Buscar tareas"
                className="flex-1 border-none text-sm focus:outline-none text-[#606C80] placeholder-[#98A2B2] bg-transparent"
              />
            </div>

            {/* Estos botones podrían tener funciones en el futuro */}
            {/* <div className="flex gap-2">
              <button className="p-2 bg-white rounded-lg border border-[#EBEEF2] flex justify-center items-center hover:bg-gray-50">
                <FileText size={20} className="text-[#C7CED9]" />
              </button>
              <button className="p-2 bg-white rounded-lg border border-[#EBEEF2] flex justify-center items-center hover:bg-gray-50">
                <List size={20} className="text-[#C7CED9]" />
              </button>
              <button className="p-2 bg-white rounded-lg border border-[#EBEEF2] flex justify-center items-center hover:bg-gray-50">
                <LayoutGrid size={20} className="text-[#C7CED9]" />
              </button>
            </div> */}
          </div>
        </div>

        {/* Contenido principal basado en la vista activa */}
        {/* Asegúrate que BoardView y ListView puedan manejar la propiedad 'coverImage' si la defines */}
        {activeView === "board" ? (
          <BoardView
            tasks={tasks} // Pasa todas las tareas
            todoTasks={todoTasks}
            inProcessTasks={inProcessTasks}
            doneTasks={doneTasks}
            // Si usas 'to-verify', pásalo también: toVerifyTasks={toVerifyTasks}
            onDragEnd={onDragEnd}
            onAddTask={openModalWithStatus}
          />
        ) : (
          // Asegúrate que ListView pueda manejar las tareas con coverImage si es necesario
          <ListView tasks={tasks} />
        )}
      </div>

      {/* Modal para crear tareas */}
      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        initialStatus={modalInitialStatus}
      />

      {/* Sheet para información de GitHub */}
      <Sheet open={isGithubSheetOpen} onOpenChange={setIsGithubSheetOpen}>
        <SheetContent side="right" className="max-w-xl w-full bg-white border-none shadow-xl p-8 flex flex-col items-center justify-start">
          <SheetHeader className="w-full mb-4">
            <SheetTitle className="text-2xl font-bold text-[#1F2633]">Información del repositorio</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-6 w-full">
            {/* Ramas activas */}
            <div className="bg-[#FAFBFC] rounded-lg p-6 shadow border-none">
              <h3 className="font-bold text-lg mb-4 text-[#1F2633]">Ramas activas</h3>
              {githubLoading ? (
                <p>Cargando ramas...</p>
              ) : githubError ? (
                <p className="text-red-500">{githubError}</p>
              ) : (
                <ul className="space-y-2">
                  {githubBranches.map(branch => (
                    <li key={branch} className="flex items-center justify-between">
                      <span className="font-mono text-blue-700">{branch}</span>
                      <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-700 rounded">Producción</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Repositorio */}
            <div className="bg-[#FAFBFC] rounded-lg p-6 shadow border-none">
              <h3 className="font-bold text-lg mb-4 text-[#1F2633]">Repositorio</h3>
              <p>
                <a href="https://github.com/empresa/proyecto-1" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  github.com/empresa/proyecto-1
                </a>
              </p>
              <p className="text-sm text-gray-500 mt-2">Último commit: hace 2h</p>
              <a href="https://github.com/empresa/proyecto-1" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block px-3 py-1 border rounded text-xs bg-white hover:bg-gray-50">
                Ver en GitHub
              </a>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}