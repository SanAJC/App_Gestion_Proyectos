import React, { useState, useEffect, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@/components/ui/avatar";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { logout } from "@/store/slices/authSlice";
import "@/components/dashboard/dashboard.css";
// Importamos los componentes precargados
import {
  RadarChart,
  CalendarCard,
  CreateTaskCard,
  Timeline,
  CreateTaskModal,
} from "@/utils/preloadComponents";
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
  TrendingUp,
  SquarePlus,
  SquareCheckBig,
} from "lucide-react";

import StatCard from "@/components/dashboard/StatCard";
import {
  RadarChartSkeleton,
  CalendarCardSkeleton,
  CreateTaskCardSkeleton,
  TimelineSkeleton,
  ModalSkeleton,
} from "@/components/dashboard/SkeletonLoaders";
import LocalCache from "@/utils/localCache";

import api from "@/services/api";
import { toast } from "react-toastify";

// Definir interfaz para proyectos
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

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  // Estados para la creación de tareas
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isProjectSelectionOpen, setIsProjectSelectionOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectMembers, setProjectMembers] = useState<
    { id: string; email: string; username: string; image: string }[]
  >([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [modalInitialStatus, setModalInitialStatus] = useState<
    "por-hacer" | "en-proceso" | "hecho" | "por-verificar"
  >("por-hacer");
  const [savingTask, setSavingTask] = useState(false);

  
  const userEmail = user?.email || "";
  const savedAvatar = userEmail
    ? localStorage.getItem(`userAvatar_${userEmail}`)
    : null; 
  useEffect(() => {
    if (user?.uid) {
      
      localStorage.setItem("uid", user.uid);
      
      if (user.email) {
        localStorage.setItem("userEmail", user.email);
      }

      
      LocalCache.clearExpired();

      
      fetchProjects();
    }
  }, [user]);
  
  const fetchProjects = async () => {
    if (!user?.uid) return;

    
    const cacheKey = `user_projects_${user.uid}`;
    const cachedProjects = LocalCache.get(cacheKey);

    if (cachedProjects && Array.isArray(cachedProjects)) {
      // Usar proyectos en caché
      setProjects(cachedProjects as Project[]);
      setLoadingProjects(false);
      return;
    }

    setLoadingProjects(true);
    try {
      const response = await api.get(`/projects/user/${user?.uid}`);
      const projectsData = response.data.projects;

      // Guardar en el estado y en caché
      setProjects(projectsData);
      LocalCache.set(cacheKey, projectsData, 300); // Caché por 5 minutos
    } catch (err: any) {
      console.error("Error al cargar proyectos:", err);
      toast.error("Error al cargar proyectos. Intenta de nuevo más tarde.");
    } finally {
      setLoadingProjects(false);
    }
  };

  // Función para cargar miembros del proyecto
  const fetchProjectMembers = async (projectId: string) => {
    try {
      const response = await api.get(`/projects/${projectId}`);
      const projectData = response.data.project || response.data;

      // Procesar los miembros del proyecto (similar a ProjectBoardPage)
      if (
        projectData &&
        projectData.miembros &&
        Array.isArray(projectData.miembros)
      ) {
        const membersPromises = projectData.miembros.map(
          async (email: string) => {
            try {
              // Obtener información detallada del usuario
              const userResponse = await api.get(
                `/auth/check-user?email=${encodeURIComponent(email)}`
              );
              const userData = userResponse.data;

              return {
                id:
                  userData.userId ||
                  `user-${Math.random().toString(36).substring(2, 9)}`,
                email: email,
                username: userData.exists ? userData.username : email,
                image: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  userData.username || email
                )}&background=random`,
              };
            } catch (error) {
              console.error(
                `Error al obtener datos del usuario ${email}:`,
                error
              );
              return {
                id: `user-${Math.random().toString(36).substring(2, 9)}`,
                email: email,
                username: email,
                image: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  email
                )}&background=random`,
              };
            }
          }
        );

        const membersData = await Promise.all(membersPromises);
        setProjectMembers(membersData);
        return membersData;
      }
      return [];
    } catch (error) {
      console.error("Error al obtener miembros del proyecto:", error);
      toast.error("Error al cargar los miembros del proyecto");
      return [];
    }
  };
  // Función para crear una tarea
  const handleSaveTask = async (newTaskData: any) => {
    if (!selectedProject || !selectedProject.id) {
      toast.error("No se ha seleccionado un proyecto");
      return;
    }

    setSavingTask(true);

    try {
      // Preparar los datos para la API con imágenes por defecto
      const taskDataWithImages = {
        ...newTaskData,
        assignees: newTaskData.assignees.map((a: any) => ({
          ...a,
          image: a.image || `https://picsum.photos/seed/${a.id}/32/32`,
        })),
      };

      // Llamada al API para crear la tarea
      const response = await api.post(
        `/tasks/${selectedProject.id}`,
        taskDataWithImages
      );

      toast.success(
        <div>
          Tarea creada exitosamente
          <button
            className="ml-2 underline text-blue-500"
            onClick={() => navigate(`/project/${selectedProject.id}`)}
          >
            Ver en proyecto
          </button>
        </div>,
        { autoClose: 5000 }
      );

      setIsTaskModalOpen(false);
      setSelectedProject(null);
    } catch (error) {
      console.error("Error al crear la tarea:", error);
      toast.error("Error al crear la tarea");
    } finally {
      setSavingTask(false);
    }
  };

  // Función para abrir el modal de selección de proyecto
  const handleCreateTask = () => {
    if (projects.length === 0) {
      toast.info("Primero debes crear un proyecto");
      navigate("/projects");
      return;
    }

    setIsProjectSelectionOpen(true);
  };

  // Función para seleccionar un proyecto
  const handleSelectProject = async (project: Project) => {
    setSelectedProject(project);
    setIsProjectSelectionOpen(false);

    // Cargar miembros del proyecto
    await fetchProjectMembers(project.id);

    // Abrir el modal de creación de tarea
    setIsTaskModalOpen(true);
  };

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
  // Estados para las estadísticas
  const [tasksStats, setTasksStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    todoTasks: 0,
    toVerify: 0,
  });
  const [, setProjectsCount] = useState(0);
  const [, setLoadingStats] = useState(false);

  // Cargar estadísticas cuando se carguen los proyectos
  useEffect(() => {
    if (projects.length > 0) {
      fetchTasksStats();
    }
  }, [projects]); // Función para obtener las estadísticas de tareas del usuario autenticado
  const fetchTasksStats = async () => {
    if (!user?.uid) {
      console.error("No hay usuario autenticado");
      return;
    }

    // Intentar obtener estadísticas del caché primero
    const cacheKey = `task_stats_${user.uid}`;
    const cachedStats = LocalCache.get(cacheKey);

    if (cachedStats && 
        typeof cachedStats === 'object' && 
        'total' in cachedStats && 
        'completed' in cachedStats && 
        'inProgress' in cachedStats && 
        'todoTasks' in cachedStats && 
        'toVerify' in cachedStats) {
      // Usar estadísticas en caché
      setTasksStats(cachedStats as {
        total: number;
        completed: number;
        inProgress: number;
        todoTasks: number;
        toVerify: number;
      });
      setLoadingStats(false);
      return;
    }

    setLoadingStats(true);
    let totalTasks = 0;
    let completedTasks = 0;
    let inProgressTasks = 0;
    let todoTasks = 0;
    let toVerifyTasks = 0;

    try {
      
      setProjectsCount(projects.length);

      
      const tasksPromises = projects.map(async (project) => {
        try {
          const response = await api.get(`/tasks/${project.id}`);
          const tasksData = response.data.tasks || response.data;

          if (Array.isArray(tasksData)) {
            // Filtrar solo las tareas asignadas al usuario actual
            const userTasks = tasksData.filter(
              (task) =>
                task.assignees &&
                task.assignees.some(
                  (assignee: { id: string | undefined; email: string }) =>
                    assignee.id === user.uid || assignee.email === user.email
                )
            );

            totalTasks += userTasks.length;

            // Contar tareas por estado
            userTasks.forEach((task) => {
              if (task.status === "hecho") completedTasks++;
              else if (task.status === "en-proceso") inProgressTasks++;
              else if (task.status === "por-hacer") todoTasks++;
              else if (task.status === "por-verificar") toVerifyTasks++;
            });
          }
        } catch (error) {
          console.error(
            `Error al obtener tareas del proyecto ${project.id}:`,
            error
          );
        }
      });

      await Promise.all(tasksPromises);

      // Crear objeto de estadísticas
      const newStats = {
        total: totalTasks,
        completed: completedTasks,
        inProgress: inProgressTasks,
        todoTasks: todoTasks,
        toVerify: toVerifyTasks,
      };

      
      setTasksStats(newStats);
      LocalCache.set(cacheKey, newStats, 300); 
    } catch (error) {
      console.error("Error al obtener estadísticas de tareas:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  // Calcular porcentajes para las tarjetas de estadísticas
  const completionRate =
    tasksStats.total > 0
      ? Math.round((tasksStats.completed / tasksStats.total) * 100)
      : 0;

  const inProgressRate =
    tasksStats.total > 0
      ? Math.round((tasksStats.inProgress / tasksStats.total) * 100)
      : 0;
  const statCardsData = [
    {
      title: "Mis tareas pendientes",
      value: tasksStats.todoTasks.toString(),
      progress:
        tasksStats.total > 0
          ? Math.round((tasksStats.todoTasks / tasksStats.total) * 100)
          : 0,
      icon: SquarePlus,
      iconColor: "text-[#9BC440]",
      progressColor: "bg-[#9BC440]",
    },
    {
      title: "Mi tasa de completadas",
      value: `${completionRate}%`,
      progress: completionRate,
      icon: TrendingUp,
      iconColor: "text-[#89CAE7]",
      progressColor: "bg-[#89CAE7]",
    },
    {
      title: "Mis tareas en progreso",
      value: tasksStats.inProgress.toString(),
      progress: inProgressRate,
      icon: SquareCheckBig,
      iconColor: "text-[#FECC0F]",
      progressColor: "bg-[#FECC0F]",
    },
  ];

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
                isActive={true}
                className="flex items-center text-teal-600 font-medium p-2 rounded hover:bg-slate-100 group-data-[collapsible=icon]:justify-center"
              >
                <Box className="w-6 h-6 mr-3 group-data-[collapsible=icon]:mr-0 group-data-[collapsible=icon]:opacity-100 opacity-50" />
                <span className="transition-opacity duration-200 ease-linear font-normal group-data-[collapsible=icon]:opacity-0">
                  Dashboard
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem className="mb-2 group-data-[collapsible=icon]:mb-4">
              <SidebarMenuButton
                tooltip="Proyectos"
                className="flex items-center text-[#2C2C2C] p-2 rounded hover:bg-slate-100 hover:text-teal-600 group-data-[collapsible=icon]:justify-center"
                onMouseEnter={(e) => {
                  const fileIcon = e.currentTarget.querySelector(".file-icon");
                  if (fileIcon) fileIcon.classList.remove("opacity-50");
                }}
                onMouseLeave={(e) => {
                  const fileIcon = e.currentTarget.querySelector(".file-icon");
                  if (fileIcon) fileIcon.classList.add("opacity-50");
                }}
                onClick={() => navigate("/projects")}
              >
                <FileText className="file-icon w-6 h-6 mr-3 text-[#2C8780] group-data-[collapsible=icon]:mr-0 group-data-[collapsible=icon]:opacity-100 opacity-50" />
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
        {/* DESDE AQUI INICIA EL CONTENIDO PRINCIPAL */}
        {/* Main Content */}
        <MainContent>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full overflow-y-auto">
            
            <div className="lg:col-span-8 space-y-6">
              {/* Welcome Header */}
              <div className="bg-white p-6 rounded-[14px] relative">
                <div className="flex justify-between items-center">
                  <div
                    className="flex flex-col justify-center items-start"
                    style={{ height: "169px" }}
                  >
                    <h1
                      className="text-3xl font-bol text-[#0C0B0B] font-poppins text-left"
                      style={{ width: "auto", height: "54.72px" }}
                    >
                      Hola{" "}
                      {
                        (user?.username || user?.displayName || "Juanes").split(
                          " "
                        )[0]
                      }{" "}
                      !
                    </h1>
                    <p
                      className="line-clamp-3 md:line-clamp-4 text-[#5A5A5A] font-poppins font-normal leading-6 text-left"
                      style={{ width: "212.80px", height: "27.36px" }}
                    >
                      Me alegro de volver a verte.
                    </p>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="h-[169.32px]">
                      <img
                        src="../public/assets/img/Vector.svg"
                        alt="Patrón geométrico decorativo"
                        className="h-full w-auto object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Statistics Section */}
              <div className="flex flex-wrap justify-between">
                {statCardsData.map((data, index) => (
                  <StatCard
                    key={index}
                    title={data.title}
                    value={data.value}
                    progress={data.progress}
                    icon={data.icon}
                    iconColor={data.iconColor}
                    progressColor={data.progressColor}
                  />
                ))}
              </div>{" "}
              {/* Radar Chart */}
              <div className="w-full">
                <Suspense fallback={<RadarChartSkeleton />}>
                  <div className="fade-in">
                    <RadarChart />
                  </div>
                </Suspense>
              </div>
            </div>

            {/* Second Column - 4/12 width on large screens */}
            <div className="lg:col-span-4 space-y-1">
              {/* Create Task Card */}
              <div>
                <Suspense fallback={<CreateTaskCardSkeleton />}>
                  <div className="fade-in">
                    <CreateTaskCard onClick={handleCreateTask} />
                  </div>
                </Suspense>
              </div>
              {/* Calendar Card */}
              <div>
                <Suspense fallback={<CalendarCardSkeleton />}>
                  <div className="fade-in">
                    <CalendarCard date={date} setDate={setDate} />
                  </div>
                </Suspense>
              </div>
              {/* Timeline */}
              <div className="h-[200px] overflow-y-auto pr-2">
                <h3 className="text-lg font-medium mb-2">
                  Mis tareas recientes
                </h3>
                <Suspense fallback={<TimelineSkeleton />}>
                  <div className="fade-in">
                    <Timeline />
                  </div>
                </Suspense>
              </div>
            </div>
          </div>
        </MainContent>{" "}
      </SidebarProvider>
      {/* Modal de selección de proyecto */}
      {isProjectSelectionOpen && (
        <div className="fixed inset-0 bg-[#000000c6] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              Selecciona un proyecto
            </h2>

            {loadingProjects ? (
              <p className="text-center py-4">Cargando proyectos...</p>
            ) : projects.length === 0 ? (
              <div className="text-center py-4">
                <p className="mb-4">No tienes proyectos creados</p>
                <button
                  onClick={() => navigate("/projects")}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Crear proyecto
                </button>
              </div>
            ) : (
              <div className="max-h-60 overflow-auto">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="border rounded p-3 mb-2 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleSelectProject(project)}
                  >
                    <h3 className="font-medium">{project.title}</h3>
                    {project.description && (
                      <p className="text-sm text-gray-600 truncate">
                        {project.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsProjectSelectionOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}{" "}
      {/* Modal para crear tarea */}
      {isTaskModalOpen && (
        <Suspense fallback={<ModalSkeleton />}>
          <CreateTaskModal
            isOpen={isTaskModalOpen}
            onClose={() => {
              setIsTaskModalOpen(false);
              setSelectedProject(null);
            }}
            onSave={handleSaveTask}
            initialStatus={modalInitialStatus}
            isSaving={savingTask}
            taskToEdit={null}
            projectMembers={projectMembers}
            currentUser={user}
          />
        </Suspense>
      )}
    </div>
  );
};

export default DashboardPage;
