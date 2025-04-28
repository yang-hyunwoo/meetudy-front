"use client";

import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PrivateRoomSelectorProps {
  value: "yes" | "no";
  password: string;
  onPrivateChange: (value: "yes" | "no") => void;
  onPasswordChange: (value: string) => void;
}

export default function PrivateRoomSelector({
  value,
  password,
  onPrivateChange,
  onPasswordChange,
}: PrivateRoomSelectorProps) {
  return (
    <div>
      <label className="block mb-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
        비밀방 여부
      </label>
      <RadioGroup
        value={value}
        onValueChange={(val: "yes" | "no") => onPrivateChange(val)}
        className="flex gap-4 mb-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="no" id="private-no" />
          <label htmlFor="private-no" className="text-sm">
            미사용
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="yes" id="private-yes" />
          <label htmlFor="private-yes" className="text-sm">
            사용
          </label>
        </div>
      </RadioGroup>

      {value === "yes" && (
        <Input
          type="password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
        />
      )}
    </div>
  );
}
