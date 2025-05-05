"use client";

import { useState } from "react";
import { Pencil, Search, FileText, LayoutGrid, List, Lock } from "lucide-react";
import BoardView from "@/components/boardTrello/board-view";
import ListView from "@/components/boardTrello/list-view";
import CreateTaskModal from "@/components/boardTrello/create-task-modal";
import Sidebar from "@/components/boardTrello/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

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
};

// Datos iniciales para las tareas
const initialTasks: Task[] = [
  {
    id: "task-1",
    title: "Model Answer",
    taskId: "#UI005",
    status: "to-do",
    assignees: [
      { id: "user-1", image: "/placeholder.svg?height=32&width=32" },
      { id: "user-2", image: "/placeholder.svg?height=32&width=32" },
    ],
    comments: 2,
    attachments: 4,
    tags: ["To Do"],
  },
  {
    id: "task-2",
    title: "Add authentication pages",
    taskId: "#UI008",
    status: "to-do",
    assignees: [],
    comments: 0,
    attachments: 0,
    tags: ["To Do"],
  },
  {
    id: "task-3",
    title: "Profile Page Structure",
    taskId: "#UI006",
    status: "to-do",
    assignees: [{ id: "user-3", image: "/placeholder.svg?height=32&width=32" }],
    comments: 2,
    attachments: 4,
    tags: ["To Do"],
  },
  {
    id: "task-4",
    title: "Create calendar, chat and email app pages",
    taskId: "#UI003",
    status: "to-do",
    assignees: [
      { id: "user-1", image: "/placeholder.svg?height=32&width=32" },
      { id: "user-2", image: "/placeholder.svg?height=32&width=32" },
    ],
    comments: 2,
    attachments: 4,
    tags: ["Development", "Backlog"],
  },
  {
    id: "task-5",
    title: "Model Answer",
    taskId: "#002",
    status: "in-process",
    assignees: [
      { id: "user-1", image: "/placeholder.svg?height=32&width=32" },
      { id: "user-2", image: "/placeholder.svg?height=32&width=32" },
    ],
    comments: 2,
    attachments: 4,
    tags: ["In Process"],
  },
  {
    id: "task-6",
    title: "Model Answer",
    taskId: "#002",
    status: "in-process",
    assignees: [
      { id: "user-1", image: "/placeholder.svg?height=32&width=32" },
      { id: "user-2", image: "/placeholder.svg?height=32&width=32" },
    ],
    comments: 2,
    attachments: 4,
    tags: ["In Process"],
  },
  {
    id: "task-7",
    title: "Model Answer",
    taskId: "#002",
    status: "done",
    assignees: [
      { id: "user-1", image: "/placeholder.svg?height=32&width=32" },
      { id: "user-2", image: "/placeholder.svg?height=32&width=32" },
    ],
    comments: 2,
    attachments: 4,
    tags: ["Done"],
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
  },
  {
    id: "task-9",
    title: "Product Design, Figma, Sketch (Software), Prototype",
    taskId: "#002",
    status: "done",
    assignees: [{ id: "user-4", image: "/placeholder.svg?height=32&width=32" }],
    comments: 2,
    attachments: 4,
    tags: ["Done"],
  },
  {
    id: "task-10",
    title: "Model Answer",
    taskId: "#002",
    status: "done",
    assignees: [
      { id: "user-1", image: "/placeholder.svg?height=32&width=32" },
      { id: "user-5", image: "/placeholder.svg?height=32&width=32" },
    ],
    comments: 2,
    attachments: 4,
    tags: ["To Verify"],
  },
];

