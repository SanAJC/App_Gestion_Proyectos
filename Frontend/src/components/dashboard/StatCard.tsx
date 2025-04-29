// src/components/dashboard/StatCard.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  progress: number;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  progressColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  progress,
  icon: Icon,
  iconBgColor,
  iconColor,
  progressColor,
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-slate-500">{title}</p>
            <p className="text-2xl font-semibold">{value}</p>
          </div>
          <div
            className={`h-8 w-8 rounded-md flex items-center justify-center ${iconBgColor}`}
          >
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
        </div>
        <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full ${progressColor} rounded-full`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-xs text-slate-500 mt-2 text-right">{progress}%</p>
      </CardContent>
    </Card>
  );
};

export default StatCard;
