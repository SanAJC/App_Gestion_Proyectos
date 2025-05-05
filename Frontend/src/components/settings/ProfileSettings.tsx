import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  UserCircle2,
  Camera,
  Lock,
  Mail,
  User,
  AlertCircle,
} from "lucide-react";
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { logout } from '@/store/slices/authSlice';

const ProfileSettings = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Datos actualizados:', formData);
  };

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

  return (
    <div className="bg-[#f2f2f2] min-h-screen flex flex-col">
      <SidebarProvider className="flex flex-1">
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
                className="flex items-center text-[#2C2C2C] p-2 rounded hover:bg-slate-100 hover:text-teal-600 group-data-[collapsible=icon]:justify-center"
                onClick={() => navigate("/projects")}
              >
                <FileText className="w-6 h-6 mr-3 text-[#2C8780] group-data-[collapsible=icon]:mr-0" />
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
                className="flex items-center text-[#2C2C2C] p-2 rounded hover:bg-slate-100 hover:text-teal-600 group-data-[collapsible=icon]:justify-center"
              >
                <Bell className="w-6 h-6 mr-3 text-[#2C8780] group-data-[collapsible=icon]:mr-0" />
                <span className="transition-opacity duration-200 ease-linear font-normal group-data-[collapsible=icon]:opacity-0">
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
                isActive={true}
                className="flex items-center text-teal-600 font-medium p-2 rounded hover:bg-slate-100 group-data-[collapsible=icon]:justify-center"
              >
                <Settings className="w-6 h-6 mr-3 group-data-[collapsible=icon]:mr-0" />
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

        <header className="p-4 md:hidden">
          <SidebarTrigger />
        </header>

        <MainContent>
          <div className="flex items-center mb-6">
            <UserCircle2 className="text-teal-600 mr-2" size={24} />
            <h1 className="text-2xl font-semibold text-gray-800">Configuración de Perfil</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1200px] mx-auto">
            <div className="lg:col-span-8 space-y-6">
              <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-teal-600" />
                    <CardTitle>Información Personal</CardTitle>
                  </div>
                  <CardDescription>
                    Actualiza tu información personal y foto de perfil
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative group">
                        <Avatar className="h-32 w-32 ring-4 ring-white shadow-lg">
                          <img
                            src="https://ui-avatars.com/api/?name=Juanes+Coronell&size=128"
                            alt="Avatar"
                            className="h-32 w-32 object-cover"
                          />
                        </Avatar>
                        <button
                          type="button"
                          className="absolute bottom-0 right-0 p-2 bg-teal-600 rounded-full text-white shadow-lg hover:bg-teal-700 transition-colors group-hover:scale-110 duration-200"
                        >
                          <Camera className="h-5 w-5" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-500">
                        Click en el ícono de cámara para cambiar tu foto
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                          <User className="h-4 w-4 text-teal-600" />
                          <span>Nombre completo</span>
                        </label>
                        <Input
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          className="bg-[#F8F9FA] border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                          placeholder="Tu nombre"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                          <Mail className="h-4 w-4 text-teal-600" />
                          <span>Correo electrónico</span>
                        </label>
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="bg-[#F8F9FA] border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                          placeholder="tu@email.com"
                        />
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Lock className="h-5 w-5 text-teal-600" />
                    <CardTitle>Seguridad</CardTitle>
                  </div>
                  <CardDescription>
                    Gestiona tu contraseña y la seguridad de tu cuenta
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                          <Lock className="h-4 w-4 text-teal-600" />
                          <span>Contraseña actual</span>
                        </label>
                        <Input
                          name="currentPassword"
                          type="password"
                          value={formData.currentPassword}
                          onChange={handleChange}
                          className="bg-[#F8F9FA] border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                          placeholder="••••••••"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                          <Lock className="h-4 w-4 text-teal-600" />
                          <span>Nueva contraseña</span>
                        </label>
                        <Input
                          name="newPassword"
                          type="password"
                          value={formData.newPassword}
                          onChange={handleChange}
                          className="bg-[#F8F9FA] border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="text-lg">Acciones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white transition-colors duration-200"
                    onClick={handleSubmit}
                  >
                    Guardar cambios
                  </Button>

                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-yellow-800">Importante</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          Al cambiar tu correo electrónico, necesitarás verificar tu nueva dirección.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="text-lg">Sesiones activas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span className="text-sm text-gray-600">Sesión actual</span>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Activa
                      </Badge>
                    </div>
                    <Button 
                      variant="outline"
                      className="w-full text-red-600 border-red-200 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      Cerrar todas las sesiones
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </MainContent>
      </SidebarProvider>
    </div>
  );
};

export default ProfileSettings;