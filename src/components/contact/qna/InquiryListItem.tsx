"use client";

import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import clsx from "clsx";

interface InquiryListItemProps {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  status: "답변대기" | "답변완료";
  answeredAt?: string;
}

export default function InquiryListItem({
  id,
  title,
  content,
  category,
  createdAt,
  status,
  answeredAt,
}: InquiryListItemProps) {
  return (
    <AccordionItem value={id}>
      <AccordionTrigger className="text-left">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full">
          <div>
            <p className="font-medium">{title}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {category} · {createdAt}
            </p>
          </div>

          <div className="mt-2 sm:mt-0 flex flex-col sm:items-end text-right gap-1">
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
            {status === "답변완료" && answeredAt && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                답변일: {answeredAt}
              </span>
            )}
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className="whitespace-pre-line text-sm text-gray-700 dark:text-gray-300">
        {content}
      </AccordionContent>
    </AccordionItem>
  );
}
