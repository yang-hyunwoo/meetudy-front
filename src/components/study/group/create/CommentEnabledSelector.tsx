"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface CommentEnabledSelectorProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export default function CommentEnabledSelector({
  value,
  onChange,
}: CommentEnabledSelectorProps) {
  return (
    <div>
      <label className="block mb-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
        댓글 여부
      </label>
      <RadioGroup
        value={value ? "true" : "false"}
        onValueChange={(val) => onChange(val === "true")}
        className="flex gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="false" id="comment-no" />
          <label htmlFor="comment-no" className="text-sm">
            미사용
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="true" id="comment-yes" />
          <label htmlFor="comment-yes" className="text-sm">
            사용
          </label>
        </div>
      </RadioGroup>
    </div>
  );
}
