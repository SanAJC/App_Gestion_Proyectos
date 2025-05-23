// Definición común de Task para compartir entre componentes
export type Task = {
  id: string;
  title: string;
  taskId: string;
  status: "por-hacer" | "en-proceso" | "hecho" | "por-verificar";
  assignees: {
    id: string;
    image: string;
    username?: string;
    email?: string;
    displayName?: string;
  }[];
  comments: number; // Total de comentarios
  commentsList?: string[]; // Lista de comentarios
  attachments: number; // Total de archivos adjuntos
  attachmentsList?: string[]; // Lista de archivos adjuntos
  tags?: string[];
  coverImage?: string;
};
