// Frontend/src/pages/ProjectsPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { logout } from "@/store/slices/authSlice";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Settings,
  FileText,
  Box,
  ChevronLeft,
  Clock,
  Plus,
  Edit,
  Trash2,
  Copy,
} from "lucide-react";
import api from "@/services/api";
import { toast } from "react-toastify";

// Definimos el tipo de proyecto (ajustado para coincidir con el backend si es necesario)
interface Project {
  id: string;
  title: string;
  description?: string;
  ownerId: string;
  miembros: string[];
  githubRepo?: {
    name: string;
    url: string;
  };
  status?: string;
  image?: string;
  type?: string;
}

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para modal CRUD
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    repo: "",
    members: [] as string[],
    memberInput: "",
  });
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailProject, setDetailProject] = useState<Project | null>(null);

  // Estado para el modal de confirmación de eliminación
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/projects/user/${user?.uid}`);
      console.log("Datos recibidos del servidor:", response.data);
      setProjects(response.data.projects);
      console.log("Proyectos después de setProjects:", response.data.projects);
    } catch (err: any) {
      console.error("Error al cargar proyectos:", err);
      setError("Error al cargar proyectos.");
      toast.error("Error al cargar proyectos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      fetchProjects();
    }
  }, [user?.uid]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  const MainContent = ({ children }: { children: React.ReactNode }) => {
    const { state } = useSidebar();
    return (
      <div
        className={`flex-1 overflow-auto pt-4 px-4 pb-0 transition-all duration-200 ease-linear ${
          state === "collapsed" ? "md:ml-12" : ""
        }`}
      >
        {children}
      </div>
    );
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setForm({
      title: "",
      description: "",
      image: "",
      repo: "",
      members: [],
      memberInput: "",
    });
    setIsModalOpen(true);
  };
  const openEditModal = (project: Project) => {
    console.log("Editando proyecto:", project);
    console.log("Miembros del proyecto:", project.miembros);

    setEditingProject(project);
    setForm({
      title: project.title,
      description: project.description || "",
      image: project.image || "",
      repo: project.githubRepo?.url || "",
      members: project.miembros || [],
      memberInput: "",
    });

    console.log("Formulario después de cargar proyecto:", {
      ...form,
      members: project.miembros || [],
    });

    setIsModalOpen(true);
  };
  const handleSave = async () => {
    // Validar que haya un título y un usuario autenticado
    if (!form.title.trim() || !user?.uid) {
      toast.warning("El título del proyecto es obligatorio.");
      return;
    }

    // Asegurar que los miembros siempre sean un array
    const miembros = Array.isArray(form.members) ? form.members : [];
    console.log("Miembros antes de guardar:", miembros);

    // Preparar los datos del proyecto
    const projectData = {
      title: form.title,
      description: form.description,
      ownerId: user.uid,
      miembros: miembros, // Usar la variable asegurada
      githubRepo: form.repo
        ? { name: form.repo.split("/").pop() || "", url: form.repo }
        : undefined,
      status: "activo",
      image: form.image || "https://via.placeholder.com/300x120?text=Proyecto",
    };

    console.log("Datos a enviar:", projectData);
    console.log("Es edición?", editingProject ? "Sí" : "No");

    if (editingProject) {
      console.log("ID del proyecto a actualizar:", editingProject.id);
    }

    setLoading(true);
    try {
      if (editingProject) {
        // Lógica para actualizar proyecto
        await api.put(`/projects/${editingProject.id}`, projectData);
        toast.success("Proyecto actualizado correctamente", {
          icon: "✅",
          style: { backgroundColor: "#38A169", color: "white" },
        });
        fetchProjects(); // Volver a cargar proyectos después de actualizar
      } else {
        await api.post("/projects", projectData);
        toast.success("Proyecto creado correctamente", {
          icon: "🚀",
          style: { backgroundColor: "#38A169", color: "white" },
        });
        fetchProjects();
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Error al guardar proyecto:", err);
      toast.error(
        `Error al guardar proyecto: ${
          err.response?.data?.message || err.message
        }`,
        {
          style: { backgroundColor: "#E53E3E", color: "white" },
        }
      );
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await api.delete(`/projects/${id}`);
      toast.success("Proyecto eliminado correctamente", {
        icon: "🗑️",
        style: { backgroundColor: "#E53E3E", color: "white" },
      });
      setIsDeleteModalOpen(false);
      setProjectToDelete(null);
      fetchProjects();
    } catch (err: any) {
      console.error("Error al eliminar proyecto:", err);
      toast.error(
        `Error al eliminar proyecto: ${
          err.response?.data?.message || err.message
        }`,
        {
          style: { backgroundColor: "#E53E3E", color: "white" },
        }
      );
    } finally {
      setLoading(false);
    }
  };

  // Función para abrir el modal de confirmación de eliminación
  const openDeleteModal = (project: Project) => {
    setProjectToDelete(project);
    setIsDeleteModalOpen(true);
  }; // Añadir integrante
  const handleAddMember = () => {
    // Asegurar que members sea un array incluso si es undefined o null
    const currentMembers = Array.isArray(form.members) ? form.members : [];

    // Verificar que el input no esté vacío y que no exista ya en la lista
    if (
      form.memberInput.trim() &&
      !currentMembers.includes(form.memberInput.trim())
    ) {
      // Crear una nueva lista añadiendo el nuevo miembro
      const updatedMembers = [...currentMembers, form.memberInput.trim()];
      console.log("Miembros actualizados:", updatedMembers);

      setForm({
        ...form,
        members: updatedMembers,
        memberInput: "",
      });
    } else if (!form.memberInput.trim()) {
      toast.warning("Por favor ingresa un nombre o email válido.");
    } else {
      toast.info("Este integrante ya está en la lista.");
    }
  };
  // Eliminar integrante
  const handleRemoveMember = (member: string) => {
    const currentMembers = Array.isArray(form.members) ? form.members : [];
    setForm({
      ...form,
      members: currentMembers.filter((m) => m !== member),
    });
    console.log("Miembro eliminado:", member);
  };

  // Abrir modal de detalles
  const openDetailModal = (project: Project) => {
    setDetailProject(project);
    setIsDetailModalOpen(true);
  };
  // Duplicar proyecto (funcionalidad a implementar en backend si es necesario)
  const handleDuplicate = () => {
    // setProjects([
    //   ...projects,
    //   {
    //     ...project,
    //     id: Date.now().toString(),
    //     title: project.title + " (Copia)",
    //   },
    // ]);
    toast.info(
      "La función duplicar proyecto aún no está implementada en el backend."
    );
  };

  // Componente para la tarjeta de proyecto
  const ProjectCard = ({ project }: { project: Project }) => {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(false);
    const handleCardClick = () => {
      navigate(`/project/${project.id}`);
    };
    return (
      <div
        className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer relative group"
        onClick={handleCardClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="relative">
          <img
            src={
              project.image ||
              "https://via.placeholder.com/300x120?text=Proyecto"
            } // Imagen por defecto
            alt={project.title}
            className="w-full h-32 object-cover"
          />
          {/* Botones de editar, eliminar y duplicar */}
          <div
            className={`absolute top-2 right-2 flex gap-2 transition-opacity ${
              hovered ? "opacity-100" : "opacity-0"
            } group-hover:opacity-100`}
            onClick={(e) => e.stopPropagation()}
          >
            {" "}
            <button
              onClick={() => openEditModal(project)}
              className="bg-white rounded-full p-1 shadow hover:bg-gray-100"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => openDeleteModal(project)}
              className="bg-white rounded-full p-1 shadow hover:bg-gray-100"
            >
              <Trash2 size={18} />
            </button>{" "}
            <button
              onClick={() => handleDuplicate()}
              className="bg-white rounded-full p-1 shadow hover:bg-gray-100"
            >
              <Copy size={18} />
            </button>
          </div>
        </div>
        <div className="p-4">
          <h3
            className="text-lg font-medium text-gray-800 hover:underline cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              openDetailModal(project);
            }}
          >
            {project.title}
          </h3>
          {/* Mostrar descripción si existe */}
          {project.description && (
            <p className="text-sm text-gray-600 mt-1">{project.description}</p>
          )}{" "}
          {/* Mostrar miembros si existen */}
          {project.miembros &&
            Array.isArray(project.miembros) &&
            project.miembros.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {project.miembros.map((member, index) => (
                  <Badge key={index} variant="secondary">
                    {member}
                  </Badge>
                ))}
              </div>
            )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#f2f2f2] min-h-screen flex flex-col">
      {/* Sidebar Provider */}
      <SidebarProvider className="flex flex-1 h-full">
        {/* Sidebar */}
        <Sidebar
          className="border-r bg-slate-50 border-slate-200 w-auto h-full"
          collapsible="icon"
        >
          {" "}
          <SidebarHeader className="p-4 flex justify-between group-data-[collapsible=icon]:p-2">
            <div className="text-teal-600 font-bold text-2xl flex items-center">
              {" "}
              <img src="/assets/img/Logo.svg" alt="Logo CoAAP" />
              <span className="md:hidden lg:inline transition-opacity duration-200 ease-linear group-data-[collapsible=icon]:opacity-0">
                CoAAP
              </span>
            </div>
          </SidebarHeader>{" "}
          <SidebarContent className="px-4 mt-4 group-data-[collapsible=icon]:px-2 flex-grow">
            <div className="relative mb-6 group-data-[collapsible=icon]:hidden">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
                size={18}
              />
              <Input
                placeholder="Buscar"
                className="pl-10 bg-[#2C8780] border-none text-white placeholder-white focus:ring-0 focus:outline-none"
              />
            </div>
            <SidebarMenuItem className="mb-2 group-data-[collapsible=icon]:mb-4">
              <SidebarMenuButton
                tooltip="Dashboard"
                className="flex items-center text-[#2C2C2C] p-2 rounded hover:bg-slate-100 hover:text-teal-600 group-data-[collapsible=icon]:justify-center"
                onClick={() => navigate("/dashboard")}
              >
                <Box className="w-6 h-6 mr-3 text-[#2C8780] group-data-[collapsible=icon]:mr-0" />
                <span className="transition-opacity duration-200 ease-linear font-normal group-data-[collapsible=icon]:opacity-0">
                  Dashboard
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem className="mb-2 group-data-[collapsible=icon]:mb-4">
              <SidebarMenuButton
                tooltip="Proyectos"
                isActive={true}
                className="flex items-center text-teal-600 font-medium p-2 rounded hover:bg-slate-100 group-data-[collapsible=icon]:justify-center"
              >
                <FileText className="w-6 h-6 mr-3 group-data-[collapsible=icon]:mr-0" />
                <span className="transition-opacity duration-200 ease-linear font-normal group-data-[collapsible=icon]:opacity-0">
                  Proyectos
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarContent>{" "}
          <SidebarFooter className="mt-auto p-4 group-data-[collapsible=icon]:p-2">
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Configuración"
                className="flex items-center text-[#2C2C2C] p-2 rounded hover:bg-slate-100 hover:text-teal-600 group-data-[collapsible=icon]:justify-center"
                onClick={() => navigate("/settings")}
              >
                <Settings className="w-6 h-6 mr-3 text-[#2C8780] group-data-[collapsible=icon]:mr-0" />
                <span className="transition-opacity duration-200 ease-linear font-normal group-data-[collapsible=icon]:opacity-0">
                  Configuración
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <Separator className="my-4 group-data-[collapsible=icon]:hidden" />
            <div className="flex items-center bg-[#4EADA1] rounded-lg p-3 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:bg-transparent">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center cursor-pointer">
                    <Avatar className="h-10 w-10 mr-3 group-data-[collapsible=icon]:mr-0">
                      <img
                        src={
                          localStorage.getItem(`userAvatar_${user?.email}`) ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user?.username || user?.displayName || "Usuario"
                          )}`
                        }
                        alt="Avatar"
                      />
                    </Avatar>
                    <div className="flex-1 group-data-[collapsible=icon]:hidden">
                      <p className="font-medium text-white">
                        {user?.username || user?.displayName || "Usuario"}
                      </p>
                      <p className="text-xs text-white/70">
                        {user?.email || "correo@ejemplo.com"}
                      </p>
                    </div>
                  </div>
                </DropdownMenuTrigger>{" "}
                <DropdownMenuContent className="bg-[#1F2527] text-white border-none rounded-md p-2">
                  <DropdownMenuLabel className="text-white">
                    <p className="font-medium">
                      {user?.username || user?.displayName || "Usuario"}
                    </p>
                    <p className="text-xs text-white/70">
                      {user?.email || "correo@ejemplo.com"}
                    </p>
                  </DropdownMenuLabel>
                  <Separator className="my-2 bg-gray-600" />
                  <DropdownMenuItem
                    onSelect={handleLogout}
                    className="text-white hover:bg-gray-700 rounded-md flex items-center"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Mobile Sidebar Trigger */}
        <header className="p-4 md:hidden">
          <SidebarTrigger />
        </header>

        {/* Main Content */}
        <MainContent>
          {/* Header with Proyectos title */}
          <div className="flex items-center mb-6 justify-between">
            <div className="flex items-center">
              <Clock className="text-teal-600 mr-2" size={24} />
              <h1 className="text-2xl font-semibold text-gray-800">
                Proyectos
              </h1>
            </div>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 bg-[#2C8780] text-white px-4 py-2 rounded-lg shadow hover:bg-[#256c63] transition-colors"
              disabled={loading} // Deshabilitar botón mientras carga
            >
              {loading ? (
                "Cargando..."
              ) : (
                <>
                  <Plus size={18} /> Crear proyecto
                </>
              )}
            </button>
          </div>

          {/* Loading/Error State */}
          {loading && <p>Cargando proyectos...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && projects.length === 0 && (
            <p>No hay proyectos disponibles.</p>
          )}

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </MainContent>
      </SidebarProvider>

      {/* Modal para crear/editar proyecto */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#000000a6] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-8 shadow-xl relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#1F2633]">
                {editingProject ? "Editar proyecto" : "Crear nuevo proyecto"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                disabled={loading}
              >
                ×
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1F2633] mb-1">
                  Título del proyecto
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border border-[#EBEEF2] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nombre del proyecto"
                  disabled={loading}
                />
              </div>
              <div>
                {" "}
                {/* Nuevo campo para la descripción */}
                <label className="block text-sm font-medium text-[#1F2633] mb-1">
                  Descripción
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-[#EBEEF2] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Descripción del proyecto"
                  rows={3}
                  disabled={loading}
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1F2633] mb-1">
                  Imagen (URL)
                </label>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full px-3 py-2 border border-[#EBEEF2] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="URL de la imagen"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1F2633] mb-1">
                  Repositorio de GitHub
                </label>
                <input
                  type="text"
                  value={form.repo}
                  onChange={(e) => setForm({ ...form, repo: e.target.value })}
                  className="w-full px-3 py-2 border border-[#EBEEF2] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://github.com/usuario/repositorio"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1F2633] mb-1">
                  Integrantes
                </label>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {form.members.map((member) => (
                    <div
                      key={member}
                      className="flex items-center bg-gray-100 rounded-full px-2 py-1"
                    >
                      <span className="text-xs mr-1">{member}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(member)}
                        className="text-gray-500 hover:text-gray-700 ml-1"
                        disabled={loading}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  {" "}
                  <input
                    type="text"
                    value={form.memberInput}
                    onChange={(e) =>
                      setForm({ ...form, memberInput: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddMember();
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-[#EBEEF2] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre o email del integrante"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={handleAddMember}
                    className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                    disabled={loading}
                  >
                    Añadir
                  </button>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#EBEEF2] rounded-lg hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 bg-[#2C8780] text-white rounded-lg hover:bg-opacity-90"
                  disabled={loading} // Deshabilitar botón mientras guarda
                >
                  {loading
                    ? "Guardando..."
                    : editingProject
                    ? "Guardar cambios"
                    : "Crear proyecto"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para ver detalles del proyecto */}
      {isDetailModalOpen && detailProject && (
        <div className="fixed inset-0 bg-[#000000a6] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-8 shadow-xl relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#1F2633]">
                Detalles del proyecto
              </h2>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1F2633] mb-1">
                  Título
                </label>
                <div className="px-3 py-2 border border-[#EBEEF2] rounded-lg bg-gray-50">
                  {detailProject.title}
                </div>
              </div>
              {/* Mostrar descripción en detalles si existe */}
              {detailProject.description && (
                <div>
                  <label className="block text-sm font-medium text-[#1F2633] mb-1">
                    Descripción
                  </label>
                  <div className="px-3 py-2 border border-[#EBEEF2] rounded-lg bg-gray-50">
                    {detailProject.description}
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-[#1F2633] mb-1">
                  Imagen
                </label>
                <img
                  src={
                    detailProject.image ||
                    "https://via.placeholder.com/300x120?text=Proyecto"
                  }
                  alt={detailProject.title}
                  className="w-full h-32 object-cover rounded"
                />
              </div>
              {detailProject.githubRepo?.url && ( // Mostrar repositorio si existe
                <div>
                  <label className="block text-sm font-medium text-[#1F2633] mb-1">
                    Repositorio de GitHub
                  </label>
                  <a
                    href={detailProject.githubRepo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline break-all"
                  >
                    {detailProject.githubRepo.url}
                  </a>
                </div>
              )}{" "}
              <div>
                <label className="block text-sm font-medium text-[#1F2633] mb-1">
                  Integrantes
                </label>
                <div className="flex gap-2 flex-wrap">
                  {detailProject.miembros &&
                  Array.isArray(detailProject.miembros) &&
                  detailProject.miembros.length > 0 ? (
                    detailProject.miembros.map((member, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 rounded-full px-2 py-1 text-xs"
                      >
                        {member}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400">Sin integrantes</span>
                  )}
                </div>
              </div>{" "}
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {isDeleteModalOpen && projectToDelete && (
        <div className="fixed inset-0 bg-[#000000a6] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-8 shadow-xl relative">
            <div className="text-center mb-6">
              <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} className="text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Confirmar eliminación
              </h2>
              <p className="text-gray-600 mt-2">
                ¿Estás seguro que deseas eliminar el proyecto{" "}
                <span className="font-semibold">"{projectToDelete.title}"</span>
                ?
              </p>
              <p className="text-red-600 text-sm mt-2">
                Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setProjectToDelete(null);
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(projectToDelete.id)}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin mr-2">⏳</span> Eliminando...
                  </span>
                ) : (
                  "Eliminar"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
