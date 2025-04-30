import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  Bell,
  Settings,
  CheckCircle,
  ChevronRight,
  FileText,
  Box,
  EllipsisVertical,
  BarChart2,
  MessageSquare,
  BarChart,
} from "lucide-react";

// Import custom dashboard components
import StatCard from "@/components/dashboard/StatCard";
import RadarChart from "@/components/dashboard/RadarChart";
import CalendarCard from "@/components/dashboard/CalendarCard";
import CreateTaskCard from "@/components/dashboard/CreateTaskCard";
import Timeline from "@/components/dashboard/Timeline";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date("2021-04-11"));
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const statCardsData = [
    {
      title: "Lead coversation",
      value: "1,908",
      progress: 58,
      icon: MessageSquare,
      iconColor: "text-green-500",
      progressColor: "bg-green-500",
    },
    {
      title: "Lead coversation",
      value: "58.98%",
      progress: 58,
      icon: BarChart2,
      iconColor: "text-blue-400",
      progressColor: "bg-blue-400",
    },
    {
      title: "Lead coversation",
      value: "1,576",
      progress: 58,
      icon: BarChart,
      iconColor: "text-yellow-400",
      progressColor: "bg-yellow-400",
    },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar Provider */}
      <SidebarProvider>
        {/* Sidebar */}
        <Sidebar className="relative border-r bg-slate-50 border-slate-200 w-auto">
          <SidebarHeader className="p-4 flex justify-between">
            <div className="text-teal-600 font-bold text-2xl flex items-center">
              <svg
                viewBox="0 0 24 24"
                className="w-8 h-8 mr-3"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
              <span className="md:hidden lg:inline">CoAAP</span>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-4 mt-4">
            <div className="relative mb-6">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
                size={18}
              />
              <Input
                placeholder="Buscar"
                className="pl-10 bg-[#2C8780] border-none text-white placeholder-white focus:ring-0 focus:outline-none"
              />
            </div>

            <SidebarMenuItem className="mb-2">
              <a
                href="#"
                className="flex items-center text-teal-600 font-medium p-2 rounded hover:bg-slate-100"
              >
                <Box className="w-6 h-6 mr-3" />
                <span className="md:hidden lg:inline font-semibold">
                  Dashboard
                </span>
              </a>
            </SidebarMenuItem>

            <SidebarMenuItem className="mb-2">
              <a
                href="#"
                className="flex items-center text-[#2C2C2C] p-2 rounded hover:bg-slate-100 hover:text-teal-600"
                onMouseEnter={(e) => {
                  const fileIcon = e.currentTarget.querySelector(".file-icon");
                  if (fileIcon) {
                    fileIcon.classList.remove("opacity-50");
                  }
                }}
                onMouseLeave={(e) => {
                  const fileIcon = e.currentTarget.querySelector(".file-icon");
                  if (fileIcon) {
                    fileIcon.classList.add("opacity-50");
                  }
                }}
              >
                <FileText className="file-icon w-6 h-6 mr-3 text-[#2C8780] opacity-50" />
                <span className="md:hidden lg:inline font-semibold">
                  Proyectos
                </span>
              </a>
            </SidebarMenuItem>
          </SidebarContent>

          <SidebarFooter className="mt-auto p-4">
            <SidebarMenuItem className="mb-4">
              <a
                href="#"
                className="flex items-center text-slate-600 p-2 rounded hover:bg-slate-100 hover:text-teal-600"
                onMouseEnter={(e) => {
                  const Bellicon = e.currentTarget.querySelector(".Bell-icon");
                  if (Bellicon) {
                    Bellicon.classList.remove("opacity-50");
                  }
                }}
                onMouseLeave={(e) => {
                  const Bellicon = e.currentTarget.querySelector(".Bell-icon");
                  if (Bellicon) {
                    Bellicon.classList.add("opacity-50");
                  }
                }}
              >
                <Bell className="Bell-icon w-6 h-6 mr-3 text-[#2C8780] " />
                <span className="md:hidden text-[#2C2C2C] lg:inline font-semibold">
                  Notificaciones
                </span>
                <div className="relative ml-2">
                  <div className="absolute inset-0 bg-[#2C8780] opacity-50 rounded"></div>
                  <Badge
                    className="relative text-[#2C2C2C] bg-transparent"
                    variant="default"
                  >
                    12
                  </Badge>
                </div>
              </a>
            </SidebarMenuItem>

            <SidebarMenuItem className="mb-6">
              <a
                href="#"
                className="flex items-center text-[#2C2C2C] p-2 rounded hover:bg-slate-100 hover:text-teal-600"
                onMouseEnter={(e) => {
                  const Settingsicon =
                    e.currentTarget.querySelector(".Settings-icon");
                  if (Settingsicon) {
                    Settingsicon.classList.remove("opacity-50");
                  }
                }}
                onMouseLeave={(e) => {
                  const Settingsicon =
                    e.currentTarget.querySelector(".Settings-icon");
                  if (Settingsicon) {
                    Settingsicon.classList.add("opacity-50");
                  }
                }}
              >
                <Settings className="Settings-icon w-6 h-6 mr-3 text-[#2C8780] opacity-50" />
                <span className="md:hidden lg:inline font-semibold">
                  Configuración
                </span>
              </a>
            </SidebarMenuItem>

            <Separator className="my-4" />

            <div className="flex items-center bg-[#4EADA1] rounded-lg p-3">
              <Avatar className="h-10 w-10 mr-3">
                <img
                  src="https://ui-avatars.com/api/?name=Juanes+Coronell"
                  alt="Avatar"
                />
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-white">Juanes Coronell</p>
                <p className="text-xs text-white/70">Juanes@gmail.com</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-[#57B8A5]"
                  >
                    <EllipsisVertical className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={handleLogout}>
                    Cerrar sesión
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-slate-400"
                    >
                      <path d="M12 15l3-3m0 0l-3-3m3 3H4m5-4.751V7.2c0-1.12 0-1.68.218-2.108.192-.377.497-.682.874-.874C10.52 4 11.08 4 12.2 4h3.6c1.12 0 1.68 0 2.107.218.377.192.683.497.875.874.218.427.218.987.218 2.108v9.6c0 1.12 0 1.68-.218 2.108-.192.377-.498.682-.875.874-.427.218-.987.218-2.107.218h-3.6c-1.12 0-1.68 0-2.108-.218-.377-.192-.682-.497-.874-.874-.218-.428-.218-.987-.218-2.108v-.049" />
                    </svg>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SidebarFooter>
          {/* Sidebar Trigger for mobile */}
          <SidebarTrigger className="absolute top-4 right-0 translate-x-full z-20" />
        </Sidebar>
      </SidebarProvider>

      {/* Main Content */}
      <div className="flex-1 overflow-auto mx-4">
        {/* Welcome Header */}
        <div className="bg-white p-6 border-b w-[597px] border-slate-200 rounded-[14px] relative mx-auto">
          <div className="flex justify-between items-center">
            <div
              className="flex flex-col justify-center items-start"
              style={{ height: "169px" }}
            >
              <h1
                className="text-[2.19rem] font-medium text-[#0C0B0B] font-poppins text-left"
                style={{ width: "210.88px", height: "54.72px" }}
              >
                Hola Juanes !
              </h1>
              <p
                className="text-[12px] text-[#5A5A5A] font-poppins font-normal leading-6 text-left"
                style={{ width: "212.80px", height: "27.36px" }}
              >
                Me alegro de volver a verte.
              </p>
            </div>

            <div className="flex items-center justify-center">
              {/* Utilizando la imagen para los vectores */}
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

        <div className="max-w-6xl mx-auto p-4 md:p-6">
          {/* Statistics Section */}
          <div className="flex flex-wrap justify-start items-center gap-[25px] mb-6">
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Chart */}
            <div className="lg:col-span-8">
              <RadarChart />
            </div>

            {/* Calendar Section */}
            <div className="lg:col-span-4 space-y-6">
              <CalendarCard date={date} setDate={setDate} />
              <CreateTaskCard />
            </div>
          </div>

          {/* Timeline */}
          <div className="mt-6">
            <Timeline />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