export default function ProjectBoardPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeView, setActiveView] = useState<"board" | "list">("board");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialStatus, setModalInitialStatus] = useState<
    "to-do" | "in-process" | "done" | "to-verify"
  >("to-do");

  // Función para manejar el drag and drop
  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    // Si no hay destino o el destino es el mismo que el origen, no hacemos nada
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    // Encontrar la tarea que se está arrastrando
    const task = tasks.find((t) => t.id === draggableId);
    if (!task) return;

    // Crear una copia de las tareas
    const newTasks = [...tasks];

    // Encontrar el índice de la tarea en el array
    const taskIndex = newTasks.findIndex((t) => t.id === draggableId);

    // Actualizar el estado de la tarea según la columna de destino
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
      default:
        newStatus = "to-do";
        newTags = ["To Do"];
    }

    // Actualizar la tarea
    newTasks[taskIndex] = {
      ...newTasks[taskIndex],
      status: newStatus,
      tags:
        task.tags && task.tags.length > 1
          ? [newTags[0], ...task.tags.slice(1)]
          : newTags,
    };

    // Actualizar el estado
    setTasks(newTasks);
  };

  // Función para abrir el modal con un estado inicial específico
  const openModalWithStatus = (
    status: "to-do" | "in-process" | "done" | "to-verify"
  ) => {
    setModalInitialStatus(status);
    setIsModalOpen(true);
  };

  // Función para guardar una nueva tarea
  const handleSaveTask = (newTaskData: Omit<Task, "id">) => {
    const newTask: Task = {
      ...newTaskData,
      id: `task-${tasks.length + 1}`,
    };

    setTasks([...tasks, newTask]);
  };

  // Filtrar tareas por estado
  const todoTasks = tasks.filter((task) => task.status === "to-do");
  const inProcessTasks = tasks.filter((task) => task.status === "in-process");
  const doneTasks = tasks.filter((task) => task.status === "done");

  return (
    <div className="flex h-screen bg-[#f2f2f2]">
      {/* Sidebar con su proveedor */}
      <SidebarProvider>
        <Sidebar />
      </SidebarProvider>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
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
              <img
                className="w-10 h-10 rounded-full border-2 border-white"
                src="/placeholder.svg?height=40&width=40"
                alt="Avatar"
              />
              <img
                className="w-10 h-10 rounded-full border-2 border-white"
                src="/placeholder.svg?height=40&width=40"
                alt="Avatar"
              />
              <img
                className="w-10 h-10 rounded-full border-2 border-white"
                src="/placeholder.svg?height=40&width=40"
                alt="Avatar"
              />
              <img
                className="w-10 h-10 rounded-full border-2 border-white"
                src="/placeholder.svg?height=40&width=40"
                alt="Avatar"
              />
              <div className="w-10 h-10 bg-[#F2F4F7] rounded-full flex justify-center items-center border-2 border-white">
                <span className="text-[#606C80] text-xs font-bold">+5</span>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-10 h-10 bg-white rounded-full border-2 border-[#EBEEF2] flex justify-center items-center hover:bg-gray-50"
            >
              <span className="text-[#DADEE5] font-bold">+</span>
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
                  activeView === "board" ? "bg-[#FAFBFC]" : "bg-white"
                }`}
              >
                <LayoutGrid size={16} className="text-[#C7CED9]" />
                <span className="text-[#606C80] text-xs font-medium">
                  Board View
                </span>
              </button>
              <button
                onClick={() => setActiveView("list")}
                className={`h-10 px-4 py-2 flex items-center gap-2 ${
                  activeView === "list" ? "bg-[#FAFBFC]" : "bg-white"
                }`}
              >
                <List size={16} className="text-[#C7CED9]" />
                <span className="text-[#606C80] text-xs font-medium">
                  Lista
                </span>
              </button>
            </div>
            <div className="h-10 px-4 py-2 bg-white rounded-lg border border-[#EBEEF2] flex items-center gap-2">
              <Lock size={16} className="text-[#C7CED9]" />
              <span className="text-[#98A2B2] text-xs font-medium">
                Límite de acceso
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-[240px] h-10 px-3 py-2 bg-white rounded-lg border border-[#EBEEF2] flex items-center gap-2">
              <Search size={16} className="text-[#C7CED9]" />
              <input
                type="text"
                placeholder="Buscar tareas"
                className="flex-1 border-none text-sm focus:outline-none text-[#98A2B2] placeholder-[#98A2B2]"
              />
            </div>

            <div className="flex gap-2">
              <button className="p-2 bg-white rounded-lg border border-[#EBEEF2] flex justify-center items-center">
                <FileText size={20} className="text-[#C7CED9]" />
              </button>
              <button className="p-2 bg-white rounded-lg border border-[#EBEEF2] flex justify-center items-center">
                <List size={20} className="text-[#C7CED9]" />
              </button>
              <button className="p-2 bg-white rounded-lg border border-[#EBEEF2] flex justify-center items-center">
                <LayoutGrid size={20} className="text-[#C7CED9]" />
              </button>
            </div>
          </div>
        </div>

        {/* Contenido principal basado en la vista activa */}
        {activeView === "board" ? (
          <BoardView
            tasks={tasks}
            todoTasks={todoTasks}
            inProcessTasks={inProcessTasks}
            doneTasks={doneTasks}
            onDragEnd={onDragEnd}
            onAddTask={openModalWithStatus}
          />
        ) : (
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
    </div>
  );
}
