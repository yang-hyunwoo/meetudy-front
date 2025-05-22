"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface JoinTypeSelectorProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export default function JoinTypeSelector({
  value,
  onChange,
}: JoinTypeSelectorProps) {
  return (
    <div>
      <label className="block mb-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
        가입 방식
      </label>
      <RadioGroup
        value={value ? "true" : "false"} // 문자열로 넣되
        onValueChange={(val) => onChange(val === "true")} // boolean으로 변환해서 반환
        className="flex gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="false" id="join-free" />
          <label htmlFor="join-free" className="text-sm">
            자유가입
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="true" id="join-approval" />
          <label htmlFor="join-approval" className="text-sm">
            승인가입
          </label>
        </div>
      </RadioGroup>
    </div>
  );
}
