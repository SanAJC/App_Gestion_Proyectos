"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  X,
  Plus,
  Paperclip,
  MessageSquare,
  User,
  Tag,
  AlertCircle,
} from "lucide-react";
import { Task } from "@/types/task";

type CreateTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, "id">) => void;
  initialStatus?: "por-hacer" | "en-proceso" | "hecho" | "por-verificar";
  isSaving?: boolean;
  taskToEdit?: Task | null;
  projectMembers?: {
    id: string;
    email: string;
    username: string;
    image: string;
  }[];
  currentUser?: {
    uid: string;
    email: string;
    username?: string;
    displayName?: string;
  } | null;
};

export default function CreateTaskModal({
  isOpen,
  onClose,
  onSave,
  initialStatus = "por-hacer",
  isSaving = false,
  taskToEdit = null,
  projectMembers = [],
  currentUser = null,
}: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [taskId, setTaskId] = useState("");
  const [status, setStatus] = useState<
    "por-hacer" | "en-proceso" | "hecho" | "por-verificar"
  >(initialStatus);
  const [assignees, setAssignees] = useState<
    { id: string; image: string; username?: string; email?: string }[]
  >([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [comments, setComments] = useState<string[]>(
    taskToEdit?.comments ? Array(taskToEdit.comments).fill("") : []
  );
  const [newComment, setNewComment] = useState("");
  const [attachments, setAttachments] = useState<string[]>(
    taskToEdit?.attachments ? Array(taskToEdit.attachments).fill("") : []
  );
  const [, setNewAttachment] = useState("");
  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        // Si estamos editando una tarea existente
        setTitle(taskToEdit.title);
        setTaskId(taskToEdit.taskId);
        setStatus(taskToEdit.status);
        setAssignees(taskToEdit.assignees);

        // Asegurarse de que hay etiquetas y que incluyen la de estado
        const taskTags = taskToEdit.tags || [];
        setTags(taskTags);

        // Asegurarse de que hay comentarios
        if (taskToEdit.commentsList && taskToEdit.commentsList.length > 0) {
          setComments(taskToEdit.commentsList);
        } else if (taskToEdit.comments > 0) {
          // Si hay contador de comentarios pero no lista, crear array vacío del tamaño adecuado
          setComments(Array(taskToEdit.comments).fill(""));
        } else {
          setComments([]);
        }
        setNewComment("");

        // Asegurarse de que hay adjuntos
        if (
          taskToEdit.attachmentsList &&
          taskToEdit.attachmentsList.length > 0
        ) {
          setAttachments(taskToEdit.attachmentsList);
        } else if (taskToEdit.attachments > 0) {
          // Si hay contador de adjuntos pero no lista, crear array vacío del tamaño adecuado
          setAttachments(Array(taskToEdit.attachments).fill(""));
        } else {
          setAttachments([]);
        }
        setNewAttachment("");
      } else {
        // Inicialización para una nueva tarea
        setTitle("");
        setTaskId("");
        setStatus(initialStatus);
        setAssignees([]);

        // Para una nueva tarea, inicializar con la etiqueta del estado inicial
        const initialStatusTag =
          initialStatus === "por-hacer"
            ? "Por hacer"
            : initialStatus === "en-proceso"
            ? "En proceso"
            : initialStatus === "hecho"
            ? "Hecho"
            : "Por verificar";
        setTags([initialStatusTag]);

        setSelectedTag("");
        setComments([]);
        setNewComment("");
        setAttachments([]);
        setNewAttachment("");
      }
    }
  }, [isOpen, initialStatus, taskToEdit]);

  useEffect(() => {
    if (isOpen && !taskToEdit) {
      const randomNum = Math.floor(Math.random() * 1000);
      setTaskId(`#UI${randomNum.toString().padStart(3, "0")}`);
    }
  }, [isOpen, taskToEdit]);
  useEffect(() => {
    // Función para actualizar etiquetas basado en el estado
    const updateTagsBasedOnStatus = () => {
      // Definir la etiqueta correspondiente al estado actual
      const statusTagMap = {
        "por-hacer": "Por hacer",
        "en-proceso": "En proceso",
        hecho: "Hecho",
        "por-verificar": "Por verificar",
      };

      const currentStatusTag = statusTagMap[status];
      const otherStatusTags = Object.values(statusTagMap).filter(
        (tag) => tag !== currentStatusTag
      );

      // Verificar si ya existe la etiqueta de estado actual
      const hasCurrentStatusTag = tags.some((tag) => tag === currentStatusTag);

      if (!hasCurrentStatusTag) {
        // Filtrar otras etiquetas de estado y añadir la actual al principio
        const filteredTags = tags.filter(
          (tag) => !otherStatusTags.includes(tag)
        );
        setTags([currentStatusTag, ...filteredTags]);
      }
    };

    // Ejecutar la actualización
    updateTagsBasedOnStatus();
  }, [status, tags]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Por favor ingresa un título para la tarea");
      return;
    }

    // Asegurémonos de que la etiqueta de estado esté incluida correctamente
    let updatedTags = [...tags];
    const statusTags = ["Por hacer", "En proceso", "Hecho", "Por verificar"];
    const currentStatusTag =
      status === "por-hacer"
        ? "Por hacer"
        : status === "en-proceso"
        ? "En proceso"
        : status === "hecho"
        ? "Hecho"
        : "Por verificar";

    // Eliminar otras etiquetas de estado si existen
    updatedTags = updatedTags.filter((tag) => !statusTags.includes(tag));

    // Añadir la etiqueta correspondiente al estado actual al principio
    updatedTags = [currentStatusTag, ...updatedTags];

    const newTask: Omit<Task, "id"> = {
      title,
      taskId,
      status,
      assignees,
      comments: comments.length,
      commentsList: comments.filter((comment) => comment.trim() !== ""), // Filtrar comentarios vacíos
      attachments: attachments.length,
      attachmentsList: attachments.filter(
        (attachment) => attachment.trim() !== ""
      ), // Filtrar adjuntos vacíos
      tags: updatedTags, // Usar las etiquetas actualizadas
      coverImage: taskToEdit?.coverImage,
    };

    onSave(newTask);
    onClose();
  };
  const handleAddAssignee = () => {
    if (projectMembers && projectMembers.length > 0) {
      return;
    }

    const newAssignee = {
      id: `user-${assignees.length + 1}`,
      image: `https://picsum.photos/seed/user${assignees.length + 1}/32/32`,
    };
    setAssignees([...assignees, newAssignee]);
  };
  const handleSelectAssignee = (member: {
    id: string;
    email: string;
    username?: string;
    displayName?: string;
    image?: string;
  }) => {
    if (assignees.some((a) => a.id === member.id)) {
      return;
    }

    // Mostrar el nombre de usuario, displayName o email en ese orden de prioridad
    const displayedName = member.username || member.displayName || member.email;

    // Añadir el miembro a los asignados
    const newAssignee = {
      id: member.id,
      image:
        member.image ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          displayedName
        )}&background=random`,
      username: displayedName,
      email: member.email,
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
  const handleRemoveTag = (tag: string, index: number) => {
    // No permitir eliminar etiquetas de estado
    const statusTags = ["Por hacer", "En proceso", "Hecho", "Por verificar"];
    if (statusTags.includes(tag)) {
      return;
    }

    setTags(tags.filter((t) => t !== tag));
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0000009e] bg-opacity-30 flex items-center justify-center z-50 text-left overflow-y-auto py-10">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-lg my-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[#1F2633]">
            {taskToEdit ? "Editar tarea" : "Crear nueva tarea"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Primera fila: Título e ID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-[#1F2633] mb-1"
              >
                Título
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-[#EBEEF2] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ingresa el título de la tarea"
                  required
                />
                {!title.trim() && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
                    <AlertCircle size={16} />
                  </div>
                )}
              </div>
            </div>
            <div>
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
          </div>{" "}
          {/* Segunda fila: Estado */}
          <div>
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
              <option value="hecho">Terminada</option>
              <option value="por-verificar">Por verificar</option>
            </select>
          </div>
          {/* Línea divisoria */}
          <div className="border-t border-[#EBEEF2] my-4"></div>{" "}
          {/* Sección: Asignados */}{" "}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[#1F2633] mb-2">
              <User size={16} className="text-gray-400" />
              <span>Asignados</span>
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
                  <span className="text-xs text-gray-700">
                    {assignee.username || assignee.id}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAssignee(assignee.id)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>{" "}
            {projectMembers && projectMembers.length > 0 ? (
              <div className="relative flex flex-col gap-2">
                <select
                  className="w-full px-3 py-2 border border-[#EBEEF2] rounded-lg text-sm"
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    if (selectedId) {
                      const member = projectMembers.find(
                        (m) => m.id === selectedId
                      );
                      if (member) {
                        handleSelectAssignee(member);
                      }
                      e.target.value = ""; // Resetear el select
                    }
                  }}
                  value=""
                >
                  <option value="" disabled>
                    Seleccionar miembro
                  </option>
                  {projectMembers.map((member) => (
                    <option
                      key={member.id}
                      value={member.id}
                      disabled={assignees.some((a) => a.id === member.id)}
                    >
                      {member.username} ({member.email})
                    </option>
                  ))}
                </select>
                {/* Botón para autoasignarse la tarea */}
                {currentUser && (
                  <button
                    type="button"
                    onClick={() => {
                      // Buscamos si el usuario actual está en los miembros del proyecto
                      const member = projectMembers.find(
                        (m) => m.email === currentUser.email
                      );

                      // Si lo encontramos y no está ya asignado, lo añadimos a los asignados
                      if (
                        member &&
                        !assignees.some((a) => a.id === member.id)
                      ) {
                        handleSelectAssignee(member);
                      } else if (!member) {
                        // Si no encontramos al usuario en los miembros del proyecto (caso poco probable)
                        // Creamos un nuevo asignado con la información del usuario actual
                        const displayedName =
                          currentUser.username ||
                          currentUser.displayName ||
                          currentUser.email;
                        const newAssignee = {
                          id: currentUser.uid,
                          email: currentUser.email,
                          username: displayedName,
                          image: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            displayedName
                          )}&background=random`,
                        };
                        handleSelectAssignee(newAssignee);
                      }
                    }}
                    className={`mt-2 py-2 rounded-lg text-sm w-full ${
                      assignees.some((a) => a.email === currentUser.email)
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-[#2C8780] text-white hover:bg-[#236b64]"
                    }`}
                    disabled={assignees.some(
                      (a) => a.email === currentUser.email
                    )}
                  >
                    {assignees.some((a) => a.email === currentUser.email)
                      ? "Ya estás asignado a esta tarea"
                      : "Asignarme esta tarea"}
                  </button>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAddAssignee}
                className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200"
              >
                <Plus size={14} />
                <span className="text-xs">Añadir asignado</span>
              </button>
            )}
          </div>{" "}
          {/* Sección: Etiquetas */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[#1F2633] mb-2">
              <Tag size={16} className="text-gray-400" />
              <span>Etiquetas</span>
            </label>{" "}
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag, index) => {
                // Identificar las etiquetas de estado para darles un estilo especial
                const isStatusTag = [
                  "Por hacer",
                  "En proceso",
                  "Hecho",
                  "Por verificar",
                ].includes(tag);
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                      isStatusTag
                        ? "bg-blue-200 border border-blue-300"
                        : "bg-blue-100"
                    }`}
                  >
                    <span
                      className={`text-xs ${
                        isStatusTag
                          ? "text-blue-800 font-medium"
                          : "text-blue-700"
                      }`}
                    >
                      {tag}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag, index)}
                      className="text-blue-500 hover:text-red-500"
                      disabled={isStatusTag} // Deshabilitar el botón para etiquetas de estado
                    >
                      <X size={14} />
                    </button>
                  </div>
                );
              })}
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
          {/* Línea divisoria */}
          <div className="border-t border-[#EBEEF2] my-4"></div>{" "}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[#1F2633] mb-2">
              <MessageSquare size={16} className="text-gray-400" />
              <span>Comentarios ({comments.length})</span>
            </label>
            <div className="flex flex-col gap-2 mb-3 max-h-40 overflow-y-auto">
              {comments.map((comment, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-[#EBEEF2]"
                >
                  <textarea
                    value={comment}
                    onChange={(e) => {
                      const newComments = [...comments];
                      newComments[index] = e.target.value;
                      setComments(newComments);
                    }}
                    className="flex-1 px-3 py-2 bg-white border border-[#EBEEF2] rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none text-sm"
                    placeholder="Escribe un comentario"
                    rows={2}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newComments = comments.filter(
                        (_, i) => i !== index
                      );
                      setComments(newComments);
                    }}
                    className="text-gray-400 hover:text-red-500 flex-shrink-0 p-1 rounded-full hover:bg-gray-100"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Nuevo comentario"
                className="flex-1 px-3 py-2 border border-[#EBEEF2] rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none text-sm"
                rows={2}
              />
              <button
                type="button"
                onClick={() => {
                  if (newComment.trim()) {
                    setComments([...comments, newComment.trim()]);
                    setNewComment("");
                  }
                }}
                disabled={!newComment.trim()}
                className="px-3 h-10 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 disabled:bg-gray-300 flex-shrink-0 flex items-center gap-1"
              >
                <Plus size={14} />
                <span>Añadir</span>
              </button>
            </div>
          </div>{" "}
          {/* Línea divisoria */}
          <div className="border-t border-[#EBEEF2] my-4"></div>
          {/* Sección: Archivos adjuntos */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[#1F2633] mb-2">
              <Paperclip size={16} className="text-gray-400" />
              <span>Archivos adjuntos ({attachments.length})</span>
            </label>
            <div className="flex flex-col gap-2 mb-3 max-h-40 overflow-y-auto">
              {attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-[#EBEEF2]"
                >
                  <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white border border-[#EBEEF2] rounded-lg text-sm text-gray-700 truncate">
                    <Paperclip className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">
                      {attachment.split("/").pop() || attachment}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newAttachments = attachments.filter(
                        (_, i) => i !== index
                      );
                      setAttachments(newAttachments);
                    }}
                    className="text-gray-400 hover:text-red-500 flex-shrink-0 p-1 rounded-full hover:bg-gray-100"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-[#EBEEF2] rounded-lg hover:bg-gray-50 cursor-pointer text-sm text-gray-600 transition-colors">
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      const fileName = file.name;
                      // En un entorno real, aquí subirías el archivo a un servidor
                      // y obtendrías la URL. Por ahora, usaremos un nombre local ficticio
                      setAttachments([...attachments, `local://${fileName}`]);
                      e.target.value = ""; // Reset input
                    }
                  }}
                />
                <Paperclip size={14} />
                <span>Seleccionar archivo</span>
              </label>
            </div>
          </div>{" "}
          {/* Línea divisoria */}
          <div className="border-t border-[#EBEEF2] my-6"></div>
          {/* Botones de acción */}
          <div className="flex justify-end items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving || !title.trim()}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                isSaving || !title.trim()
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#2C8780] hover:bg-[#236b64]"
              } text-white`}
            >
              {isSaving ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Guardando...</span>
                </>
              ) : (
                <span>{taskToEdit ? "Actualizar" : "Guardar"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
