"use client";

import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
interface PrivateRoomSelectorProps {
  value: boolean;
  password: string;
  onPrivateChange: (value: boolean) => void;
  onPasswordChange: (value: string) => void;
  onPasswordBlur?: () => void;
  passwordError?: string;
}

export default function PrivateRoomSelector({
  value,
  password,
  onPrivateChange,
  onPasswordChange,
  onPasswordBlur,
  passwordError,
}: PrivateRoomSelectorProps) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div>
      <label className="block mb-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
        비밀방 여부
      </label>
      <RadioGroup
        value={value ? "true" : "false"}
        onValueChange={(val) => onPrivateChange(val === "true")}
        className="flex gap-4 mb-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="false" id="private-no" />
          <label htmlFor="private-no" className="text-sm">
            미사용
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="true" id="private-yes" />
          <label htmlFor="private-yes" className="text-sm">
            사용
          </label>
        </div>
      </RadioGroup>
      {value && (
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="숫자 6자리를 입력 해주세요."
            inputMode="numeric"
            pattern="\d*"
            maxLength={6}
            value={password}
            onChange={(e) => {
              // 숫자가 아닌 문자는 모두 제거
              const onlyNums = e.target.value.replace(/\D/g, "");
              onPasswordChange(onlyNums);
            }}
            onBlur={onPasswordBlur}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Toggle password visibility"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
          {passwordError && (
            <p className="text-xs text-red-500 mt-1">{passwordError}</p>
          )}
        </div>
      )}
    </div>
  );
}
