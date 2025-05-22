"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { Task } from "@/types/task"; // Importamos el tipo Task desde el archivo común

type CreateTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, "id">) => void;
  initialStatus?: "por-hacer" | "en-proceso" | "hecho" | "por-verificar";
  isSaving?: boolean; // Para manejar el estado de guardado
  taskToEdit?: Task | null; // Para edición de tareas existentes
};

export default function CreateTaskModal({
  isOpen,
  onClose,
  onSave,
  initialStatus = "por-hacer",
  isSaving = false,
  taskToEdit = null, // Valor por defecto para taskToEdit
}: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [taskId, setTaskId] = useState("");
  const [status, setStatus] = useState<
    "por-hacer" | "en-proceso" | "hecho" | "por-verificar"
  >(initialStatus);
  const [assignees, setAssignees] = useState<{ id: string; image: string }[]>(
    []
  );
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState("");

  // Reset form or initialize with task data when modal opens
  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        // Si estamos editando una tarea, cargamos sus datos
        setTitle(taskToEdit.title);
        setTaskId(taskToEdit.taskId);
        setStatus(taskToEdit.status);
        setAssignees(taskToEdit.assignees);
        setTags(taskToEdit.tags || []);
        setSelectedTag("");
      } else {
        // Si estamos creando una nueva tarea, reseteamos el formulario
        setTitle("");
        setTaskId("");
        setStatus(initialStatus);
        setAssignees([]);
        setTags([]);
        setSelectedTag("");
      }
    }
  }, [isOpen, initialStatus, taskToEdit]);

  // Generate task ID automatically
  useEffect(() => {
    if (isOpen && !taskToEdit) {
      const randomNum = Math.floor(Math.random() * 1000);
      setTaskId(`#UI${randomNum.toString().padStart(3, "0")}`);
    }
  }, [isOpen, taskToEdit]);

  // Add default tag based on status
  useEffect(() => {
    if (status === "por-hacer") {
      setTags((prevTags) => {
        if (prevTags.some((tag) => tag.toLowerCase() === "por hacer")) {
          return prevTags;
        }
        return [
          "Por hacer",
          ...prevTags.filter(
            (tag) => !["En proceso", "Hecho", "Por verificar"].includes(tag)
          ),
        ];
      });
    } else if (status === "en-proceso") {
      setTags((prevTags) => {
        if (prevTags.some((tag) => tag.toLowerCase() === "en proceso")) {
          return prevTags;
        }
        return [
          "En proceso",
          ...prevTags.filter(
            (tag) => !["Por hacer", "Hecho", "Por verificar"].includes(tag)
          ),
        ];
      });
    } else if (status === "hecho") {
      setTags((prevTags) => {
        if (prevTags.some((tag) => tag.toLowerCase() === "hecho")) {
          return prevTags;
        }
        return [
          "Hecho",
          ...prevTags.filter(
            (tag) => !["Por hacer", "En proceso", "Por verificar"].includes(tag)
          ),
        ];
      });
    } else if (status === "por-verificar") {
      setTags((prevTags) => {
        if (prevTags.some((tag) => tag.toLowerCase() === "por verificar")) {
          return prevTags;
        }
        return [
          "Por verificar",
          ...prevTags.filter(
            (tag) => !["Por hacer", "En proceso", "Hecho"].includes(tag)
          ),
        ];
      });
    }
  }, [status]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!title.trim()) {
      alert("Por favor ingresa un título para la tarea");
      return;
    }

    // Create new task
    const newTask: Omit<Task, "id"> = {
      title,
      taskId,
      status,
      assignees,
      comments: taskToEdit ? taskToEdit.comments : 0,
      attachments: taskToEdit ? taskToEdit.attachments : 0,
      tags,
      coverImage: taskToEdit?.coverImage,
    };

    onSave(newTask);
    onClose(); // Cerrar el modal después de guardar
  };

  const handleAddAssignee = () => {
    const newAssignee = {
      id: `user-${assignees.length + 1}`,
      image: `https://picsum.photos/seed/user${assignees.length + 1}/32/32`,
    };
    setAssignees([...assignees, newAssignee]);
  };

  const handleRemoveAssignee = (id: string) => {
    setAssignees(assignees.filter((assignee) => assignee.id !== id));
  };

  const handleAddTag = () => {
    if (selectedTag && !tags.includes(selectedTag)) {
      setTags([...tags, selectedTag]);
      setSelectedTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0000009e] bg-opacity-30 flex items-center justify-center z-50 text-left">
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#1F2633]">
            {taskToEdit ? "Editar tarea" : "Crear nueva tarea"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-[#1F2633] mb-1"
            >
              Título
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-[#EBEEF2] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingresa el título de la tarea"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="taskId"
              className="block text-sm font-medium text-[#1F2633] mb-1"
            >
              ID de tarea
            </label>
            <input
              type="text"
              id="taskId"
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              className="w-full px-3 py-2 border border-[#EBEEF2] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="#UI000"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-[#1F2633] mb-1"
            >
              Estado
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value as
                    | "por-hacer"
                    | "en-proceso"
                    | "hecho"
                    | "por-verificar"
                )
              }
              className="w-full px-3 py-2 border border-[#EBEEF2] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="por-hacer">Por hacer</option>
              <option value="en-proceso">En proceso</option>
              <option value="hecho">Hecho</option>
              <option value="por-verificar">Por verificar</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#1F2633] mb-1">
              Asignados
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {assignees.map((assignee) => (
                <div
                  key={assignee.id}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg"
                >
                  <img
                    src={assignee.image}
                    alt={`Avatar ${assignee.id}`}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-xs text-gray-700">{assignee.id}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAssignee(assignee.id)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddAssignee}
              className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200"
            >
              <Plus size={14} />
              <span className="text-xs">Añadir asignado</span>
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1F2633] mb-1">
              Etiquetas
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 px-2 py-1 bg-blue-100 rounded-lg"
                >
                  <span className="text-xs text-blue-700">{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-blue-500 hover:text-red-500"
                    disabled={index === 0} // Prevenir eliminar la etiqueta de estado
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                placeholder="Nueva etiqueta"
                className="flex-1 px-3 py-1 border border-[#EBEEF2] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                type="button"
                onClick={handleAddTag}
                disabled={!selectedTag}
                className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm disabled:bg-gray-300"
              >
                Añadir
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={`px-4 py-2 rounded-lg ${
                isSaving
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#2C8780] hover:bg-opacity-90"
              } text-white`}
            >
              {isSaving
                ? "Guardando..."
                : taskToEdit
                ? "Actualizar"
                : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
