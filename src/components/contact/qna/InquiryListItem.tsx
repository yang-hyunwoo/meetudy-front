"use client";

import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import clsx from "clsx";
import { QNA_TYPE_DISPLAY_MAP } from "@/enum/contactEnum";

interface InquiryListItemProps {
  id: string;
  questionTitle: string;
  questionContent: string;
  answer?: string;
  createdAt: string;
  qnaType: string;
  answerAt?: string;
  status: "답변대기" | "답변완료";
}

export default function InquiryListItem({
  id,
  questionTitle,
  questionContent,
  answer,
  createdAt,
  qnaType,
  answerAt,
  status,
}: InquiryListItemProps) {
  return (
    <AccordionItem value={id}>
      <AccordionTrigger className="text-left">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full">
          {/* 제목 + 카테고리 */}
          <div>
            <p className="font-medium">{questionTitle}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {QNA_TYPE_DISPLAY_MAP[qnaType] ?? qnaType} · {createdAt}
            </p>
          </div>

          {/*  상태 배지 + 답변일 (모바일 개선) */}
          <div className="mt-2 sm:mt-0 flex flex-row justify-end items-center gap-2">
            {status === "답변완료" && answerAt && (
              <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                답변일: {answerAt}
              </span>
            )}
            <span
              className={clsx(
                "text-xs font-semibold px-3 py-1 rounded-full inline-block",
                status === "답변대기"
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                  : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
              )}
            >
              {status}
            </span>
          </div>
        </div>
      </AccordionTrigger>

      {/*  문의 내용 + 답변 내용 */}
      <AccordionContent className="whitespace-pre-line text-sm text-gray-700 dark:text-gray-300">
        {questionContent}

        {status === "답변완료" && answerAt && answer && (
          <>
            <hr className="my-4 border-t border-gray-300 dark:border-gray-600" />
            <div>
              <p className="font-semibold mb-2">관리자 답변</p>
              <p className="whitespace-pre-line">{answer}</p>
            </div>
          </>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
