"use client";

import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface LateFeeSelectorProps {
  value: boolean;
  amount: string;
  onLateFeeChange: (value: boolean) => void;
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
        value={value ? "true" : "false"}
        onValueChange={(val) => onLateFeeChange(val === "true")}
        className="flex gap-4 mb-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="false" id="late-no" />
          <label htmlFor="late-no" className="text-sm">
            미사용
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="true" id="late-yes" />
          <label htmlFor="late-yes" className="text-sm">
            사용
          </label>
        </div>
      </RadioGroup>

      {value && (
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
