"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InquiryCategorySelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function InquiryCategorySelect({
  value,
  onChange,
}: InquiryCategorySelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="문의 유형을 선택해주세요" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="관리">관리</SelectItem>
        <SelectItem value="스터디">스터디</SelectItem>
        <SelectItem value="계정">계정</SelectItem>
      </SelectContent>
    </Select>
  );
}
