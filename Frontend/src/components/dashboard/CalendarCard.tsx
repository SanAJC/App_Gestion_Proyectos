// src/components/dashboard/CalendarCard.tsx
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarCardProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

const CalendarCard: React.FC<CalendarCardProps> = ({ date, setDate }) => {
  const formattedDate = date
    ? new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(date)
    : "";

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">{formattedDate}</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-lg font-medium">Today</p>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="mx-auto"
            classNames={{
              day_today: "bg-teal-600 text-white hover:bg-teal-700",
              day_selected: "bg-teal-600 text-white hover:bg-teal-700",
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarCard;
