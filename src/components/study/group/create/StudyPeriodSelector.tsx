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
import { useState } from "react";

interface StudyPeriodSelectorProps {
  startDate?: Date;
  endDate?: Date;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  showStartError?: boolean;
  showEndError?: boolean;
}
export default function StudyPeriodSelector({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  showStartError,
  showEndError,
}: StudyPeriodSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-800 dark:text-gray-100">
        스터디 기간
      </label>

      <div className="flex items-center gap-4">
        {/* 시작일 선택 */}
        <div className="flex flex-col">
          <DatePickerButton
            label="시작일 선택"
            date={startDate}
            onSelect={onStartDateChange}
            showError={showStartError}
          />
        </div>
        <span
          className="text-gray-400 items-start"
          style={{ marginBottom: "1.5rem" }}
        >
          ~
        </span>
        {/* 종료일 선택 */}
        <div className="flex flex-col">
          <DatePickerButton
            label="종료일 선택"
            date={endDate}
            onSelect={onEndDateChange}
            showError={showEndError}
          />
        </div>
      </div>
    </div>
  );
}

interface DatePickerButtonProps {
  label: string;
  date?: Date;
  onSelect: (date: Date | undefined) => void;
  showError?: boolean;
}

function DatePickerButton({
  label,
  date,
  onSelect,
  showError,
}: DatePickerButtonProps) {
  const [touched, setTouched] = useState(false);
  const shouldShowError = (touched || showError) && !date;
  return (
    <div className="flex flex-col gap-1">
      <Popover
        onOpenChange={(open) => {
          if (!open) setTouched(true);
        }}
      >
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

      {/* 에러 영역: 항상 높이 확보 */}
      <div className="h-5">
        {shouldShowError && (
          <span className="text-sm text-red-500">날짜를 선택하세요</span>
        )}
      </div>
    </div>
  );
}
