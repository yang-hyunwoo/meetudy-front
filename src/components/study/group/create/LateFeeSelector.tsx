"use client";

import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface LateFeeSelectorProps {
  value: "yes" | "no";
  amount: string;
  onLateFeeChange: (value: "yes" | "no") => void;
  onAmountChange: (value: string) => void;
}

export default function LateFeeSelector({
  value,
  amount,
  onLateFeeChange,
  onAmountChange,
}: LateFeeSelectorProps) {
  return (
    <div>
      <label className="block mb-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
        지각비 여부
      </label>
      <RadioGroup
        value={value}
        onValueChange={(val: "yes" | "no") => onLateFeeChange(val)}
        className="flex gap-4 mb-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="no" id="late-no" />
          <label htmlFor="late-no" className="text-sm">
            미사용
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="yes" id="late-yes" />
          <label htmlFor="late-yes" className="text-sm">
            사용
          </label>
        </div>
      </RadioGroup>

      {value === "yes" && (
        <Input
          type="number"
          placeholder="지각비 금액 (숫자만)"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          min={0}
        />
      )}
    </div>
  );
}
