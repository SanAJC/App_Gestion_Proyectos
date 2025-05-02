// src/components/dashboard/StatCard.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  progress: number;
  icon: LucideIcon;
  iconColor: string;
  progressColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  progress,
  icon: Icon,
  iconColor,
  progressColor,
}) => {
  return (
    <Card className="bg-white rounded-lg shadow-sm border-0 p-4 w-[31.2%]">
      <CardContent className="p-0">
        {/* Header with value, title and icon */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-left text-slate-800">
              {value}
            </span>
            <span className="text-xs text-slate-500">{title}</span>
          </div>
          <div className="w-5 h-5 flex items-center justify-center">
            <Icon className={`w-4 h-4 ${iconColor}`} />
          </div>
        </div>

        {/* Progress bar and percentage */}
        <div className="mt-1">
          <div className="relative h-1.5 bg-slate-100 rounded-full">
            <div
              className={`absolute top-0 left-0 h-1.5 ${progressColor} rounded-full`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-right text-[10px] text-slate-500 mt-1">
            {progress}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
