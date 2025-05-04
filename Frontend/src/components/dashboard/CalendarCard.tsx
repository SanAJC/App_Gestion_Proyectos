// src/components/dashboard/CalendarCard.tsx
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";

interface CalendarCardProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

const CalendarCard: React.FC<CalendarCardProps> = ({ date, setDate }) => {
  const formattedDate = date
    ? new Intl.DateTimeFormat("es-ES", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(date)
    : "";

  return (
    <Card className="bg-[transparent] shadow-none border-none w-full h-full">
      <CardHeader className="pb-1">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-normal">{formattedDate}</CardTitle>
        </div>
        <p className="text-2xl font-medium text-left">Today</p>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="w-full"
            classNames={{
              day_today:
                "bg-teal-600 text-white hover:bg-teal-700 flex items-center justify-center",
              day_selected:
                "bg-teal-600 text-white hover:bg-teal-700 flex items-center justify-center",
              months: "flex flex-col w-full",
              month: "w-full space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              table: "w-full border-collapse",
              head_row: "flex w-full",
              head_cell:
                "text-muted-foreground w-full font-normal text-[0.8rem]",
              row: "flex w-full mt-2 justify-between",
              cell: "relative p-0 text-center text-sm w-full flex justify-center",
              day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100",
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarCard;
