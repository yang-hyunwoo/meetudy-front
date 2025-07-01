"use client";

import { NOTICE_TYPE_DISPLAY_MAP } from "@/enum/contactEnum";

interface NoticeHeaderProps {
  title: string;
  createdAt: string;
  category?: string;
}

export default function NoticeHeader({
  title,
  createdAt,
  category,
}: NoticeHeaderProps) {
  return (
    <>
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          등록일: {createdAt}
        </div>
        {category && (
          <span className="inline-block text-xs font-medium px-2 py-1 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
            {}
            {NOTICE_TYPE_DISPLAY_MAP[category] ?? category}
          </span>
        )}
      </div>
    </>
  );
}
