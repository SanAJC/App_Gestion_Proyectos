import React, { useState } from "react";
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
  Bell,
  Settings,
  FileText,
  Box,
  ChevronLeft,
  Clock,
} from "lucide-react";

// Definimos el tipo de proyecto
interface Project {
  id: string;
  title: string;
  image: string;
  type: string;
}

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  // Estado para los proyectos
  const [projects] = useState<Project[]>([
    {
      id: "1",
      title: "Desarrollo APP mobil",
      image:
        "https://www.visual-planning.com/es/wp-content/uploads/2020/11/Cuales-son-las-caracteristicas-imprescindibles-de-un-software-de-gestion-de-proyectos-Visual-Planning.jpg",
      type: "mobile",
    },
    {
      id: "2",
      title: "Diseño UI",
      image:
        "https://3530961.fs1.hubspotusercontent-na1.net/hub/3530961/hubfs/Blog_Pensemos_707x282px_8.jpg?width=800&height=346&name=Blog_Pensemos_707x282px_8.jpg",
      type: "design",
    },
    {
      id: "3",
      title: "Desarrollo web",
      image:
        "https://gestiondeproyectos340245913.wordpress.com/wp-content/uploads/2021/05/promo-image.1547668953.png?w=750",
      type: "web",
    },
    {
      id: "4",
      title: "Sistema de diseño",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSub_8WUp5xKfX9h8fwCUcQvp1GOXCoUyA0XnESEUu0sf-0a4kOvMm1lVZwGs8pM23Jd_g&usqp=CAU",
      type: "system",
    },
  ]);

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

  // Componente para la tarjeta de proyecto
  const ProjectCard = ({ project }: { project: Project }) => {
    return (
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="relative">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-32 object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-800">{project.title}</h3>
        </div>
      </div>
    );
  };

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
            <SidebarMenuItem className="mb-4 group-data-[collapsible=icon]:mb-4">
              <SidebarMenuButton
                tooltip="Notificaciones"
                className="flex items-center text-slate-600 p-2 rounded hover:bg-slate-100 hover:text-teal-600 group-data-[collapsible=icon]:justify-center"
                onMouseEnter={(e) => {
                  const bellIcon = e.currentTarget.querySelector(".Bell-icon");
                  if (bellIcon) bellIcon.classList.remove("opacity-50");
                }}
                onMouseLeave={(e) => {
                  const bellIcon = e.currentTarget.querySelector(".Bell-icon");
                  if (bellIcon) bellIcon.classList.add("opacity-50");
                }}
              >
                <Bell className="Bell-icon w-6 h-6 mr-3 text-[#2C8780] group-data-[collapsible=icon]:mr-0 group-data-[collapsible=icon]:opacity-100 opacity-50" />
                <span className="text-[#2C2C2C] transition-opacity duration-200 ease-linear font-normal group-data-[collapsible=icon]:opacity-0">
                  Notificaciones
                </span>
                <div className="relative ml-2 group-data-[collapsible=icon]:hidden">
                  <div className="absolute inset-0 bg-[#2C8780] opacity-50 rounded"></div>
                  <Badge
                    className="relative text-[#2C2C2C] bg-transparent"
                    variant="default"
                  >
                    12
                  </Badge>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem className="mb-6 group-data-[collapsible=icon]:mb-4">
              <SidebarMenuButton
                tooltip="Configuración"
                className="flex items-center text-[#2C2C2C] p-2 rounded hover:bg-slate-100 hover:text-teal-600 group-data-[collapsible=icon]:justify-center"
                onMouseEnter={(e) => {
                  const settingsIcon =
                    e.currentTarget.querySelector(".Settings-icon");
                  if (settingsIcon) settingsIcon.classList.remove("opacity-50");
                }}
                onMouseLeave={(e) => {
                  const settingsIcon =
                    e.currentTarget.querySelector(".Settings-icon");
                  if (settingsIcon) settingsIcon.classList.add("opacity-50");
                }}
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
                        src="https://ui-avatars.com/api/?name=Juanes+Coronell"
                        alt="Avatar"
                      />
                    </Avatar>
                    <div className="flex-1 group-data-[collapsible=icon]:hidden">
                      <p className="font-medium text-white">
                        {user?.username || "Juanes Coronell"}
                      </p>
                      <p className="text-xs text-white/70">
                        {user?.email || "Juanes@gmail.com"}
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
          <div className="flex items-center mb-6">
            <Clock className="text-teal-600 mr-2" size={24} />
            <h1 className="text-2xl font-semibold text-gray-800">Proyectos</h1>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </MainContent>
      </SidebarProvider>
    </div>
  );
};

export default ProjectsPage;
