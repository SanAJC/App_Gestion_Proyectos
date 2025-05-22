// Tipo para los usuarios
export type User = {
  uid?: string;
  username: string;
  email: string;
  rol: "admin" | "user";
};

export type Task = {
  id?: string;
  title: string;
  taskId: string;
  description?: string;
  status: "por-hacer" | "en-proceso" | "hecho" | "por-verificar";
  assignees: { id: string; image: string }[];
  comments: number; // Total de comentarios
  commentsList?: string[]; // Lista de comentarios
  attachments: number; // Total de archivos adjuntos
  attachmentsList?: string[]; // Lista de archivos adjuntos
  tags?: string[];
  coverImage?: string;
  createdAt?: Date | string; // Puede ser Date o string ISO
  dueDate?: Date | string;
};

export type Project = {
  id?: string;
  miembros: string[];
  title: string;
  description: string;
  githubRepo: GitHubRepo;
  ownerId: string;
  status: "activo" | "inactivo" | "finalizado";
  tasks?: Task[];
};

export type GitHubTokenResponse = {
  access_token: string;
  scope: string;
  token_type: string;
};

export type GitHubUser = {
  email: string;
  login: string;
};

export type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
};
