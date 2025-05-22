"use client";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { Plus, MoreHorizontal } from "lucide-react";
import TaskCard from "@/components/boardTrello/task-card";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/types/task"; // Importamos el tipo Task desde el archivo común

type BoardViewProps = {
  tasks: Task[];
  todoTasks: Task[];
  inProcessTasks: Task[];
  doneTasks: Task[];
  toVerifyTasks: Task[];
  projectId?: string;
  onDragEnd: (result: any) => void;
  onAddTask?: (
    status: "por-hacer" | "en-proceso" | "hecho" | "por-verificar"
  ) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
};

export default function BoardView({
  //   tasks,
  todoTasks,
  inProcessTasks,
  doneTasks,
  toVerifyTasks,
  projectId,
  onDragEnd,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: BoardViewProps) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 px-6 mt-4">
        {/* Por hacer Column */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-[#1F2633]">
                Por hacer
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

          <Droppable droppableId="por-hacer">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-4"
              >
                {todoTasks.map((task, index) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    index={index}
                    projectId={projectId}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                  />
                ))}
                {provided.placeholder}
                <button
                  onClick={() => onAddTask && onAddTask("por-hacer")}
                  className="w-full p-2 bg-white rounded-lg border border-[#F2F4F7] flex justify-center items-center hover:bg-gray-50"
                >
                  <Plus className="text-[#C7CED9]" size={20} />
                </button>
              </div>
            )}
          </Droppable>
        </div>
        {/* En proceso Column */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-[#1F2633]">
                En proceso
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

          <Droppable droppableId="en-proceso">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-4"
              >
                {inProcessTasks.map((task, index) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    index={index}
                    projectId={projectId}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                  />
                ))}
                {provided.placeholder}
                <button
                  onClick={() => onAddTask && onAddTask("en-proceso")}
                  className="w-full p-2 bg-white rounded-lg border border-[#F2F4F7] flex justify-center items-center hover:bg-gray-50"
                >
                  <Plus className="text-[#C7CED9]" size={20} />
                </button>
              </div>
            )}
          </Droppable>
        </div>

        {/* Por verificar Column */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-[#1F2633]">
                Por verificar
              </h2>
              <Badge
                variant="outline"
                className="bg-[rgba(251,191,36,0.1)] text-[#F59E0B] font-bold border-transparent"
              >
                {toVerifyTasks.length}
              </Badge>
            </div>
            <button className="text-[#C7CED9]">
              <MoreHorizontal size={20} />
            </button>
          </div>

          <Droppable droppableId="por-verificar">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-4"
              >
                {toVerifyTasks.map((task, index) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    index={index}
                    projectId={projectId}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                  />
                ))}
                {provided.placeholder}
                <button
                  onClick={() => onAddTask && onAddTask("por-verificar")}
                  className="w-full p-2 bg-white rounded-lg border border-[#F2F4F7] flex justify-center items-center hover:bg-gray-50"
                >
                  <Plus className="text-[#C7CED9]" size={20} />
                </button>
              </div>
            )}
          </Droppable>
        </div>

        {/* Hecho Column */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-[#1F2633]">Hecho</h2>
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

          <Droppable droppableId="hecho">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-4"
              >
                {doneTasks.map((task, index) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    index={index}
                    projectId={projectId}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                  />
                ))}
                {provided.placeholder}
                <button
                  onClick={() => onAddTask && onAddTask("hecho")}
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
