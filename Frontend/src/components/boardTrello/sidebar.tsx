import React from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { logout } from "@/store/slices/authSlice";
import {
  Sidebar as UISidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenuItem,
  SidebarMenuButton,
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
} from "lucide-react";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <UISidebar
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
            <span className="transition-opacity duration-200 ease-linear font-semibold group-data-[collapsible=icon]:opacity-0">
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
    </UISidebar>
  );
};

export default Sidebar;
