"use client";

import { Checkbox } from "@/components/ui/checkbox";

interface WeekdaySelectorProps {
  weekdays: string[];
  toggleWeekday: (day: string) => void;
}

const days = ["월", "화", "수", "목", "금", "토", "일"];

export default function WeekdaySelector({
  weekdays,
  toggleWeekday,
}: WeekdaySelectorProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {days.map((day) => (
        <div key={day} className="flex items-center space-x-2">
          <Checkbox
            id={`day-${day}`}
            checked={weekdays.includes(day)}
            onCheckedChange={() => toggleWeekday(day)}
          />
          <label htmlFor={`day-${day}`} className="text-sm">
            {day}
          </label>
        </div>
      ))}
    </div>
  );
}
