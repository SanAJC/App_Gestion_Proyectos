"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";

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

type CreateTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, "id">) => void;
  initialStatus?: "to-do" | "in-process" | "done" | "to-verify";
};

export default function CreateTaskModal({
  isOpen,
  onClose,
  onSave,
  initialStatus = "to-do",
}: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [taskId, setTaskId] = useState("");
  const [status, setStatus] = useState<
    "to-do" | "in-process" | "done" | "to-verify"
  >(initialStatus);
  const [assignees, setAssignees] = useState<{ id: string; image: string }[]>(
    []
  );
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState("");

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setTaskId("");
      setStatus(initialStatus);
      setAssignees([]);
      setTags([]);
      setSelectedTag("");
    }
  }, [isOpen, initialStatus]);

  // Generate task ID automatically
  useEffect(() => {
    if (isOpen) {
      const randomNum = Math.floor(Math.random() * 1000);
      setTaskId(`#UI${randomNum.toString().padStart(3, "0")}`);
    }
  }, [isOpen]);

  // Add default tag based on status
  useEffect(() => {
    if (status === "to-do") {
      setTags(["To Do"]);
    } else if (status === "in-process") {
      setTags(["In Process"]);
    } else if (status === "done") {
      setTags(["Done"]);
    } else if (status === "to-verify") {
      setTags(["To Verify"]);
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
      comments: 0,
      attachments: 0,
      tags,
    };

    onSave(newTask);
    onClose();
  };

  const handleAddAssignee = () => {
    const newAssignee = {
      id: `user-${assignees.length + 1}`,
      image: "/placeholder.svg?height=32&width=32",
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
            Crear nueva tarea
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
                    | "to-do"
                    | "in-process"
                    | "done"
                    | "to-verify"
                )
              }
              className="w-full px-3 py-2 border border-[#EBEEF2] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="to-do">To Do</option>
              <option value="in-process">In Process</option>
              <option value="done">Done</option>
              <option value="to-verify">To Verify</option>
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
                  className="flex items-center bg-gray-100 rounded-full p-1"
                >
                  <img
                    src={assignee.image || "/placeholder.svg"}
                    alt="Avatar"
                    className="w-6 h-6 rounded-full"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveAssignee(assignee.id)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddAssignee}
                className="flex items-center justify-center w-6 h-6 maxiPrueba rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-[#1F2633] mb-1">
              Etiquetas
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center bg-gray-100 rounded-full px-2 py-1"
                >
                  <span className="text-xs">{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
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
                className="flex-1 px-3 py-2 border border-[#EBEEF2] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nueva etiqueta"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Añadir
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#EBEEF2] rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#2C8780] text-white rounded-lg hover:bg-opacity-90"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
