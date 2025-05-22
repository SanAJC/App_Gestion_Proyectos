"use client";

import { Draggable } from "@hello-pangea/dnd";
import {
  FileText,
  MessageSquare,
  Paperclip,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Task } from "@/types/task";

type TaskProps = {
  task: Task;
  index: number;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  projectId?: string;
};

export default function TaskCard({
  task,
  index,
  onEdit,
  onDelete,
  projectId,
}: TaskProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Maneja la edición de la tarea
  const handleEdit = () => {
    if (onEdit) {
      onEdit(task);
    }
    setIsMenuOpen(false);
  };

  // Maneja la eliminación de la tarea
  const handleDelete = () => {
    if (onDelete) {
      onDelete(task.id);
    }
    setIsMenuOpen(false);
  };
  // Función para determinar el color del badge según el tag
  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case "por hacer":
        return {
          bg: "bg-[rgba(236,72,153,0.1)]",
          text: "text-[#DB2777]",
        };
      case "en proceso":
        return {
          bg: "bg-[rgba(168,85,247,0.1)]",
          text: "text-[#9333EA]",
        };
      case "hecho":
        return {
          bg: "bg-[rgba(34,197,94,0.1)]",
          text: "text-[#16A34A]",
        };
      case "por verificar":
        return {
          bg: "bg-[#f59e0b29]",
          text: "text-[#F59E0B]",
        };
      case "development":
        return {
          bg: "bg-[rgba(236,72,153,0.1)]",
          text: "text-[#DB2777]",
        };
      case "backlog":
        return {
          bg: "bg-[rgba(234,179,8,0.1)]",
          text: "text-[#CA8A04]",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-500",
        };
    }
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
        >
          {" "}
          {/* CONTENIDO SUPERIOR */}{" "}
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-sm font-semibold text-[#1F2633]">
              {task.title}
            </h3>
            <div className="flex items-center gap-2">
              {/* Icono de texto solo si hay comentarios */}
              {task.comments > 0 && (
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4 text-[#DADEE5]" />
                  <span className="text-[#98A2B2] text-xs font-bold">
                    {task.comments}
                  </span>
                </div>
              )}

              {/* Menú desplegable para editar/eliminar */}
              <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <button className="p-1 hover:bg-gray-100 rounded-full">
                    <MoreHorizontal className="w-4 h-4 text-[#98A2B2]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                  <DropdownMenuItem
                    onClick={handleEdit}
                    className="cursor-pointer text-sm flex items-center gap-2"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="cursor-pointer text-sm flex items-center gap-2 text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {/* TAGS Y TASK ID */}
          <div className="flex flex-wrap gap-2 mb-3">
            {/* Task ID */}
            <div className="h-5 px-2 py-[2px] bg-white rounded-full border border-[#EBEEF2] flex justify-center items-center">
              <span className="text-center text-[#606C80] text-[10px] font-bold">
                {task.taskId}
              </span>
            </div>
            {/* Tags */}
            {task.tags &&
              task.tags.map((tag, i) => {
                const { bg, text } = getTagColor(tag);
                return (
                  <div
                    key={i}
                    // OJO: Faltaba una comilla al inicio de la clase aquí en tu código original
                    className={`h-5 px-2 py-[2px] ${bg} rounded-full flex justify-center items-center`}
                  >
                    <span
                      className={`text-center ${text} text-[10px] font-bold`}
                    >
                      {tag}
                    </span>
                  </div>
                );
              })}
          </div>
          {/* CONTENIDO INFERIOR: AVATARES Y CONTADORES */}
          {(task.assignees.length > 0 ||
            task.comments > 0 ||
            task.attachments > 0) && (
            <div className="flex justify-between items-center">
              {/* Sección Izquierda: Avatares y Botón + */}
              <div className="flex items-center gap-2">
                {" "}
                {/* Grupo de Avatares */}
                <div className="flex -space-x-2">
                  {task.assignees.slice(0, 4).map((assignee,) => (
                    <img
                      key={assignee.id}
                      className="w-8 h-8 rounded-full border-2 border-white"
                      src={
                        assignee.image ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          assignee.id
                        )}&background=random`
                      }
                      alt={`Avatar de ${assignee.id}`}
                      title={assignee.id}
                    />
                  ))}
                  {/* Contador de Avatares Extra (solo si hay más de 4) */}
                  {task.assignees.length > 4 && (
                    <div className="w-8 h-8 bg-[#F2F4F7] rounded-full flex justify-center items-center border-2 border-white">
                      <span className="text-center text-[#606C80] text-[10px] font-bold">
                        +{task.assignees.length - 4}
                      </span>
                    </div>
                  )}
                </div>
                {/* Botón Añadir */}
                <button className="p-2 bg-white rounded-full border-2 border-[#EBEEF2] flex justify-center items-center">
                  <Plus className="w-4 h-4 text-[#DADEE5]" />
                </button>
              </div>{" "}
              {/* Sección Derecha: Contadores de Comentarios y Adjuntos */}
              <div className="flex gap-2">
                {/* Contador Comentarios */}
                {task.comments > 0 && (
                  <div
                    className="flex items-center gap-1"
                    title={`${task.comments} comentario(s)`}
                  >
                    <MessageSquare className="w-4 h-4 text-[#DADEE5]" />
                    <span className="text-[#98A2B2] text-[10px] font-bold">
                      {task.comments}
                    </span>
                  </div>
                )}
                {/* Contador Adjuntos */}
                {task.attachments > 0 && (
                  <div
                    className="flex items-center gap-1"
                    title={`${task.attachments} archivo(s) adjunto(s)`}
                  >
                    <Paperclip className="w-4 h-4 text-[#DADEE5]" />
                    <span className="text-[#98A2B2] text-[10px] font-bold">
                      {task.attachments}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}{" "}
          {/* Ya tenemos un menú desplegable arriba, este segundo menú es innecesario */}
        </div>
      )}
    </Draggable>
  );
}
