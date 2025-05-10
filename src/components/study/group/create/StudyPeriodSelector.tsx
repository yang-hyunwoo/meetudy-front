"use client";

import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StudyPeriodSelectorProps {
  startDate?: Date;
  endDate?: Date;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
}

export default function StudyPeriodSelector({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: StudyPeriodSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100">
        스터디 기간
      </label>

      <div className="flex items-center gap-4">
        {/* 시작일 선택 */}
        <DatePickerButton
          label="시작일 선택"
          date={startDate}
          onSelect={onStartDateChange}
        />

        <span className="text-gray-400">~</span>

        {/* 종료일 선택 */}
        <DatePickerButton
          label="종료일 선택"
          date={endDate}
          onSelect={onEndDateChange}
        />
      </div>
    </div>
  );
}

interface DatePickerButtonProps {
  label: string;
  date?: Date;
  onSelect: (date: Date | undefined) => void;
}

function DatePickerButton({ label, date, onSelect }: DatePickerButtonProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[160px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          {date ? format(date, "yyyy-MM-dd") : label}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
