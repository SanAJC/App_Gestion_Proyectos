import { Task } from "@/types/task"; // Importamos el tipo Task desde el archivo común

type ListViewProps = {
  tasks: Task[];
};

export default function ListView({ tasks }: ListViewProps) {
  return (
    <div className="px-6 mt-4">
      <div className="bg-white rounded-lg border border-[#EBEEF2] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#FAFBFC] border-b border-[#EBEEF2]">
              <th className="text-left py-3 px-4 text-[#1F2633] text-xs font-semibold">
                Tarea
              </th>
              <th className="text-left py-3 px-4 text-[#1F2633] text-xs font-semibold">
                ID
              </th>
              <th className="text-left py-3 px-4 text-[#1F2633] text-xs font-semibold">
                Estado
              </th>
              <th className="text-left py-3 px-4 text-[#1F2633] text-xs font-semibold">
                Asignados
              </th>
              <th className="text-left py-3 px-4 text-[#1F2633] text-xs font-semibold">
                Comentarios
              </th>
              <th className="text-left py-3 px-4 text-[#1F2633] text-xs font-semibold">
                Adjuntos
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              // Determinar el color del estado
              let statusColor = "";
              let statusBg = "";

              if (task.status === "por-hacer") {
                statusColor = "text-[#DB2777]";
                statusBg = "bg-[rgba(236,72,153,0.1)]";
              } else if (task.status === "en-proceso") {
                statusColor = "text-[#9333EA]";
                statusBg = "bg-[rgba(168,85,247,0.1)]";
              } else if (task.status === "hecho") {
                statusColor = "text-[#16A34A]";
                statusBg = "bg-[rgba(34,197,94,0.1)]";
              } else if (task.status === "por-verificar") {
                statusColor = "text-[#F59E0B]";
                statusBg = "bg-[#f59e0b29]";
              } // Convertir el estado a texto legible
              let statusText = "";
              if (task.status === "por-hacer") statusText = "Por hacer";
              else if (task.status === "en-proceso") statusText = "En proceso";
              else if (task.status === "hecho") statusText = "Hecho";
              else if (task.status === "por-verificar")
                statusText = "Por verificar";

              return (
                <tr
                  key={task.id}
                  className="border-b border-[#EBEEF2] hover:bg-[#F9FAFB]"
                >
                  <td className="py-3 px-4 text-[#1F2633] text-xs font-semibold">
                    {task.title}
                  </td>
                  <td className="py-3 px-4">
                    <div className="h-5 px-2 py-[5px] bg-white rounded-full border border-[#EBEEF2] inline-flex justify-center items-center">
                      <div className="text-center text-[#606C80] text-[10px] font-bold">
                        {task.taskId}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div
                      className={`h-5 px-2 py-[5px] ${statusBg} rounded-full inline-flex justify-center items-center`}
                    >
                      <div
                        className={`text-center ${statusColor} text-[10px] font-bold`}
                      >
                        {statusText}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex">
                      {task.assignees.map((assignee, i) => (
                        <img
                          key={i}
                          className={`w-6 h-6 rounded-full border-2 border-white ${
                            i > 0 ? "-ml-2" : ""
                          }`}
                          src={
                            assignee.image ||
                            "/placeholder.svg?height=24&width=24"
                          }
                          alt="Avatar"
                        />
                      ))}
                      {task.assignees.length > 0 && (
                        <div className="w-6 h-6 bg-[#F2F4F7] rounded-full flex justify-center items-center -ml-2 border-2 border-white">
                          <div className="text-center text-[#606C80] text-[8px] font-bold">
                            +5
                          </div>
                        </div>
                      )}
                    </div>
                  </td>{" "}
                  <td className="py-3 px-4 text-[#98A2B2] text-[10px] font-bold">
                    <div
                      className="flex items-center gap-1"
                      title={
                        task.comments === 1
                          ? "1 comentario"
                          : `${task.comments} comentarios`
                      }
                    >
                      {task.comments > 0 && (
                        <>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {task.comments}
                          </span>
                        </>
                      )}
                      {task.comments === 0 && "-"}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#98A2B2] text-[10px] font-bold">
                    <div
                      className="flex items-center gap-1"
                      title={
                        task.attachments === 1
                          ? "1 archivo adjunto"
                          : `${task.attachments} archivos adjuntos`
                      }
                    >
                      {task.attachments > 0 && (
                        <>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            {task.attachments}
                          </span>
                        </>
                      )}
                      {task.attachments === 0 && "-"}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
