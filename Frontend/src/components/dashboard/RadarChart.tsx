// src/components/dashboard/RadarChart.tsx
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const RadarChart: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-1">
        <CardTitle className="text-lg font-medium">
          Radar Chart - Multiple
        </CardTitle>
        <p className="text-sm text-slate-500">
          Showing total visitors for the last 6 months
        </p>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center justify-center h-40">
          <svg className="w-full max-h-full" viewBox="0 0 400 250">
            <g transform="translate(200, 125)">
              <polygon
                points="0,-100 86.6,-50 86.6,50 0,100 -86.6,50 -86.6,-50"
                fill="none"
                stroke="#ccc"
                strokeWidth="1"
              />
              <polygon
                points="0,-66.7 57.7,-33.3 57.7,33.3 0,66.7 -57.7,33.3 -57.7,-33.3"
                fill="none"
                stroke="#ccc"
                strokeWidth="1"
              />
              <polygon
                points="0,-33.3 28.9,-16.7 28.9,16.7 0,33.3 -28.9,16.7 -28.9,-16.7"
                fill="none"
                stroke="#ccc"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="-100"
                x2="0"
                y2="100"
                stroke="#ccc"
                strokeWidth="1"
              />
              <line
                x1="-86.6"
                y1="-50"
                x2="86.6"
                y2="50"
                stroke="#ccc"
                strokeWidth="1"
              />
              <line
                x1="-86.6"
                y1="50"
                x2="86.6"
                y2="-50"
                stroke="#ccc"
                strokeWidth="1"
              />
              <text
                x="0"
                y="-110"
                textAnchor="middle"
                fontSize="12"
                fill="#666"
              >
                PHP
              </text>
              <text x="0" y="120" textAnchor="middle" fontSize="12" fill="#666">
                CSS
              </text>
              <text x="100" y="0" textAnchor="start" fontSize="12" fill="#666">
                PYTHON
              </text>
              <text x="-130" y="0" textAnchor="end" fontSize="12" fill="#666">
                JAVASCRIPT
              </text>
              <text
                x="55"
                y="-70"
                textAnchor="middle"
                fontSize="12"
                fill="#666"
              >
                June
              </text>
              <text
                x="-55"
                y="70"
                textAnchor="middle"
                fontSize="12"
                fill="#666"
              >
                May
              </text>
              <polygon
                points="0,-80 60,-40 70,30 0,65 -75,35 -65,-45"
                fill="rgba(87, 184, 165, 0.2)"
                stroke="rgba(87, 184, 165, 0.8)"
                strokeWidth="2"
              />
              <polygon
                points="0,-50 40,-25 45,15 0,40 -50,25 -40,-30"
                fill="rgba(255, 206, 86, 0.5)"
                stroke="rgba(255, 206, 86, 0.8)"
                strokeWidth="2"
              />
            </g>
          </svg>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <p className="text-sm text-slate-500">January - June 2024</p>
          <div className="flex items-center mt-2 sm:mt-0">
            <p className="text-sm text-slate-700">
              Trending up by 5.2% this month
            </p>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="ml-2 text-green-600"
            >
              <path d="M7 17l9-9M16 17V8h-9" />
            </svg>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RadarChart;
