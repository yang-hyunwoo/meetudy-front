"use client";

import { useState } from "react";
import CustomPagination from "@/components/common/pagination/Pagination";
import NoticeListItem from "@/components/contact/notice/list/NoticeListItem";

interface Notice {
  id: string;
  title: string;
  createdAt: string;
  category?: "점검" | "이벤트" | "기능" | "기타";
}

const ITEMS_PER_PAGE = 10;

const mockNotices: Notice[] = [
  {
    id: "1",
    title: "서비스 점검 안내",
    createdAt: "2025-04-22",
    category: "점검",
  },
  {
    id: "2",
    title: "신규 기능 출시",
    createdAt: "2025-04-20",
    category: "기능",
  },
  {
    id: "3",
    title: "약관 변경 안내",
    createdAt: "2025-04-18",
    category: "기타",
  },
  {
    id: "4",
    title: "모바일 앱 출시",
    createdAt: "2025-04-15",
    category: "기능",
  },
  {
    id: "5",
    title: "이벤트 공지",
    createdAt: "2025-04-10",
    category: "이벤트",
  },
  {
    id: "6",
    title: "운영 정책 변경",
    createdAt: "2025-04-08",
    category: "기타",
  },
];

export default function NoticeList() {
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = mockNotices.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );
  const totalPages = Math.ceil(mockNotices.length / ITEMS_PER_PAGE);

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">공지사항</h1>

      {mockNotices.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          현재 등록된 공지사항이 없습니다.
        </p>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-md">
          {currentItems.map((notice) => (
            <NoticeListItem
              key={notice.id}
              id={notice.id}
              title={notice.title}
              createdAt={notice.createdAt}
              category={notice.category}
            />
          ))}
        </ul>
      )}

      {mockNotices.length > ITEMS_PER_PAGE && (
        <div className="mt-8 flex justify-center">
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
