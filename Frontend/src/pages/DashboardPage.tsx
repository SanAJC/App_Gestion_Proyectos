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
  TrendingUp,
  SquarePlus,
  SquareCheckBig,
} from "lucide-react";

// Import custom dashboard components
import StatCard from "@/components/dashboard/StatCard";
import RadarChart from "@/components/dashboard/RadarChart";
import CalendarCard from "@/components/dashboard/CalendarCard";
import CreateTaskCard from "@/components/dashboard/CreateTaskCard";
import Timeline from "@/components/dashboard/Timeline";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

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

  const statCardsData = [
    {
      title: "Lead coversation",
      value: "1,908",
      progress: 58,
      icon: SquarePlus,
      iconColor: "text-[#9BC440]",
      progressColor: "bg-[#9BC440]",
    },
    {
      title: "Lead coversation",
      value: "58.98%",
      progress: 58,
      icon: TrendingUp,
      iconColor: "text-[#89CAE7]",
      progressColor: "bg-[#89CAE7]",
    },
    {
      title: "Lead coversation",
      value: "1,576",
      progress: 65,
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
                <span className="transition-opacity duration-200 ease-linear font-semibold group-data-[collapsible=icon]:opacity-0">
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
                <span className="transition-opacity duration-200 ease-linear font-semibold group-data-[collapsible=icon]:opacity-0">
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
                <span className="text-[#2C2C2C] transition-opacity duration-200 ease-linear font-semibold group-data-[collapsible=icon]:opacity-0">
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
              >
                <Settings className="Settings-icon w-6 h-6 mr-3 text-[#2C8780] group-data-[collapsible=icon]:mr-0 group-data-[collapsible=icon]:opacity-100 opacity-50" />
                <span className="transition-opacity duration-200 ease-linear font-semibold group-data-[collapsible=icon]:opacity-0">
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

        {/* DESDE AQUI INICIA EL CONTENIDO PRINCIPAL */}

        {/* Main Content */}
        <MainContent>
          {/* Main two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full overflow-y-auto">
            {/* First Column - 8/12 width on large screens */}
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
                      style={{ width: "210.88px", height: "54.72px" }}
                    >
                      Hola {user?.username?.split(" ")[0] || "Juanes"} !
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
              </div>

              {/* Radar Chart */}
              <div className="w-full">
                <RadarChart />
              </div>
            </div>

            {/* Second Column - 4/12 width on large screens */}
            <div className="lg:col-span-4 space-y-1">
              {/* Create Task Card */}
              <div>
                <CreateTaskCard
                  onClick={() => {
                    console.log("Crear nueva tarea");
                  }}
                />
              </div>

              {/* Calendar Card */}
              <div>
                <CalendarCard date={date} setDate={setDate} />
              </div>

              {/* Timeline */}
              <div className="h-[200px] overflow-y-auto pr-2">
                <Timeline />
              </div>
            </div>
          </div>
        </MainContent>
      </SidebarProvider>
    </div>
  );
};

export default DashboardPage;
