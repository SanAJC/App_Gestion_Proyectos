"use client";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { Plus, MoreHorizontal } from "lucide-react";
import TaskCard from "@/components/boardTrello/task-card";
import { Badge } from "@/components/ui/badge";

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

type BoardViewProps = {
  tasks: Task[];
  todoTasks: Task[];
  inProcessTasks: Task[];
  doneTasks: Task[];
  onDragEnd: (result: any) => void;
  onAddTask?: (status: "to-do" | "in-process" | "done" | "to-verify") => void;
};

export default function BoardView({
//   tasks, 
  todoTasks,
  inProcessTasks,
  doneTasks,
  onDragEnd,
  onAddTask,
}: BoardViewProps) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 px-6 mt-4">
        {/* To Do Column */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-[#1F2633]">
                To Do Tasks
              </h2>
              <Badge 
                variant="outline"
                className="bg-[rgba(236,72,153,0.1)] text-[#DB2777] font-bold border-transparent"
              >
                {todoTasks.length}
              </Badge>
            </div>
            <button className="text-[#C7CED9]">
              <MoreHorizontal size={20} />
            </button>
          </div>

          <Droppable droppableId="to-do">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-4"
              >
                {todoTasks.map((task, index) => (
                  <TaskCard key={task.id} task={task} index={index} />
                ))}
                {provided.placeholder}
                <button
                  onClick={() => onAddTask && onAddTask("to-do")}
                  className="w-full p-2 bg-white rounded-lg border border-[#F2F4F7] flex justify-center items-center hover:bg-gray-50"
                >
                  <Plus className="text-[#C7CED9]" size={20} />
                </button>
              </div>
            )}
          </Droppable>
        </div>

        {/* In Process Column */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-[#1F2633]">
                In Process
              </h2>
              <Badge 
                variant="outline"
                className="bg-[rgba(168,85,247,0.1)] text-[#9333EA] font-bold border-transparent"
              >
                {inProcessTasks.length}
              </Badge>
            </div>
            <button className="text-[#C7CED9]">
              <MoreHorizontal size={20} />
            </button>
          </div>

          <Droppable droppableId="in-process">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-4"
              >
                {inProcessTasks.map((task, index) => (
                  <TaskCard key={task.id} task={task} index={index} />
                ))}
                {provided.placeholder}
                <button
                  onClick={() => onAddTask && onAddTask("in-process")}
                  className="w-full p-2 bg-white rounded-lg border border-[#F2F4F7] flex justify-center items-center hover:bg-gray-50"
                >
                  <Plus className="text-[#C7CED9]" size={20} />
                </button>
              </div>
            )}
          </Droppable>
        </div>

        {/* Done Column */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-[#1F2633]">Done</h2>
              <Badge 
                variant="outline"
                className="bg-[rgba(34,197,94,0.1)] text-[#16A34A] font-bold border-transparent"
              >
                {doneTasks.length}
              </Badge>
            </div>
            <button className="text-[#C7CED9]">
              <MoreHorizontal size={20} />
            </button>
          </div>

          <Droppable droppableId="done">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-4"
              >
                {doneTasks.map((task, index) => (
                  <TaskCard key={task.id} task={task} index={index} />
                ))}
                {provided.placeholder}
                <button
                  onClick={() => onAddTask && onAddTask("done")}
                  className="w-full p-2 bg-white rounded-lg border border-[#F2F4F7] flex justify-center items-center hover:bg-gray-50"
                >
                  <Plus className="text-[#C7CED9]" size={20} />
                </button>
              </div>
            )}
          </Droppable>
        </div>
      </div>
    </DragDropContext>
  );
}
