"use client";

import { Accordion } from "@/components/ui/accordion";
import { useState } from "react";
import InquiryListItem from "@/components/contact/qna/InquiryListItem";

interface Inquiry {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  status: "답변대기" | "답변완료";
  answeredAt?: string; // 답변완료일 (선택적)
}

const mockInquiries: Inquiry[] = [
  {
    id: "1",
    title: "스터디 등록이 안 돼요",
    content: "스터디 생성 페이지에서 등록 버튼이 비활성화되어 있습니다.",
    category: "스터디",
    createdAt: "2025-04-22",
    status: "답변대기",
  },
  {
    id: "2",
    title: "계정 삭제 방법",
    content: "계정 삭제는 어떻게 하나요?",
    category: "계정",
    createdAt: "2025-04-21",
    status: "답변완료",
    answeredAt: "2025-04-23",
  },
];

export default function InquiryList() {
  const [inquiries] = useState<Inquiry[]>(mockInquiries);

  if (inquiries.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-6">
        아직 등록된 문의 내역이 없습니다.
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      {inquiries.map((item) => (
        <InquiryListItem
          key={item.id}
          id={item.id}
          title={item.title}
          content={item.content}
          category={item.category}
          createdAt={item.createdAt}
          status={item.status}
          answeredAt={item.answeredAt}
        />
      ))}
    </Accordion>
  );
}
