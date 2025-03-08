// types.ts

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
  description: string;
  status: "pendiente" | "en-progreso" | "completada"; 
  assignedTo: string; // UID del usuario asignado
  createdAt: Date; // Convertir `Timestamp` de Firebase a `Date`
  dueDate: Date;
};
  
export type Project = {
  id?: string; 
  miembros: string[]; 
  title: string;
  description: string;
  githubRepo: string;
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