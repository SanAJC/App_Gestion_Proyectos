import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@/components/ui/avatar";
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

// Definimos el tipo de proyecto
interface Project {
  id: string;
  title: string;
  image: string;
  type: string;
  repo: string;
  members: string[];
}

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  // Estado para los proyectos (ahora editable)
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      title: "Desarrollo APP mobil",
      image:
        "https://www.visual-planning.com/es/wp-content/uploads/2020/11/Cuales-son-las-caracteristicas-imprescindibles-de-un-software-de-gestion-de-proyectos-Visual-Planning.jpg",
      type: "mobile",
      repo: "",
      members: [],
    },
    {
      id: "2",
      title: "Diseño UI",
      image:
        "https://3530961.fs1.hubspotusercontent-na1.net/hub/3530961/hubfs/Blog_Pensemos_707x282px_8.jpg?width=800&height=346&name=Blog_Pensemos_707x282px_8.jpg",
      type: "design",
      repo: "",
      members: [],
    },
    {
      id: "3",
      title: "Desarrollo web",
      image:
        "https://gestiondeproyectos340245913.wordpress.com/wp-content/uploads/2021/05/promo-image.1547668953.png?w=750",
      type: "web",
      repo: "",
      members: [],
    },
    {
      id: "4",
      title: "Sistema de diseño",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSub_8WUp5xKfX9h8fwCUcQvp1GOXCoUyA0XnESEUu0sf-0a4kOvMm1lVZwGs8pM23Jd_g&usqp=CAU",
      type: "system",
      repo: "",
      members: [],
    },
  ]);

  // Estado para modal CRUD
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form, setForm] = useState({
    title: "",
    image: "",
    repo: "",
    members: [] as string[],
    memberInput: "",
  });

  // Estado para modal de detalles
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailProject, setDetailProject] = useState<Project | null>(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Componente para el contenido principal que se ajusta al estado del sidebar
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

  // Abrir modal para crear
  const openCreateModal = () => {
    setEditingProject(null);
    setForm({ title: "", image: "", repo: "", members: [], memberInput: "" });
    setIsModalOpen(true);
  };

  // Abrir modal para editar
  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setForm({
      title: project.title,
      image: project.image,
      repo: project.repo || "",
      members: project.members || [],
      memberInput: "",
    });
    setIsModalOpen(true);
  };

  // Guardar proyecto (crear o editar)
  const handleSave = () => {
    if (!form.title.trim()) return;
    if (editingProject) {
      setProjects(
        projects.map((p) =>
          p.id === editingProject.id
            ? { ...editingProject, ...form, members: form.members }
            : p
        )
      );
    } else {
      setProjects([
        ...projects,
        {
          id: Date.now().toString(),
          title: form.title,
          image:
            form.image || "https://via.placeholder.com/300x120?text=Proyecto",
          type: "custom",
          repo: form.repo,
          members: form.members,
        },
      ]);
    }
    setIsModalOpen(false);
  };

  // Eliminar proyecto
  const handleDelete = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  // Añadir integrante
  const handleAddMember = () => {
    if (
      form.memberInput.trim() &&
      !form.members.includes(form.memberInput.trim())
    ) {
      setForm({
        ...form,
        members: [...form.members, form.memberInput.trim()],
        memberInput: "",
      });
    }
  };

  // Eliminar integrante
  const handleRemoveMember = (member: string) => {
    setForm({ ...form, members: form.members.filter((m) => m !== member) });
  };

  // Abrir modal de detalles
  const openDetailModal = (project: Project) => {
    setDetailProject(project);
    setIsDetailModalOpen(true);
  };

  // Duplicar proyecto
  const handleDuplicate = (project: Project) => {
    setProjects([
      ...projects,
      {
        ...project,
        id: Date.now().toString(),
        title: project.title + " (Copia)",
      },
    ]);
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
            src={project.image}
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
            <button
              onClick={() => openEditModal(project)}
              className="bg-white rounded-full p-1 shadow hover:bg-gray-100"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => handleDelete(project.id)}
              className="bg-white rounded-full p-1 shadow hover:bg-gray-100"
            >
              <Trash2 size={18} />
            </button>
            <button
              onClick={() => handleDuplicate(project)}
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
        </div>
      </div>
    );
  };

  // Leer avatar personalizado del localStorage por usuario
  const userEmail = user?.email || "";
  const savedAvatar = userEmail ? localStorage.getItem(`userAvatar_${userEmail}`) : null;

  return (
    <div className="bg-[#f2f2f2] h-screen flex flex-col">
      {/* Sidebar Provider */}
      <SidebarProvider className="flex flex-1 h-full">
        {/* Sidebar */}
        <Sidebar
          className="border-r bg-slate-50 border-slate-200 w-auto h-full"
          collapsible="icon"
        >
          <SidebarHeader className="p-4 flex justify-between group-data-[collapsible=icon]:p-2">
            <div className="text-teal-600 font-bold text-2xl flex items-center">
              <img src="../public/assets/img/Logo.svg" alt="" />
              <span className="md:hidden lg:inline transition-opacity duration-200 ease-linear group-data-[collapsible=icon]:opacity-0">
                CoAAP
              </span>
            </div>
          </SidebarHeader>

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
                onMouseEnter={(e) => {
                  const boxIcon = e.currentTarget.querySelector(".box-icon");
                  if (boxIcon) boxIcon.classList.remove("opacity-50");
                }}
                onMouseLeave={(e) => {
                  const boxIcon = e.currentTarget.querySelector(".box-icon");
                  if (boxIcon) boxIcon.classList.add("opacity-50");
                }}
                onClick={() => navigate("/dashboard")}
              >
                <Box className="box-icon w-6 h-6 mr-3 text-[#2C8780] group-data-[collapsible=icon]:mr-0 group-data-[collapsible=icon]:opacity-100 opacity-50" />
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
                <FileText className="w-6 h-6 mr-3 group-data-[collapsible=icon]:mr-0 group-data-[collapsible=icon]:opacity-100 opacity-50" />
                <span className="transition-opacity duration-200 ease-linear font-normal group-data-[collapsible=icon]:opacity-0">
                  Proyectos
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarContent>

          <SidebarFooter className="mt-auto p-4 group-data-[collapsible=icon]:p-2">
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Configuración"
                className="flex items-center text-[#2C2C2C] p-2 rounded hover:bg-slate-100 group-data-[collapsible=icon]:justify-center"
                onClick={() => navigate("/settings")}
              >
                <Settings className="Settings-icon w-6 h-6 mr-3 text-[#2C8780] group-data-[collapsible=icon]:mr-0 group-data-[collapsible=icon]:opacity-100 opacity-50" />
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
                          savedAvatar ||
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
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#1F2527] text-white border-none rounded-md p-2">
                  <DropdownMenuLabel className="text-white">
                    <p className="font-medium">
                      {user?.username || "Juanes Coronell"}
                    </p>
                    <p className="text-xs text-white/70">
                      {user?.email || "Juanes@gmail.com"}
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
            >
              <Plus size={18} /> Crear proyecto
            </button>
          </div>

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-8 shadow-xl relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#1F2633]">
                {editingProject ? "Editar proyecto" : "Crear nuevo proyecto"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
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
                />
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
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.memberInput}
                    onChange={(e) =>
                      setForm({ ...form, memberInput: e.target.value })
                    }
                    className="flex-1 px-3 py-2 border border-[#EBEEF2] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre o email del integrante"
                  />
                  <button
                    type="button"
                    onClick={handleAddMember}
                    className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
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
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 bg-[#2C8780] text-white rounded-lg hover:bg-opacity-90"
                >
                  {editingProject ? "Guardar cambios" : "Crear proyecto"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para ver detalles del proyecto */}
      {isDetailModalOpen && detailProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
              <div>
                <label className="block text-sm font-medium text-[#1F2633] mb-1">
                  Imagen
                </label>
                <img
                  src={detailProject.image}
                  alt={detailProject.title}
                  className="w-full h-32 object-cover rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1F2633] mb-1">
                  Repositorio de GitHub
                </label>
                <a
                  href={detailProject.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline break-all"
                >
                  {detailProject.repo}
                </a>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1F2633] mb-1">
                  Integrantes
                </label>
                <div className="flex gap-2 flex-wrap">
                  {detailProject.members.length === 0 ? (
                    <span className="text-gray-400">Sin integrantes</span>
                  ) : (
                    detailProject.members.map((member) => (
                      <span
                        key={member}
                        className="bg-gray-100 rounded-full px-2 py-1 text-xs"
                      >
                        {member}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
