"use client";

import { Draggable } from "@hello-pangea/dnd";
import { FileText, MessageSquare, Paperclip, Plus } from "lucide-react";

type TaskProps = {
  task: {
    id: string;
    title: string;
    taskId: string;
    status: string;
    assignees: { id: string; image: string }[];
    comments: number;
    attachments: number;
    tags?: string[];
  };
  index: number;
};

export default function TaskCard({ task, index }: TaskProps) {
  // Función para determinar el color del badge según el tag
  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case "to do":
        return {
          bg: "bg-[rgba(236,72,153,0.1)]",
          text: "text-[#DB2777]",
        };
      case "in process":
        return {
          bg: "bg-[rgba(168,85,247,0.1)]",
          text: "text-[#9333EA]",
        };
      case "done":
        return {
          bg: "bg-[rgba(34,197,94,0.1)]",
          text: "text-[#16A34A]",
        };
      case "to verify":
        return {
          bg: "bg-[rgba(168,85,247,0.1)]",
          text: "text-[#9333EA]",
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
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-sm font-semibold text-[#1F2633]">
              {task.title}
            </h3>
            {task.comments > 0 && (
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4 text-[#DADEE5]" />
                <span className="text-[#98A2B2] text-xs font-bold">
                  {task.comments}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            <div className="h-5 px-2 py-[2px] bg-white rounded-full border border-[#EBEEF2] flex justify-center items-center">
              <span className="text-center text-[#606C80] text-[10px] font-bold">
                {task.taskId}
              </span>
            </div>
            {task.tags &&
              task.tags.map((tag, i) => {
                const { bg, text } = getTagColor(tag);
                return (
                  <div
                    key={i}
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

          {(task.assignees.length > 0 ||
            task.comments > 0 ||
            task.attachments > 0) && (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {task.assignees.map((assignee, i) => (
                    <img
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white"
                      src={
                        assignee.image || "/react.svg?height=32&width=32"
                      }
                      alt="Avatar"
                    />
                  ))}
                  {task.assignees.length > 0 && (
                    <div className="w-8 h-8 bg-[#F2F4F7] rounded-full flex justify-center items-center border-2 border-white">
                      <span className="text-center text-[#606C80] text-[10px] font-bold">
                        +5
                      </span>
                    </div>
                  )}
                </div>
                <button className="p-2 bg-white rounded-full border-2 border-[#EBEEF2] flex justify-center items-center">
                  <Plus className="w-4 h-4 text-[#DADEE5]" />
                </button>
              </div>

              <div className="flex gap-2">
                {task.comments > 0 && (
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4 text-[#DADEE5]" />
                    <span className="text-[#98A2B2] text-[10px] font-bold">
                      {task.comments}
                    </span>
                  </div>
                )}
                {task.attachments > 0 && (
                  <div className="flex items-center gap-1">
                    <Paperclip className="w-4 h-4 text-[#DADEE5]" />
                    <span className="text-[#98A2B2] text-[10px] font-bold">
                      {task.attachments}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}
