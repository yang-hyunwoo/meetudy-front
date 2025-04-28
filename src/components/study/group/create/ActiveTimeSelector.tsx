"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface ActiveTimeSelectorProps {
  activeHour: string;
  activeMinute: string;
  onHourChange: (hour: string) => void;
  onMinuteChange: (minute: string) => void;
}

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const minutes = ["00", "10", "20", "30", "40", "50"];

export default function ActiveTimeSelector({
  activeHour,
  activeMinute,
  onHourChange,
  onMinuteChange,
}: ActiveTimeSelectorProps) {
  return (
    <div className="flex gap-4">
      <Select value={activeHour} onValueChange={onHourChange}>
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

      <Select value={activeMinute} onValueChange={onMinuteChange}>
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
  );
}
