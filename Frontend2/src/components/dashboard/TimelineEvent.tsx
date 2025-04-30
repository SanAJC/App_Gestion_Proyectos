// src/components/dashboard/TimelineEvent.tsx
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { CheckCircle, X } from "lucide-react";

interface TimelineEventProps {
  title: string;
  time: string;
  description: string;
  users: number[];
  completed?: boolean;
}

const TimelineEvent: React.FC<TimelineEventProps> = ({
  title,
  time,
  description,
  users,
  completed,
}) => {
  return (
    <div className="relative mb-8 mt-4">
      <div className="absolute -left-4 mt-1.5 h-8 w-8 rounded-full border-4 border-white bg-teal-600 flex items-center justify-center">
        <span className="h-2 w-2 rounded-full bg-white"></span>
      </div>
      <Card className="ml-6">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg font-medium">{title}</CardTitle>
              <p className="text-sm text-slate-500">{time}</p>
            </div>
            {completed ? (
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-teal-600 border-teal-200 hover:bg-teal-50"
              >
                <CheckCircle className="h-5 w-5" />
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-slate-600 hover:bg-slate-50"
                >
                  <X className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-teal-600 border-teal-200 hover:bg-teal-50"
                >
                  <CheckCircle className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">{description}</p>
          <div className="flex -space-x-2 mt-4">
            {users.map((i) => (
              <Avatar key={i} className="border-2 border-white">
                <img
                  src={`https://ui-avatars.com/api/?name=User+${i}`}
                  alt={`User ${i}`}
                />
              </Avatar>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimelineEvent;
