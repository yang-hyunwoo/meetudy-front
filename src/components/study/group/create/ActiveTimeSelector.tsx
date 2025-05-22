"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useState } from "react";

interface ActiveTimeSelectorProps {
  activeHour: string;
  activeMinute: string;
  onHourChange: (hour: string) => void;
  onMinuteChange: (minute: string) => void;
  showError?: boolean;
}

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const minutes = ["00", "10", "20", "30", "40", "50"];

export default function ActiveTimeSelector({
  activeHour,
  activeMinute,
  onHourChange,
  onMinuteChange,
  showError = false,
}: ActiveTimeSelectorProps) {
  const [hourTouched, setHourTouched] = useState(false);
  const [minuteTouched, setMinuteTouched] = useState(false);

  const shouldShowError =
    showError ||
    ((hourTouched || minuteTouched) && (!activeHour || !activeMinute));

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-4">
        <Select
          value={activeHour}
          onValueChange={(val) => {
            onHourChange(val);
            setHourTouched(true);
          }}
          onOpenChange={(open) => {
            if (!open) setHourTouched(true);
          }}
        >
          <SelectTrigger className="w-24">
            <SelectValue placeholder="시" />
          </SelectTrigger>
          <SelectContent>
            {hours.map((h) => (
              <SelectItem key={h} value={h}>
                {h}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={activeMinute}
          onValueChange={(val) => {
            onMinuteChange(val);
            setMinuteTouched(true);
          }}
          onOpenChange={(open) => {
            if (!open) setMinuteTouched(true);
          }}
        >
          <SelectTrigger className="w-24">
            <SelectValue placeholder="분" />
          </SelectTrigger>
          <SelectContent>
            {minutes.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 에러 메시지 영역 */}
      <div className="h-5">
        {shouldShowError && (
          <span className="text-sm text-red-500">시간을 모두 선택하세요</span>
        )}
      </div>
    </div>
  );
}
