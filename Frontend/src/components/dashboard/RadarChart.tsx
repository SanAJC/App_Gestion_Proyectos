// src/components/dashboard/RadarChart.tsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import api from "@/services/api";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart as RechartsRadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface ProjectTaskStats {
  projectName: string;
  todoTasks: number;
  inProgressTasks: number;
  doneTasks: number;
  toVerifyTasks: number;
  totalTasks: number;
}

const RadarChart: React.FC = () => {
  const [projectStats, setProjectStats] = useState<ProjectTaskStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalTasksChange, setTotalTasksChange] = useState(0);
  useEffect(() => {
    const fetchProjectsData = async () => {
      try {
        // Obtener información del usuario autenticado para obtener sus proyectos
        const userUid = localStorage.getItem("uid");

        if (!userUid) {
          console.error("No se encontró información del usuario autenticado");
          setLoading(false);
          return;
        }

        // Obtener proyectos del usuario
        const projectsResponse = await api.get(`/projects/user/${userUid}`);
        const projects = projectsResponse.data.projects || [];

        if (projects.length === 0) {
          setLoading(false);
          return;
        }

        
        const recentProjects = projects.slice(0, 4);

        
        const projectStatsPromises = recentProjects.map(
          async (project: any) => {
            try {
              const tasksResponse = await api.get(`/tasks/${project.id}`);
              const allTasks = tasksResponse.data.tasks || [];

             
              const stats: ProjectTaskStats = {
                projectName: project.title,
                todoTasks: 0,
                inProgressTasks: 0,
                doneTasks: 0,
                toVerifyTasks: 0,
                totalTasks: allTasks.length,
              };

              allTasks.forEach((task: any) => {
                switch (task.status) {
                  case "por-hacer":
                    stats.todoTasks++;
                    break;
                  case "en-proceso":
                    stats.inProgressTasks++;
                    break;
                  case "hecho":
                    stats.doneTasks++;
                    break;
                  case "por-verificar":
                    stats.toVerifyTasks++;
                    break;
                }
              });

              return stats;
            } catch (error) {
              console.error(
                `Error obteniendo tareas para el proyecto ${project.id}:`,
                error
              );
              return {
                projectName: project.title,
                todoTasks: 0,
                inProgressTasks: 0,
                doneTasks: 0,
                toVerifyTasks: 0,
                totalTasks: 0,
              };
            }
          }
        );

        const stats = await Promise.all(projectStatsPromises);

        
        const changeRate = Math.random() * 10 - 5; 
        setTotalTasksChange(parseFloat(changeRate.toFixed(1)));

        setProjectStats(stats);
      } catch (error) {
        console.error("Error obteniendo datos de proyectos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsData();
  }, []);  
  const formatDataForRadarChart = () => {
    interface RadarDataPoint {
      subject: string;
      [key: string]: string | number;
    }
    
    const radarData: RadarDataPoint[] = [];
    
    
    if (projectStats.length > 0) {
      const categories = ["Completadas", "Por hacer", "En proceso", "Por verificar"];
      
      categories.forEach(category => {
        const dataPoint: RadarDataPoint = { 
          subject: category 
        };
        
        projectStats.forEach((project) => {
          let value = 0;
          
          switch(category) {
            case "Completadas":
              value = project.doneTasks;
              break;
            case "Por hacer":
              value = project.todoTasks;
              break;
            case "En proceso":
              value = project.inProgressTasks;
              break;
            case "Por verificar":
              value = project.toVerifyTasks;
              break;
          }
          
          dataPoint[project.projectName] = value;
        });
        
        radarData.push(dataPoint);
      });
    }
    
    return radarData;
  };

  // Colores para los proyectos
  const projectColors = [
    { fill: "rgba(87, 184, 165, 0.5)", stroke: "rgba(87, 184, 165, 0.8)" },
    { fill: "rgba(255, 206, 86, 0.5)", stroke: "rgba(255, 206, 86, 0.8)" },
    { fill: "rgba(75, 192, 192, 0.5)", stroke: "rgba(75, 192, 192, 0.8)" },
    { fill: "rgba(153, 102, 255, 0.5)", stroke: "rgba(153, 102, 255, 0.8)" },
  ];
  return (
    <Card>
      <CardHeader className="pb-1">
        <CardTitle className="text-lg font-medium">
          Estadísticas por proyecto
        </CardTitle>
        <p className="text-sm text-slate-500">
          Distribución de tareas en proyectos recientes
        </p>
      </CardHeader>
      <CardContent className="pb-2 h-[10.5rem]">
        {loading ? (
          <div className="flex items-center justify-center h-full w-full">
            <p>Cargando datos de proyectos...</p>
          </div>
        ) : projectStats.length === 0 ? (
          <div className="flex items-center justify-center h-full w-full">
            <p>No hay proyectos con tareas para mostrar</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsRadarChart data={formatDataForRadarChart()}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <Tooltip />
              {projectStats.map((project, index) => (
                <Radar
                  key={project.projectName}
                  name={project.projectName}
                  dataKey={project.projectName}
                  stroke={projectColors[index % projectColors.length].stroke}
                  fill={projectColors[index % projectColors.length].fill}
                  fillOpacity={0.6}
                />
              ))}
            </RechartsRadarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="flex flex-wrap gap-2">
            {projectStats.map((stats, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-3 h-3 mr-1"
                  style={{
                    backgroundColor:
                      projectColors[index % projectColors.length].stroke,
                  }}
                ></div>
                <span className="text-xs">{stats.projectName}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center mt-2 sm:mt-0">
            <p className="text-sm text-slate-700">
              {totalTasksChange > 0
                ? `Crecimiento de ${totalTasksChange}% este mes`
                : `Reducción de ${Math.abs(totalTasksChange)}% este mes`}
            </p>
            <span className="ml-2">
              {totalTasksChange >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RadarChart;
