"use client";

import { Accordion } from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import InquiryListItem from "@/components/contact/qna/InquiryListItem";
import { api } from "@/lib/axios";
import dayjs from "dayjs";

interface Inquiry {
  id: string;
  questionTitle: string;
  questionContent: string;
  answer?: string;
  createdAt: string;
  qnaType: string;
  answerAt?: string;
  status: "답변대기" | "답변완료";
}

export default function InquiryList() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const res = await api.get("/private/contact/qna/list");
        const content = res?.data?.data ?? [];
        console.log(content);
        const formattedData = content.map((item: any) => ({
          ...item,
          status: item.answerAt ? "답변완료" : "답변대기",
          createdAt: dayjs(item.createdAt).format("YYYY-MM-DD"),
          answerAt: item.answerAt
            ? dayjs(item.answerAt).format("YYYY-MM-DD")
            : undefined,
        }));
        setInquiries(formattedData);
      } catch (err: any) {
        setError(err.message || "데이터 로드 실패");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  if (isLoading) {
    return <div className="text-center py-6">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-6">{error}</div>;
  }

  if (inquiries.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-6">
        등록된 문의 내역이 없습니다.
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      {inquiries.map((item) => (
        <InquiryListItem key={item.id} {...item} />
      ))}
    </Accordion>
  );
}
