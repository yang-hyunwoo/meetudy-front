"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InquiryCategorySelectProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

export default function InquiryCategorySelect({
  value,
  onChange,
}: InquiryCategorySelectProps) {
  return (
    <Select
      key={value ?? "default"}
      value={value === null ? undefined : value} // ✅ 핵심
      onValueChange={(val: string) => onChange(val === "" ? null : val)}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="문의 유형을 선택해주세요" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ATTENDANCE">출석</SelectItem>
        <SelectItem value="ASSIGNMENT">과제</SelectItem>
        <SelectItem value="ACCOUNT">계정</SelectItem>
        <SelectItem value="SERVICE">서비스</SelectItem>
      </SelectContent>
    </Select>
  );
}
